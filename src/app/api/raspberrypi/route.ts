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

// **GET ALL RASPBERRYPI with Pagination & Search**
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page dan limit harus bernilai positif" },
        { status: 400 }
      );
    }

    // Hitung total data dengan filter pencarian
    const totalRaspberryPi = await prisma.raspberrypi.count({
      where: {
        OR: [
          { pengemudi: { nama: { contains: query, mode: "insensitive" } } },
          { Bus: { plat_bus: { contains: query, mode: "insensitive" } } },
          { Bus: { merek: { contains: query, mode: "insensitive" } } },
          { id: { equals: isNaN(Number(query)) ? undefined : Number(query) } },           
        ],
      },
    });

    // Pastikan halaman tidak melebihi total
    const totalPages = Math.max(Math.ceil(totalRaspberryPi / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    // Ambil data dengan pencarian & pagination
    const raspberryPi = await prisma.raspberrypi.findMany({
      where: {
        OR: [
          { pengemudi: { nama: { contains: query, mode: "insensitive" } } },
          { Bus: { plat_bus: { contains: query, mode: "insensitive" } } },
          { Bus: { merek: { contains: query, mode: "insensitive" } } },
          { id: { equals: isNaN(Number(query)) ? undefined : Number(query) } }, 
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        pengemudi: {
          select: {
            nama: true,
          },
        },
        Bus: {
          select: {
            merek: true,
            plat_bus: true,
          },
        },
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

    const newRaspberryPi = await prisma.raspberrypi.create({
      data: {
        id_pengemudi: id_pengemudi ?? null,
        id_bus: id_bus ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        pengemudi: true, // Mengambil semua data pengemudi
        Bus: true, // Mengambil semua data bus
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

