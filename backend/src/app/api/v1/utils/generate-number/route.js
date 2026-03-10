import { NextResponse } from 'next/server';

export async function GET() {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  // Format: DO/20260310/ABC12
  const docNumber = `DO/${dateStr}/${randomStr}`;

  return NextResponse.json({ 
    generated_number: docNumber,
    timestamp: date.toISOString()
  });
}
