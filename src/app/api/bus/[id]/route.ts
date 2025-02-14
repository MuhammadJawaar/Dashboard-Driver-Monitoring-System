import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET BUS BY ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const bus = await prisma.bus.findUnique({ where: { id } });

    if (!bus) return NextResponse.json({ error: "Bus not found" }, { status: 404 });

    return NextResponse.json(bus);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bus" }, { status: 500 });
  }
}

// UPDATE BUS
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { plat_bus, merek, kapasitas, tahun_pembuatan } = body;

    const updatedBus = await prisma.bus.update({
      where: { id },
      data: { plat_bus, merek, kapasitas, tahun_pembuatan },
    });

    return NextResponse.json(updatedBus);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update bus" }, { status: 500 });
  }
}

// DELETE BUS
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.bus.delete({ where: { id } });

    return NextResponse.json({ message: "Bus deleted" }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete bus" }, { status: 500 });
  }
}
