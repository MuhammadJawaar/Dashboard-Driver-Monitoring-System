import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureAuth } from "@/lib/authApi";

// -----------------------------------------------------------------------------
// Use singleton Prisma to avoid multiple instances in dev hot‑reload
// -----------------------------------------------------------------------------
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// -----------------------------------------------------------------------------
// Validation schema for updating Bus
// -----------------------------------------------------------------------------
const busUpdateSchema = z
  .object({
    plat_bus: z.string().min(3, "Plat bus minimal 3 karakter").optional(),
    merek: z.string().min(2, "Merek minimal 2 karakter").optional(),
    kapasitas: z.number().int().min(1, "Kapasitas harus lebih dari 0").optional(),
    tahun_pembuatan: z
      .number()
      .int()
      .min(1900, "Tahun pembuatan tidak valid")
      .max(new Date().getFullYear(), "Tahun pembuatan tidak boleh lebih dari tahun sekarang")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Payload kosong",
  });

// Helper: parse id dari url
function extractId(url: string) {
  return url.split("/").pop();
}

// -----------------------------------------------------------------------------
// GET /api/bus/[id]
// -----------------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const bus = await prisma.bus.findUnique({
      where: { id, deletedAt: null },
    });

    if (!bus) {
      return NextResponse.json({ error: "Bus tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(bus);
  } catch (error) {
    console.error("Error fetching bus:", error);
    return NextResponse.json({ error: "Gagal mengambil data bus" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// PUT /api/bus/[id]
// -----------------------------------------------------------------------------
export async function PUT(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();

    const parsed = busUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return NextResponse.json({ errors: errorMessages }, { status: 400 });
    }

    // Cek plat_bus duplikat bila diupdate
    if (parsed.data.plat_bus) {
      const exist = await prisma.bus.findFirst({
        where: {
          plat_bus: parsed.data.plat_bus,
          id: { not: id },
          deletedAt: null,
        },
        select: { id: true },
      });
      if (exist) {
        return NextResponse.json({ error: "Plat bus sudah terdaftar" }, { status: 400 });
      }
    }

    const updatedBus = await prisma.bus.update({
      where: { id, deletedAt: null },
      data: parsed.data,
    });

    return NextResponse.json(updatedBus);
  } catch (error: any) {
    console.error("Error updating bus:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Bus tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal memperbarui bus" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// DELETE (soft) /api/bus/[id]
// -----------------------------------------------------------------------------
export async function DELETE(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Soft delete bus and detach it from raspberrypi in a transaction
    await prisma.$transaction([
      prisma.bus.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      }),
      prisma.raspberrypi.updateMany({
        where: { id_bus: id },
        data: { id_bus: null },
      }),
    ]);

    return NextResponse.json({ message: "Bus berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting bus:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Bus tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Gagal menghapus bus" }, { status: 500 });
  }
}
