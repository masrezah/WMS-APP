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
        product: true, // Join ke tabel Product
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

  // 3. Fungsi untuk mengambil semua daftar master produk
  async getProducts(tenantId: string, search?: string, category?: string) {
    const db = this.prisma.withTenant(tenantId);
    
    // Filter pencarian sederhana
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }
    // Jika ada filter kategori, bisa ditambahkan di sini

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });

    // Map data untuk menghindari error "price undefined" di frontend
    // Karena di Prisma belum ada "price", kita set 0 dulu
    return products.map((product: any) => ({
      ...product,
      price: 0, 
    }));
  }
}
