import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureAuth } from "@/lib/authApi";

// -----------------------------------------------------------------------------
// Singleton Prisma instance (prevent hot‑reload leaks)
// -----------------------------------------------------------------------------
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// -----------------------------------------------------------------------------
// Validation schema for update
// -----------------------------------------------------------------------------
const raspberryPiSchema = z.object({
  id_pengemudi: z.string().uuid().nullable().optional(),
  id_bus: z.string().uuid().nullable().optional(),
});

// Helper: extract numeric id
const extractIntId = (url: string) => Number(url.split("/").pop());

// -----------------------------------------------------------------------------
// GET /api/raspberrypi/[id]
// -----------------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractIntId(req.url);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    const raspberryPi = await prisma.raspberrypi.findUnique({
      where: { id, deletedAt: null },
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
    console.error("Error fetching raspberrypi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// PUT /api/raspberrypi/[id]
// -----------------------------------------------------------------------------
export async function PUT(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractIntId(req.url);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = raspberryPiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const { id_pengemudi, id_bus } = parsed.data;

    // Optional: validate referenced entities exist (and active)
    if (id_pengemudi) {
      const driverExist = await prisma.pengemudi.findFirst({
        where: { id: id_pengemudi, deletedAt: null },
        select: { id: true },
      });
      if (!driverExist) {
        return NextResponse.json({ error: "Pengemudi tidak ditemukan" }, { status: 404 });
      }
    }
    if (id_bus) {
      const busExist = await prisma.bus.findFirst({
        where: { id: id_bus, deletedAt: null },
        select: { id: true },
      });
      if (!busExist) {
        return NextResponse.json({ error: "Bus tidak ditemukan" }, { status: 404 });
      }
    }

    const updated = await prisma.raspberrypi.update({
      where: { id, deletedAt: null },
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

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating raspberrypi:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "RaspberryPi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// DELETE (soft) /api/raspberrypi/[id]
// -----------------------------------------------------------------------------
export async function DELETE(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractIntId(req.url);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    // Soft delete + detach hist
    await prisma.$transaction([
      prisma.raspberrypi.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "RaspberryPi berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting raspberrypi:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "RaspberryPi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
