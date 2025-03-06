import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API is working!' }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ message: 'Received data', data: body }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
