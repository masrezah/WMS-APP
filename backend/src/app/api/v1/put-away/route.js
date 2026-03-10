import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ==========================================
// POST: Menempatkan barang ke Rak (Put-Away)
// ==========================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { tenant_id, product_id, location_id, quantity, batch_no, expiry_date, cost_per_unit } = body;

    // 1. Validasi input
    if (!tenant_id || !product_id || !location_id || !quantity || cost_per_unit === undefined) {
      return NextResponse.json(
        { error: "Semua field wajib (tenant_id, product_id, location_id, quantity, cost_per_unit) harus diisi" }, 
        { status: 400 }
      );
    }

    // 2. Gunakan Prisma Transaction agar tabel InventoryBatch dan TransactionLog tersimpan bersamaan
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Buat data Inventory Batch (Stok fisik di rak)
      const newBatch = await tx.inventoryBatch.create({
        data: {
          tenant_id,
          product_id,
          location_id,
          quantity: parseInt(quantity),
          batch_no: batch_no || null,
          expiry_date: expiry_date ? new Date(expiry_date) : null,
          cost_per_unit: parseFloat(cost_per_unit)
        }
      });

      // B. Catat aktivitas put-away ke TransactionLog
      const putAwayLog = await tx.transactionLog.create({
        data: {
          tenant_id,
          product_id,
          batch_id: newBatch.id, // Sekarang kita hubungkan log dengan batch di rak
          type: "INBOUND",
          quantity: parseInt(quantity),
          notes: `Put-away ke rak. Batch No: ${batch_no || '-'}`
        }
      });

      return { newBatch, putAwayLog };
    });

    return NextResponse.json(
      { 
        message: "Barang berhasil ditempatkan di rak (Put-Away sukses)!", 
        data: result.newBatch 
      }, 
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}