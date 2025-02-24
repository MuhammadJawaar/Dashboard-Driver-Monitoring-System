import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { HistoriPelanggaran } from "@/types/histori_pelanggaran";

const prisma = new PrismaClient();

// Validasi schema dengan Zod
const pelanggaranSchema = z.object({
  waktu_pelanggaran: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Waktu pelanggaran tidak valid",
  }),
  jenis_pelanggaran: z.string().min(2, "Jenis pelanggaran minimal 2 karakter"),
  id_raspberrypi: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
});

// **GET ALL PELANGGARAN with Pagination & Include RaspberryPi**
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

    const totalPelanggaran = await prisma.histori_pelanggaran.count();

    const totalPages = Math.max(Math.ceil(totalPelanggaran / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const pelanggaran = await prisma.histori_pelanggaran.findMany({
      skip,
      take: limit,
      orderBy: { waktu_pelanggaran: "desc" },
      include: {
        raspberrypi: {
          include: {
            pengemudi: true, // **Menampilkan data pengemudi yang terhubung**
            Bus: true, // **Menampilkan data bus yang terhubung**
          },
        },
      },
    });

    return NextResponse.json({
      pelanggaran,
      pagination: {
        page: currentPage,
        limit,
        totalPages,
        totalPelanggaran,
      },
    });
  } catch (error) {
    console.error("Error fetching pelanggaran:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pelanggaran" },
      { status: 500 }
    );
  }
}

// **CREATE A NEW PELANGGARAN**
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Body request tidak boleh kosong" },
        { status: 400 }
      );
    }

    const parsedData = pelanggaranSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { waktu_pelanggaran, jenis_pelanggaran, id_raspberrypi, image } = parsedData.data;

    const newPelanggaran: HistoriPelanggaran = await prisma.histori_pelanggaran.create({
      data: {
        waktu_pelanggaran: new Date(waktu_pelanggaran),
        jenis_pelanggaran,
        id_raspberrypi: id_raspberrypi ?? undefined,
        image: image ?? undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newPelanggaran, { status: 201 });
  } catch (error: any) {
    console.error("Error creating pelanggaran:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
