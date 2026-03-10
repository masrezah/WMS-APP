import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ==========================================
// GET: Menampilkan Total Stok Barang Real-Time
// ==========================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    if (!tenant_id) {
      return NextResponse.json({ error: "tenant_id wajib disertakan" }, { status: 400 });
    }

    // Mengambil semua batch inventori dan menyertakan data relasi produk & lokasi
    const stocks = await prisma.inventoryBatch.findMany({
      where: { tenant_id },
      include: {
        product: {
          select: { sku: true, name: true, category: true, unit: true }
        },
        location: {
          select: { zone: true, rack: true, shelf: true, bin: true }
        }
      },
      orderBy: { entry_date: 'asc' } // Urutkan berdasarkan waktu masuk (untuk FIFO)
    });

    return NextResponse.json({ data: stocks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
