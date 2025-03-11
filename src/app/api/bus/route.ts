import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Bus } from "@/types/bus"; // Import interface
import { ensureAuth } from "@/lib/authApi";
const prisma = new PrismaClient();

// Validasi schema dengan Zod
const busSchema = z.object({
  plat_bus: z.string().min(3, "Plat bus minimal 3 karakter"),
  merek: z.string().min(2, "Merek minimal 2 karakter"),
  kapasitas: z.number().min(1, "Kapasitas harus lebih dari 0"),
  tahun_pembuatan: z
    .number()
    .min(1900, "Tahun pembuatan tidak valid")
    .max(new Date().getFullYear(), "Tahun pembuatan tidak boleh lebih dari tahun sekarang"),
});

// **GET ALL BUSES with Search & Pagination**
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;
    
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

    // Hitung total data
    const totalBuses = await prisma.bus.count({
      where: {
        OR: [
          { plat_bus: { contains: query, mode: "insensitive" } },
          { merek: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    // Pastikan halaman tidak melebihi total
    const totalPages = Math.max(Math.ceil(totalBuses / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    // Ambil data dengan pencarian & pagination
    const buses: Bus[] = await prisma.bus.findMany({
      where: {
        OR: [
          { plat_bus: { contains: query, mode: "insensitive" } },
          { merek: { contains: query, mode: "insensitive" } },
        ],
      },
      skip,
      take: limit,
      orderBy: { tahun_pembuatan: "desc" },
    });

    return NextResponse.json({
      buses: buses ?? [],
      pagination: {
        page: currentPage,
        limit,
        totalPages,
        totalBuses,
      },
    });
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data bus" },
      { status: 500 }
    );
  }
}

// **CREATE A NEW BUS**
export async function POST(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Body request tidak boleh kosong" },
        { status: 400 }
      );
    }

    const parsedData = busSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { plat_bus, merek, kapasitas, tahun_pembuatan } = parsedData.data;

    const newBus: Bus = await prisma.bus.create({
      data: {
        id: randomUUID(),
        plat_bus,
        merek,
        kapasitas,
        tahun_pembuatan,
      },
    });

    return NextResponse.json(newBus, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bus:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Plat bus sudah terdaftar" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
