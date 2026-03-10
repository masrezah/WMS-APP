import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // 1. Fungsi untuk mengambil semua stok barang sesuai perusahaan (tenant)
  async getStock(tenantId: string) {
    const db = this.prisma.withTenant(tenantId);

    const stocks = await db.inventoryBatch.findMany({
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

  // 2. Fungsi untuk mendaftarkan barang baru (Master Data Product)
  async createProduct(tenantId: string, data: any) {
    const db = this.prisma.withTenant(tenantId);

    const newProduct = await db.product.create({
      // Tambahkan 'as any' di sini buat nyuruh TypeScript tutup mulut
      data: {
        sku: data.sku,
        name: data.name,
        category: data.category, 
      } as any, 
    });

    return {
      message: 'Produk berhasil ditambahkan ke master data!',
      data: newProduct,
    };
  }
}