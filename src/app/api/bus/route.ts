import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// GET ALL BUSES
export async function GET() {
  try {
    const buses = await prisma.bus.findMany();
    return NextResponse.json(buses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch buses" }, { status: 500 });
  }
}

// CREATE A NEW BUS
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = randomUUID();
    const { plat_bus, merek, kapasitas, tahun_pembuatan } = body;
    
    const newBus = await prisma.bus.create({
      data: { id, plat_bus, merek, kapasitas, tahun_pembuatan },
    });

    return NextResponse.json(newBus, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create bus" }, { status: 500 });
  }
}
