import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Fungsi untuk mengambil semua stok barang sesuai perusahaan (tenant)
  async getStock(tenantId: string) {
    const stocks = await this.prisma.inventoryBatch.findMany({
      where: {
        tenant_id: tenantId, // <--- KUNCI ISOLASI DATA
      },
      include: {
        product: true,  // Join ke tabel Product
        location: true, // Join ke tabel Location
      },
    });

    return {
      message: 'Berhasil mengambil data stok',
      data: stocks,
    };
  }
}
