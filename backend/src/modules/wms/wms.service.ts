import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type PickingStrategy = 'FIFO' | 'LIFO' | 'FEFO' | 'AVG';

@Injectable()
export class WmsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeStrategy(strategy?: string): PickingStrategy {
    if (!strategy) return 'FIFO';
    const normalized = strategy.toUpperCase();
    if (normalized === 'FIFO' || normalized === 'LIFO' || normalized === 'FEFO' || normalized === 'AVG') {
      return normalized;
    }
    throw new BadRequestException('strategy harus salah satu dari FIFO, LIFO, FEFO, AVG');
  }

  private createDocNumber(docType: string, sequence: number) {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${docType}/${yyyy}${mm}${dd}/${String(sequence).padStart(5, '0')}`;
  }

  async generateNumber(tenantId: string, docType = 'DO') {
    const totalLogs = await this.prisma.transactionLog.count({
      where: tenantId ? { tenant_id: tenantId } : undefined,
    });
    const generatedNumber = this.createDocNumber(docType.toUpperCase(), totalLogs + 1);
    return {
      generated_number: generatedNumber,
      timestamp: new Date().toISOString(),
    };
  }

  async receiving(body: any) {
    const {
      tenant_id,
      product_id,
      quantity,
      po_number,
      supplier_name,
      arrival_date,
      inspection_status,
      unloading_status,
      notes,
    } = body;

    if (!tenant_id || !product_id || !quantity) {
      throw new BadRequestException('tenant_id, product_id, dan quantity wajib diisi');
    }

    const product = await this.prisma.product.findUnique({ where: { id: product_id } });
    if (!product || product.tenant_id !== tenant_id) {
      throw new NotFoundException('Produk tidak ditemukan atau tidak sesuai tenant');
    }

    const receivingLog = await this.prisma.transactionLog.create({
      data: {
        tenant_id,
        product_id,
        type: 'INBOUND',
        quantity: Number(quantity),
        notes:
          notes ||
          `Receiving PO:${po_number || '-'} Supplier:${supplier_name || '-'} Arrival:${arrival_date || '-'} Inspection:${inspection_status || 'GOOD'} Unloading:${unloading_status || 'DONE'}`,
      },
    });

    return {
      message: 'Receiving berhasil dicatat',
      data: receivingLog,
      next_step: 'PUT_AWAY',
    };
  }

  async putAway(body: any) {
    const { tenant_id, product_id, location_id, quantity, batch_no, expiry_date, cost_per_unit } = body;

    if (!tenant_id || !product_id || !location_id || !quantity || cost_per_unit === undefined) {
      throw new BadRequestException('tenant_id, product_id, location_id, quantity, cost_per_unit wajib diisi');
    }

    const location = await this.prisma.location.findUnique({
      where: { id: location_id },
      include: { warehouse: true },
    });
    if (!location || location.warehouse.tenant_id !== tenant_id) {
      throw new NotFoundException('Lokasi tidak ditemukan atau tidak sesuai tenant');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const newBatch = await tx.inventoryBatch.create({
        data: {
          tenant_id,
          product_id,
          location_id,
          quantity: Number(quantity),
          batch_no: batch_no || null,
          expiry_date: expiry_date ? new Date(expiry_date) : null,
          cost_per_unit: Number(cost_per_unit),
        },
      });

      await tx.transactionLog.create({
        data: {
          tenant_id,
          product_id,
          batch_id: newBatch.id,
          type: 'INBOUND',
          quantity: Number(quantity),
          notes: `Put-away ke ${location.zone}-${location.rack}-${location.shelf}-${location.bin}`,
        },
      });

      return newBatch;
    });

    return { message: 'Put-away berhasil', data: result };
  }

  async getStock(tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenant_id wajib diisi');
    const stocks = await this.prisma.inventoryBatch.findMany({
      where: { tenant_id: tenantId },
      include: {
        product: {
          select: { sku: true, name: true, category: true, unit: true },
        },
        location: {
          select: { zone: true, rack: true, shelf: true, bin: true },
        },
      },
      orderBy: { entry_date: 'asc' },
    });
    return { data: stocks };
  }

  async stockOpname(body: any) {
    const { tenant_id, batch_id, physical_quantity, notes } = body;
    if (!tenant_id || !batch_id || physical_quantity === undefined) {
      throw new BadRequestException('tenant_id, batch_id, physical_quantity wajib diisi');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const batch = await tx.inventoryBatch.findUnique({ where: { id: batch_id } });
      if (!batch || batch.tenant_id !== tenant_id) {
        throw new NotFoundException('Batch tidak ditemukan atau tidak sesuai tenant');
      }

      const physical = Number(physical_quantity);
      const diff = physical - batch.quantity;
      if (diff === 0) {
        return { message: 'Stok fisik sesuai sistem, tidak ada perubahan', difference: 0, batch };
      }

      const updatedBatch = await tx.inventoryBatch.update({
        where: { id: batch_id },
        data: { quantity: physical },
      });

      await tx.transactionLog.create({
        data: {
          tenant_id,
          product_id: batch.product_id,
          batch_id: batch.id,
          type: 'ADJUSTMENT',
          quantity: diff,
          notes: notes || `Stock Opname: sistem ${batch.quantity}, fisik ${physical}`,
        },
      });

      return { message: 'Stock Opname berhasil disimpan', difference: diff, batch: updatedBatch };
    });

    return result;
  }

  async checkOrder(tenantId: string, productId: string) {
    if (!tenantId || !productId) throw new BadRequestException('tenant_id dan product_id wajib diisi');
    const inventory = await this.prisma.inventoryBatch.aggregate({
      where: { tenant_id: tenantId, product_id: productId },
      _sum: { quantity: true },
    });
    return {
      product_id: productId,
      total_stock: inventory._sum.quantity || 0,
    };
  }

  async pickOrder(body: any) {
    const { tenant_id, product_id, required_quantity, strategy } = body;
    if (!tenant_id || !product_id || !required_quantity) {
      throw new BadRequestException('tenant_id, product_id, required_quantity wajib diisi');
    }

    const parsedStrategy = this.normalizeStrategy(strategy);
    let orderBy: any = { entry_date: 'asc' };
    if (parsedStrategy === 'LIFO') orderBy = { entry_date: 'desc' };
    if (parsedStrategy === 'FEFO') orderBy = { expiry_date: 'asc' };

    const result = await this.prisma.$transaction(async (tx) => {
      const batches = await tx.inventoryBatch.findMany({
        where: { tenant_id, product_id, quantity: { gt: 0 } },
        orderBy,
      });

      let remaining = Number(required_quantity);
      const picked: { batch_id: string; quantity_taken: number; unit_cost: number }[] = [];

      for (const batch of batches) {
        if (remaining <= 0) break;
        const take = Math.min(batch.quantity, remaining);

        await tx.inventoryBatch.update({
          where: { id: batch.id },
          data: { quantity: { decrement: take } },
        });

        await tx.transactionLog.create({
          data: {
            tenant_id,
            product_id,
            batch_id: batch.id,
            type: 'OUTBOUND',
            quantity: -take,
            notes: `Picking strategy: ${parsedStrategy}`,
          },
        });

        picked.push({
          batch_id: batch.id,
          quantity_taken: take,
          unit_cost: Number(batch.cost_per_unit),
        });
        remaining -= take;
      }

      if (remaining > 0) {
        throw new BadRequestException('Stok tidak mencukupi untuk memenuhi order');
      }

      const totalQty = picked.reduce((acc, item) => acc + item.quantity_taken, 0);
      const totalCost = picked.reduce((acc, item) => acc + item.quantity_taken * item.unit_cost, 0);
      const averageCost = totalQty > 0 ? totalCost / totalQty : 0;

      return {
        picked,
        valuation: {
          method: parsedStrategy,
          average_cost: Number(averageCost.toFixed(2)),
          total_cost: Number(totalCost.toFixed(2)),
        },
      };
    });

    return { message: 'Picking berhasil', data: result };
  }

  async shipment(body: any) {
    const { tenant_id, product_id, quantity, tracking_number, schedule_date, carrier, driver_name, vehicle_no } = body;
    if (!tenant_id || !product_id || !quantity) {
      throw new BadRequestException('tenant_id, product_id, dan quantity wajib diisi');
    }

    const qty = Number(quantity);
    if (qty <= 0) throw new BadRequestException('quantity harus lebih besar dari 0');

    const currentStock = await this.prisma.inventoryBatch.aggregate({
      where: { tenant_id, product_id },
      _sum: { quantity: true },
    });
    const available = currentStock._sum.quantity || 0;
    if (available < qty) {
      throw new BadRequestException(`Stok tidak cukup untuk shipment. Tersedia ${available}, diminta ${qty}`);
    }

    const generated = await this.generateNumber(tenant_id, 'DO');

    const result = await this.prisma.$transaction(async (tx) => {
      const batches = await tx.inventoryBatch.findMany({
        where: { tenant_id, product_id, quantity: { gt: 0 } },
        orderBy: { entry_date: 'asc' },
      });

      let remaining = qty;
      for (const batch of batches) {
        if (remaining <= 0) break;
        const take = Math.min(batch.quantity, remaining);
        await tx.inventoryBatch.update({
          where: { id: batch.id },
          data: { quantity: { decrement: take } },
        });
        remaining -= take;
      }

      const shipmentLog = await tx.transactionLog.create({
        data: {
          tenant_id,
          product_id,
          type: 'OUTBOUND',
          quantity: -qty,
          notes: `Shipment ${generated.generated_number} Tracking:${tracking_number || '-'} Schedule:${schedule_date || '-'} Carrier:${carrier || '-'} Driver:${driver_name || '-'} Vehicle:${vehicle_no || '-'}`,
        },
      });

      return shipmentLog;
    });

    return {
      message: 'Shipment berhasil dicatat',
      do_number: generated.generated_number,
      data: result,
    };
  }

  async getTransactionLogs(tenantId: string, limit = 50) {
    if (!tenantId) throw new BadRequestException('tenant_id wajib diisi');
    const logs = await this.prisma.transactionLog.findMany({
      where: { tenant_id: tenantId },
      include: {
        product: { select: { sku: true, name: true, unit: true } },
      },
      orderBy: { created_at: 'desc' },
      take: Math.min(Math.max(limit, 1), 200),
    });
    return { data: logs };
  }

  async listWarehouses(tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenant_id wajib diisi');
    const data = await this.prisma.warehouse.findMany({
      where: { tenant_id: tenantId },
      orderBy: { name: 'asc' },
    });
    return { data };
  }

  async createWarehouse(body: any) {
    const { tenant_id, name, type, method, layout_type, address } = body;
    if (!tenant_id || !name) throw new BadRequestException('tenant_id dan name wajib diisi');

    const allowedLayouts = ['Garis Lurus Sederhana', 'U Shape', 'L Shape', 'Random'];
    if (layout_type && !allowedLayouts.includes(layout_type)) {
      throw new BadRequestException('layout_type tidak valid');
    }

    const warehouse = await this.prisma.warehouse.create({
      data: {
        tenant_id,
        name,
        type: type || 'Private',
        method: method || 'FIFO',
        layout_type: layout_type || 'Garis Lurus Sederhana',
        address: address || null,
      },
    });

    return {
      message: 'Warehouse berhasil dibuat',
      data: warehouse,
    };
  }

  async generateLocations(body: any) {
    const { warehouse_id, zone, total_racks, total_shelves, total_bins } = body;
    if (!warehouse_id || !zone || !total_racks || !total_shelves || !total_bins) {
      throw new BadRequestException('warehouse_id, zone, total_racks, total_shelves, total_bins wajib diisi');
    }

    const warehouse = await this.prisma.warehouse.findUnique({ where: { id: warehouse_id } });
    if (!warehouse) throw new NotFoundException('Gudang tidak ditemukan');

    const locations: { warehouse_id: string; zone: string; rack: string; shelf: string; bin: string }[] = [];
    for (let r = 1; r <= Number(total_racks); r += 1) {
      for (let s = 1; s <= Number(total_shelves); s += 1) {
        for (let b = 1; b <= Number(total_bins); b += 1) {
          locations.push({
            warehouse_id,
            zone: String(zone).toUpperCase(),
            rack: `Rack ${String(r).padStart(2, '0')}`,
            shelf: `Level ${s}`,
            bin: `Bin ${b}`,
          });
        }
      }
    }

    const result = await this.prisma.location.createMany({
      data: locations,
      skipDuplicates: true,
    });

    return {
      message: `${result.count} lokasi berhasil dibuat`,
      sample_data: locations.slice(0, 5),
    };
  }
}
