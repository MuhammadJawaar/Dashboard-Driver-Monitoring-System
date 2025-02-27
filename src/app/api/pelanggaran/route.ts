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

// **GET ALL PELANGGARAN with Search, Date Filter, Pagination & Include RaspberryPi**
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

    // Validasi rentang tanggal jika ada
    let dateFilter: any = {};
    if (startDate && !isNaN(Date.parse(startDate))) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate && !isNaN(Date.parse(endDate))) {
      dateFilter.lte = new Date(endDate);
    }

    // Filter pencarian
    let searchFilter: any = {};
    if (query) {
      searchFilter.OR = [
        { jenis_pelanggaran: { contains: query, mode: "insensitive" } },
        { id_raspberrypi: { equals: isNaN(Number(query)) ? undefined : Number(query) } },
        { raspberrypi: { pengemudi: { nama: { contains: query, mode: "insensitive" } } } },
      ];
    }

    // Hitung total data sesuai filter
    const totalPelanggaran = await prisma.histori_pelanggaran.count({
      where: {
        ...searchFilter,
        waktu_pelanggaran: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
    });

    // Pastikan halaman tidak melebihi total
    const totalPages = Math.max(Math.ceil(totalPelanggaran / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    // Ambil data sesuai filter
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
