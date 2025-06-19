import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client"; // ✅ tambahkan `Prisma` di sini
import { z } from "zod";
import { ensureAuth } from "@/lib/authApi";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Singleton Prisma Instance
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Zod Schema
const pelanggaranSchema = z.object({
  waktu_pelanggaran: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Waktu pelanggaran tidak valid",
  }),
  jenis_pelanggaran: z.string().min(2, "Jenis pelanggaran minimal 2 karakter"),
  id_raspberrypi: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
});

// 🔍 Helper untuk filter pencarian
function buildSearchFilter(query: string) {
  if (!query) return {};

  return {
    OR: [
      {
        jenis_pelanggaran: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        id_raspberrypi: {
          equals: isNaN(Number(query)) ? undefined : Number(query),
        },
      },
      {
        raspberrypi: {
          pengemudi: {
            nama: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      },
    ],
  };
}

// 📥 GET: Ambil semua pelanggaran (dengan filter & pagination)
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: "Page dan limit harus bernilai positif" }, { status: 400 });
    }

    // Date parsing
    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate && !isNaN(Date.parse(startDate))) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate && !isNaN(Date.parse(endDate))) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    if (dateFilter.gte && dateFilter.lte && dateFilter.gte > dateFilter.lte) {
      return NextResponse.json({ error: "Tanggal mulai tidak boleh lebih besar dari tanggal akhir" }, { status: 400 });
    }

    // Explicit filter object
    const whereCond: Prisma.histori_pelanggaranWhereInput = {
      ...(Object.keys(dateFilter).length > 0 && {
        waktu_pelanggaran: dateFilter,
      }),
      OR: [
        {
          jenis_pelanggaran: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          id_raspberrypi: isNaN(Number(query)) ? undefined : Number(query),
        },
        {
          raspberrypi: {
            pengemudi: {
              nama: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    };

    const total = await prisma.histori_pelanggaran.count({ where: whereCond });
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const currentPage = Math.min(page, totalPages);

    const pelanggaran = await prisma.histori_pelanggaran.findMany({
      where: whereCond,
      skip: (currentPage - 1) * limit,
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
        totalPelanggaran: total,
      },
    });
  } catch (error) {
    console.error("Error fetching pelanggaran:", error);
    return NextResponse.json({ error: "Gagal mengambil data pelanggaran" }, { status: 500 });
  }
}

// 📤 POST: Tambah pelanggaran (dengan API Key)
export async function POST(req: Request) {
  try {
    const apiKeyHeader = req.headers.get("X-API-KEY");

    if (!apiKeyHeader || apiKeyHeader !== API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parsed = pelanggaranSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { waktu_pelanggaran, jenis_pelanggaran, id_raspberrypi, image } = parsed.data;

    let nama_pengemudi: string | null = null;
    let plat_bus: string | null = null;
    let merek_bus: string | null = null;

    if (id_raspberrypi) {
      const rp = await prisma.raspberrypi.findUnique({
        where: { id: id_raspberrypi },
        include: { pengemudi: true, Bus: true },
      });

      if (!rp) {
        return NextResponse.json({ error: "RaspberryPi tidak ditemukan" }, { status: 404 });
      }

      nama_pengemudi = rp.pengemudi?.nama ?? null;
      plat_bus = rp.Bus?.plat_bus ?? null;
      merek_bus = rp.Bus?.merek ?? null;
    }

    const newPelanggaran = await prisma.histori_pelanggaran.create({
      data: {
        waktu_pelanggaran: new Date(waktu_pelanggaran),
        jenis_pelanggaran,
        id_raspberrypi: id_raspberrypi ?? null,
        image: image ?? null,
        nama_pengemudi,
        plat_bus,
        merek_bus,
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
