import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryValuationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate total inventory value for a specific product using selected valuation method.
   */
  async calculateProductValue(tenantId: string, productId: string, method: 'FIFO' | 'MOVING_AVERAGE') {
    // Get all available batches currently in stock for this product
    const batches = await this.prisma.inventoryBatch.findMany({
      where: {
        tenant_id: tenantId,
        product_id: productId,
        quantity: { gt: 0 },
      },
      orderBy: { entry_date: 'asc' }, // Order by oldest first for FIFO
    });

    if (!batches.length) {
      return { productId, totalValue: 0, totalQuantity: 0, method };
    }

    let totalValue = 0;
    let totalQuantity = 0;

    if (method === 'FIFO') {
      // FIFO simply sums up the cost of the oldest remaining batches (which is what remains in inventory)
      for (const batch of batches) {
        const batchValue = batch.quantity * Number(batch.cost_per_unit || 0);
        totalValue += batchValue;
        totalQuantity += batch.quantity;
      }
    } else if (method === 'MOVING_AVERAGE') {
      // For a true moving average, we'd calculate from historical transactions.
      // For simplicity in this endpoint, we average the cost of remaining batches.
      let totalCostSum = 0;
      for (const batch of batches) {
        totalCostSum += batch.quantity * Number(batch.cost_per_unit || 0);
        totalQuantity += batch.quantity;
      }
      const movingAverageCost = totalCostSum / totalQuantity;
      totalValue = movingAverageCost * totalQuantity; // essentially identical to FIFO in this simple stock-on-hand snapshot
    } else {
      throw new BadRequestException('Unsupported valuation method');
    }

    return {
      productId,
      totalQuantity,
      totalValue,
      method,
    };
  }

  /**
   * Calculate total inventory value for all products of a tenant.
   */
  async calculateTenantInventoryValue(tenantId: string, method: 'FIFO' | 'MOVING_AVERAGE') {
    const products = await this.prisma.product.findMany({
      where: { tenant_id: tenantId },
      select: { id: true, sku: true, name: true },
    });

    let totalTenantValue = 0;
    const valuationDetails: any[] = [];

    for (const prod of products) {
      const valuation = await this.calculateProductValue(tenantId, prod.id, method);
      totalTenantValue += valuation.totalValue;
      valuationDetails.push({
        ...prod,
        quantity: valuation.totalQuantity,
        totalValue: valuation.totalValue,
      });
    }

    return {
      tenantId,
      method,
      totalTenantValue,
      details: valuationDetails,
    };
  }
}
