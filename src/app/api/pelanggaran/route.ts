import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { HistoriPelanggaran } from "@/types/histori_pelanggaran";

const API_KEY = process.env.API_KEY || "Y2KpV7!M@x5N#X&dL9F8eT$B*CwR3hJ";

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

// ✅ **GET: Tidak membutuhkan API Key**
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page dan limit harus bernilai positif" },
        { status: 400 }
      );
    }

    let dateFilter: any = {};
    if (startDate && !isNaN(Date.parse(startDate))) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate && !isNaN(Date.parse(endDate))) {
      dateFilter.lte = new Date(endDate);
    }

    let searchFilter: any = {};
    if (query) {
      searchFilter.OR = [
        { jenis_pelanggaran: { contains: query, mode: "insensitive" } },
        { id_raspberrypi: { equals: isNaN(Number(query)) ? undefined : Number(query) } },
        { raspberrypi: { pengemudi: { nama: { contains: query, mode: "insensitive" } } } },
      ];
    }

    const totalPelanggaran = await prisma.histori_pelanggaran.count({
      where: {
        ...searchFilter,
        waktu_pelanggaran: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
    });

    const totalPages = Math.max(Math.ceil(totalPelanggaran / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const pelanggaran = await prisma.histori_pelanggaran.findMany({
      where: {
        ...searchFilter,
        waktu_pelanggaran: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      skip,
      take: limit,
      orderBy: { waktu_pelanggaran: "desc" },
      include: {
        raspberrypi: {
          include: {
            pengemudi: true,
            Bus: true,
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

// ✅ **POST: Harus menyertakan API Key**
export async function POST(req: Request) {
  try {
    // 🔒 Cek API Key terlebih dahulu
    const apiKeyHeader = req.headers.get("X-API-KEY");


    if (!apiKeyHeader || apiKeyHeader !== API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validasi data dengan Zod
    const validation = pelanggaranSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validation.error.format() },
        { status: 400 }
      );
    }

    // Simpan data ke database
    const newPelanggaran = await prisma.histori_pelanggaran.create({
      data: {
        waktu_pelanggaran: new Date(body.waktu_pelanggaran),
        jenis_pelanggaran: body.jenis_pelanggaran,
        id_raspberrypi: body.id_raspberrypi || null,
        image: body.image || null,
      },
    });

    return NextResponse.json(
      { message: "Pelanggaran berhasil disimpan", data: newPelanggaran },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pelanggaran:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data pelanggaran" },
      { status: 500 }
    );
  }
}
