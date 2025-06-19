import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Pengemudi } from "@/types/pengemudi";
import { ensureAuth } from "@/lib/authApi";

// -----------------------------------------------------------------------------
// Singleton Prisma instance (avoid hot‑reload leaks)
// -----------------------------------------------------------------------------
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// -----------------------------------------------------------------------------
// Validation schema
// -----------------------------------------------------------------------------
const pengemudiSchema = z.object({
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  alamat: z.string().min(5, "Alamat harus minimal 5 karakter"),
  nomor_telepon: z.string().min(10, "Nomor telepon harus minimal 10 karakter"),
  tanggal_lahir: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal lahir tidak valid",
    }),
});

// -----------------------------------------------------------------------------
// GET /api/pengemudi  (list with search + pagination, hide soft‑deleted)
// -----------------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: "Page dan limit harus bernilai positif" }, { status: 400 });
    }

    const whereCond = {
      deletedAt: null,
      OR: [
        { nama: { contains: query, mode: "insensitive" as const } },
        { alamat: { contains: query, mode: "insensitive" as const } },
        { nomor_telepon: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const totalPengemudi = await prisma.pengemudi.count({ where: whereCond });
    const totalPages = Math.max(Math.ceil(totalPengemudi / limit), 1);
    const currentPage = Math.min(page, totalPages);

    const pengemudi: Pengemudi[] = await prisma.pengemudi.findMany({
      where: whereCond,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      pengemudi,
      pagination: {
        page: currentPage,
        limit,
        totalPages,
        totalPengemudi,
      },
    });
  } catch (error) {
    console.error("Error fetching pengemudi:", error);
    return NextResponse.json({ error: "Gagal mengambil data pengemudi" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// POST /api/pengemudi (create new driver)
// -----------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Body request tidak boleh kosong" }, { status: 400 });
    }

    const parsed = pengemudiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const { nama, alamat, nomor_telepon, tanggal_lahir } = parsed.data;

    // Duplicate phone check among active drivers
    const dup = await prisma.pengemudi.findFirst({
      where: { nomor_telepon, deletedAt: null },
      select: { id: true },
    });
    if (dup) {
      return NextResponse.json({ error: "Nomor telepon sudah terdaftar" }, { status: 400 });
    }

    const newDriver: Pengemudi = await prisma.pengemudi.create({
      data: {
        id: randomUUID(),
        nama,
        alamat,
        nomor_telepon,
        tanggal_lahir: new Date(tanggal_lahir),
      },
    });

    return NextResponse.json(newDriver, { status: 201 });
  } catch (error: any) {
    console.error("Error creating pengemudi:", error);

    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Nomor telepon sudah terdaftar" }, { status: 400 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
