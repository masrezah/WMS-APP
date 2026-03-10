import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ==========================================
// GET: Mengambil daftar gudang (Read)
// ==========================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    // Wajib ada tenant_id untuk isolasi data SaaS
    if (!tenant_id) {
      return NextResponse.json(
        { error: "tenant_id wajib disertakan" }, 
        { status: 400 }
      );
    }

    const warehouses = await prisma.warehouse.findMany({
      where: {
        tenant_id: tenant_id
      }
    });

    return NextResponse.json({ data: warehouses }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// POST: Menambah gudang baru (Create)
// ==========================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { tenant_id, name, type, method, layout_type, address } = body;

    // Validasi input dasar
    if (!tenant_id || !name) {
      return NextResponse.json(
        { error: "Field 'tenant_id' dan 'name' wajib diisi" }, 
        { status: 400 }
      );
    }

    // Insert ke database menggunakan Prisma
    const newWarehouse = await prisma.warehouse.create({
      data: {
        tenant_id,
        name,
        type: type || "Private", // Default jika kosong
        method: method || "FIFO", // Default metode stok
        layout_type: layout_type || "Garis Lurus Sederhana",
        address: address || null
      }
    });

    return NextResponse.json(
      { message: "Gudang berhasil ditambahkan", data: newWarehouse }, 
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}