import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');
    const product_id = searchParams.get('product_id');

    if (!tenant_id || !product_id) {
      return NextResponse.json({ error: "tenant_id dan product_id wajib diisi" }, { status: 400 });
    }

    const inventory = await prisma.inventoryBatch.aggregate({
      where: { tenant_id, product_id },
      _sum: { quantity: true }
    });

    return NextResponse.json({ 
      product_id,
      total_stock: inventory._sum.quantity || 0 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
