import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');

    if (!tenant_id) return NextResponse.json({ error: "tenant_id wajib ada" }, { status: 400 });

    // Menghitung frekuensi transaksi per produk dalam 30 hari terakhir
    const stats = await prisma.transactionLog.groupBy({
      by: ['product_id'],
      where: { 
        tenant_id,
        type: 'OUTBOUND',
        created_at: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
      },
      _count: { id: true },
      _sum: { quantity: true }
    });

    return NextResponse.json({ 
      message: "Analitik 30 Hari Terakhir",
      data: stats.map(s => ({
        product_id: s.product_id,
        frequency: s._count.id,
        total_out: Math.abs(s._sum.quantity || 0),
        status: s._count.id > 10 ? 'FAST MOVING' : s._count.id > 5 ? 'INTERMEDIATE' : 'SLOW MOVING'
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
