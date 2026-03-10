import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { tenant_id, product_id, required_quantity, strategy } = await request.json();

    if (!tenant_id || !product_id || !required_quantity) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Tentukan urutan berdasarkan strategi (Default FIFO)
    let orderBy = { entry_date: 'asc' }; 
    if (strategy === 'LIFO') orderBy = { entry_date: 'desc' };
    if (strategy === 'FEFO') orderBy = { expiry_date: 'asc' };

    const result = await prisma.$transaction(async (tx) => {
      const batches = await tx.inventoryBatch.findMany({
        where: { tenant_id, product_id, quantity: { gt: 0 } },
        orderBy: orderBy
      });

      let remaining = parseInt(required_quantity);
      let picked = [];

      for (const batch of batches) {
        if (remaining <= 0) break;
        let take = Math.min(batch.quantity, remaining);
        
        await tx.inventoryBatch.update({
          where: { id: batch.id },
          data: { quantity: { decrement: take } }
        });

        await tx.transactionLog.create({
          data: {
            tenant_id, product_id, batch_id: batch.id,
            type: "OUTBOUND", quantity: -take,
            notes: `Picking strategy: ${strategy || 'FIFO'}`
          }
        });

        picked.push({ batch_id: batch.id, quantity_taken: take });
        remaining -= take;
      }

      if (remaining > 0) throw new Error("Stok tidak mencukupi untuk memenuhi order.");
      return picked;
    });

    return NextResponse.json({ message: "Picking Berhasil", data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
