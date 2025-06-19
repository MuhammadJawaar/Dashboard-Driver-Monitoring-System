import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureAuth } from "@/lib/authApi";

// -----------------------------------------------------------------------------
// Singleton Prisma instance (avoids hot‑reload connection leak)
// -----------------------------------------------------------------------------
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// -----------------------------------------------------------------------------
// Validation schema for updating driver
// -----------------------------------------------------------------------------
const pengemudiUpdateSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter").optional(),
    alamat: z.string().min(5, "Alamat minimal 5 karakter").optional(),
    nomor_telepon: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .optional(),
    tanggal_lahir: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Format tanggal lahir tidak valid",
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Payload kosong",
  });

// Helper: extract id from URL
const extractId = (url: string) => url.split("/").pop();

// -----------------------------------------------------------------------------
// GET /api/pengemudi/[id]
// -----------------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const pengemudi = await prisma.pengemudi.findUnique({
      where: { id, deletedAt: null },
    });

    if (!pengemudi) {
      return NextResponse.json({ error: "Pengemudi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(pengemudi);
  } catch (error) {
    console.error("Error fetching pengemudi:", error);
    return NextResponse.json({ error: "Gagal mengambil data pengemudi" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// PUT /api/pengemudi/[id]
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
    const parsed = pengemudiUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return NextResponse.json({ errors: errorMessages }, { status: 400 });
    }

    // Duplicate phone check
    if (parsed.data.nomor_telepon) {
      const exists = await prisma.pengemudi.findFirst({
        where: {
          nomor_telepon: parsed.data.nomor_telepon,
          id: { not: id },
          deletedAt: null,
        },
        select: { id: true },
      });
      if (exists) {
        return NextResponse.json({ error: "Nomor telepon sudah terdaftar" }, { status: 400 });
      }
    }

    const updateData = {
      ...parsed.data,
      ...(parsed.data.tanggal_lahir && {
        tanggal_lahir: new Date(parsed.data.tanggal_lahir),
      }),
    };

    const updatedPengemudi = await prisma.pengemudi.update({
      where: { id, deletedAt: null },
      data: updateData,
    });

    return NextResponse.json(updatedPengemudi);
  } catch (error: any) {
    console.error("Error updating pengemudi:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Pengemudi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal memperbarui pengemudi" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// DELETE (soft) /api/pengemudi/[id]
// -----------------------------------------------------------------------------
export async function DELETE(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Soft delete driver & detach from raspberrypi in transaction
    await prisma.$transaction([
      prisma.pengemudi.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      }),
      prisma.raspberrypi.updateMany({
        where: { id_pengemudi: id },
        data: { id_pengemudi: null },
      }),
    ]);

    return NextResponse.json({ message: "Pengemudi berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting pengemudi:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Pengemudi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Gagal menghapus pengemudi" }, { status: 500 });
  }
}
