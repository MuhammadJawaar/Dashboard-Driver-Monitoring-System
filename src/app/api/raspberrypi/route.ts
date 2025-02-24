import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { RaspberryPi } from "@/types/raspberrypi";

const prisma = new PrismaClient();

// Validasi schema dengan Zod
const raspberryPiSchema = z.object({
  id_pengemudi: z.string().uuid().nullable().optional(),
  id_bus: z.string().uuid().nullable().optional(),
});

// **GET ALL RASPBERRYPI with Pagination**
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page dan limit harus bernilai positif" },
        { status: 400 }
      );
    }

    const totalRaspberryPi = await prisma.raspberrypi.count();

    const totalPages = Math.max(Math.ceil(totalRaspberryPi / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const raspberryPi = await prisma.raspberrypi.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        pengemudi: true, // Ambil data pengemudi yang terhubung
        Bus: true, // Ambil data bus yang terhubung
      },
    });

    return NextResponse.json({
      raspberryPi,
      pagination: {
        page: currentPage,
        limit,
        totalPages,
        totalRaspberryPi,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data RaspberryPi" },
      { status: 500 }
    );
  }
}

// **CREATE A NEW RASPBERRYPI**
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Body request tidak boleh kosong" },
        { status: 400 }
      );
    }

    const parsedData = raspberryPiSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { id_pengemudi, id_bus } = parsedData.data;

    const newRaspberryPi: RaspberryPi = await prisma.raspberrypi.create({
      data: {
        id_pengemudi: id_pengemudi ?? null,
        id_bus: id_bus ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newRaspberryPi, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
