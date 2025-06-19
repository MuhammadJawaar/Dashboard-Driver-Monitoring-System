import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureAuth } from "@/lib/authApi";

// -----------------------------------------------------------------------------
// Singleton Prisma instance (avoid hot‑reload leaks in dev)
// -----------------------------------------------------------------------------
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// -----------------------------------------------------------------------------
// Validation schema
// -----------------------------------------------------------------------------
const raspberryPiSchema = z.object({
  id_pengemudi: z.string().uuid().nullable().optional(),
  id_bus: z.string().uuid().nullable().optional(),
});

// Helper: build where clause for search
const buildSearchWhere = (query: string) => ({
  deletedAt: null,
  OR: [
    {
      pengemudi: {
        nama: { contains: query, mode: "insensitive" as const },
        deletedAt: null,
      },
    },
    {
      Bus: {
        plat_bus: { contains: query, mode: "insensitive" as const },
        deletedAt: null,
      },
    },
    {
      Bus: {
        merek: { contains: query, mode: "insensitive" as const },
        deletedAt: null,
      },
    },
    { id: !isNaN(Number(query)) ? Number(query) : undefined },
  ],
});

// -----------------------------------------------------------------------------
// GET /api/raspberrypi  (list with search & pagination)
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

    const whereCond = buildSearchWhere(query);

    const total = await prisma.raspberrypi.count({ where: whereCond });
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const currentPage = Math.min(page, totalPages);

    const raspberryPi = await prisma.raspberrypi.findMany({
      where: whereCond,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        pengemudi: { select: { nama: true } },
        Bus: { select: { merek: true, plat_bus: true } },
      },
    });

    return NextResponse.json({
      raspberryPi,
      pagination: { page: currentPage, limit, totalPages, totalRaspberryPi: total },
    });
  } catch (error) {
    console.error("Error fetching raspberrypi list:", error);
    return NextResponse.json({ error: "Gagal mengambil data RaspberryPi" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// POST /api/raspberrypi  (create new)
// -----------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Body request tidak boleh kosong" }, { status: 400 });
    }

    const parsed = raspberryPiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const { id_pengemudi, id_bus } = parsed.data;

    // Validate referenced entities (if provided)
    if (id_pengemudi) {
      const driverExists = await prisma.pengemudi.findFirst({
        where: { id: id_pengemudi, deletedAt: null },
        select: { id: true },
      });
      if (!driverExists) {
        return NextResponse.json({ error: "Pengemudi tidak ditemukan" }, { status: 404 });
      }
    }

    if (id_bus) {
      const busExists = await prisma.bus.findFirst({
        where: { id: id_bus, deletedAt: null },
        select: { id: true },
      });
      if (!busExists) {
        return NextResponse.json({ error: "Bus tidak ditemukan" }, { status: 404 });
      }
    }

    const newPi = await prisma.raspberrypi.create({
      data: {
        id_pengemudi: id_pengemudi ?? null,
        id_bus: id_bus ?? null,
      },
      include: {
        pengemudi: { select: { nama: true } },
        Bus: { select: { merek: true, plat_bus: true } },
      },
    });

    return NextResponse.json(newPi, { status: 201 });
  } catch (error) {
    console.error("Error creating raspberrypi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
