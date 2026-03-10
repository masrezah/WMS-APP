import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ==========================================
// GET: Mengambil daftar lokasi di sebuah gudang
// ==========================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouse_id = searchParams.get('warehouse_id');

    if (!warehouse_id) {
      return NextResponse.json(
        { error: "warehouse_id wajib disertakan" }, 
        { status: 400 }
      );
    }

    const locations = await prisma.location.findMany({
      where: { warehouse_id },
      orderBy: [
        { zone: 'asc' },
        { rack: 'asc' },
        { shelf: 'asc' },
        { bin: 'asc' }
      ]
    });

    return NextResponse.json({ data: locations }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// POST: Generate / Auto-Create Lokasi (Rak & Palet)
// ==========================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { warehouse_id, zone, total_racks, total_shelves, total_bins } = body;

    // Validasi input
    if (!warehouse_id || !zone || !total_racks || !total_shelves || !total_bins) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (warehouse_id, zone, total_racks, total_shelves, total_bins)" }, 
        { status: 400 }
      );
    }

    // 1. Pastikan gudang tersebut ada di database
    const warehouseExists = await prisma.warehouse.findUnique({
      where: { id: warehouse_id }
    });

    if (!warehouseExists) {
      return NextResponse.json(
        { error: "Gudang tidak ditemukan" }, 
        { status: 404 }
      );
    }

    const locations = [];

    // 2. Perulangan (Nested Loop) untuk membuat kombinasi lokasi
    for (let r = 1; r <= total_racks; r++) {
      for (let s = 1; s <= total_shelves; s++) {
        for (let b = 1; b <= total_bins; b++) {
          
          // Format penamaan, contoh: Rack 01, Rack 02
          const rackCode = r.toString().padStart(2, '0');
          
          locations.push({
            warehouse_id: warehouse_id,
            zone: zone.toUpperCase(), // Pastikan Zona selalu huruf besar (misal 'A')
            rack: `Rack ${rackCode}`,
            shelf: `Level ${s}`,
            bin: `Bin ${b}`,
          });
        }
      }
    }

    // 3. Insert banyak data sekaligus ke database (Bulk Insert)
    const createdLocations = await prisma.location.createMany({
      data: locations,
      skipDuplicates: true, // Abaikan jika lokasi yang sama persis sudah pernah dibuat
    });

    return NextResponse.json(
      { 
        message: `${createdLocations.count} titik lokasi berhasil di-generate untuk Gudang ${warehouseExists.name}!`,
        sample_data: locations.slice(0, 3) // Tampilkan 3 data pertama sebagai preview
      }, 
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}