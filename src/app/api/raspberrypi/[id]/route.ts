import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema validasi untuk update
const raspberryPiSchema = z.object({
  id_pengemudi: z.string().uuid().nullable().optional(),
  id_bus: z.string().uuid().nullable().optional(),
});

// **GET RaspberryPi by ID**
export async function GET(req: Request) {
  try {
    const id = Number(req.url.split("/").pop()); // Gunakan context.params.id
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    const raspberryPi = await prisma.raspberrypi.findUnique({
      where: { id },
      include: {
        pengemudi: { select: { nama: true } },
        Bus: { select: { merek: true, plat_bus: true } },
      },
    });

    if (!raspberryPi) {
      return NextResponse.json({ error: "RaspberryPi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(raspberryPi);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// **UPDATE RaspberryPi by ID**
export async function PUT(req: Request) {
  try {
    const id = Number(req.url.split("/").pop());
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    const body = await req.json();
    const parsedData = raspberryPiSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ errors: parsedData.error.format() }, { status: 400 });
    }

    const { id_pengemudi, id_bus } = parsedData.data;

    const updatedRaspberryPi = await prisma.raspberrypi.update({
      where: { id },
      data: {
        id_pengemudi: id_pengemudi ?? null,
        id_bus: id_bus ?? null,
        updatedAt: new Date(),
      },
      include: {
        pengemudi: { select: { nama: true } },
        Bus: { select: { merek: true, plat_bus: true } },
      },
    });

    return NextResponse.json(updatedRaspberryPi);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "RaspberryPi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// **DELETE RaspberryPi by ID**
export async function DELETE(req: Request) {
  try {
    const id = Number(req.url.split("/").pop());
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    const deleted = await prisma.raspberrypi.delete({
      where: { id },
    });

    return NextResponse.json({ message: "RaspberryPi berhasil dihapus", deleted });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "RaspberryPi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
