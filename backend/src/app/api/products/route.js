import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ==========================================
// GET: Mengambil daftar produk (Read)
// ==========================================
export async function GET(request) {
  try {
    // Mengambil parameter URL, misal: /api/products?tenant_id=xxx
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    // Wajib ada tenant_id untuk isolasi data SaaS
    if (!tenant_id) {
      return NextResponse.json(
        { error: "tenant_id wajib disertakan" }, 
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        tenant_id: tenant_id
      },
      orderBy: {
        created_at: 'desc' // Urutkan dari yang terbaru
      }
    });

    return NextResponse.json({ data: products }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// POST: Menambah produk baru (Create)
// ==========================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { tenant_id, sku, name, category, unit } = body;

    // Validasi input sederhana
    if (!tenant_id || !sku || !name || !category || !unit) {
      return NextResponse.json(
        { error: "Semua field (tenant_id, sku, name, category, unit) wajib diisi" }, 
        { status: 400 }
      );
    }

    // Insert ke database menggunakan Prisma
    const newProduct = await prisma.product.create({
      data: {
        tenant_id,
        sku,
        name,
        category, // Harus sesuai ENUM, misal: "RAW_MATERIAL" atau "FINISHED_GOOD"
        unit
      }
    });

    return NextResponse.json(
      { message: "Produk berhasil ditambahkan", data: newProduct }, 
      { status: 201 }
    );

  } catch (error) {
    // Tangani error jika SKU sudah ada untuk tenant tersebut (Unique Constraint Prisma)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: `SKU '${body.sku}' sudah digunakan di perusahaan ini.` }, 
        { status: 409 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}