import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// ==========================================
// POST: Mencatat Hasil Stock Opname
// ==========================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { tenant_id, batch_id, physical_quantity, notes } = body;

    if (!tenant_id || !batch_id || physical_quantity === undefined) {
      return NextResponse.json({ error: "Field tenant_id, batch_id, dan physical_quantity wajib diisi" }, { status: 400 });
    }

    // Gunakan Prisma Transaction untuk update stok dan catat log bersamaan
    const result = await prisma.$transaction(async (tx) => {
      // 1. Cek data batch saat ini di sistem
      const batch = await tx.inventoryBatch.findUnique({
        where: { id: batch_id }
      });
      
      if (!batch || batch.tenant_id !== tenant_id) {
        throw new Error("Data batch tidak ditemukan atau tidak sesuai perusahaan.");
      }

      const system_quantity = batch.quantity;
      const diff = parseInt(physical_quantity) - system_quantity;

      // Jika jumlah fisik sama dengan sistem, tidak perlu ada penyesuaian
      if (diff === 0) {
        return { message: "Stok fisik sesuai dengan sistem, tidak ada perubahan.", batch, diff: 0 };
      }

      // 2. Update stok di InventoryBatch sesuai fisik aktual
      const updatedBatch = await tx.inventoryBatch.update({
        where: { id: batch_id },
        data: { quantity: parseInt(physical_quantity) }
      });

      // 3. Catat ke TransactionLog sebagai ADJUSTMENT
      await tx.transactionLog.create({
        data: {
          tenant_id,
          product_id: batch.product_id,
          batch_id: batch.id,
          type: "ADJUSTMENT",
          quantity: diff, // Akan positif (selisih lebih) atau negatif (selisih kurang/hilang)
          notes: notes || `Stock Opname: Sistem ${system_quantity}, Fisik aktual ${physical_quantity}`
        }
      });

      return { 
        message: "Penyesuaian Stock Opname berhasil dicatat.", 
        batch: updatedBatch, 
        difference: diff 
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
