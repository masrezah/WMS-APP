import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ==========================================
// POST: Merekam barang datang dari Supplier
// ==========================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { tenant_id, product_id, quantity, notes } = body;

    // 1. Validasi input
    if (!tenant_id || !product_id || !quantity) {
      return NextResponse.json(
        { error: "Field 'tenant_id', 'product_id', dan 'quantity' wajib diisi" }, 
        { status: 400 }
      );
    }

    // 2. Pastikan produk tersebut ada dan milik tenant yang bersangkutan
    const product = await prisma.product.findUnique({
      where: { id: product_id }
    });

    if (!product || product.tenant_id !== tenant_id) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan atau tidak sesuai dengan perusahaan ini" }, 
        { status: 404 }
      );
    }

    // 3. Catat penerimaan di TransactionLog (Barang diterima, tapi belum ditaruh di rak)
    const receivingLog = await prisma.transactionLog.create({
      data: {
        tenant_id,
        product_id,
        type: "INBOUND",
        quantity: parseInt(quantity),
        notes: notes || "Penerimaan dari Supplier (Staging Area)",
        // batch_id dibiarkan kosong karena belum di-put-away ke lokasi rak
      }
    });

    return NextResponse.json(
      { 
        message: `Berhasil menerima ${quantity} ${product.unit} ${product.name} di area penerimaan.`, 
        data: receivingLog 
      }, 
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}