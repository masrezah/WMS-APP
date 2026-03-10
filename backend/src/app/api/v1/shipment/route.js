import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { tenant_id, product_id, quantity, tracking_number } = await request.json();

    const shipment = await prisma.transactionLog.create({
      data: {
        tenant_id,
        product_id,
        type: "OUTBOUND",
        quantity: -parseInt(quantity),
        notes: `Shipment Sent. Tracking: ${tracking_number}`
      }
    });

    return NextResponse.json({ message: "Shipment recorded", data: shipment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
