import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";
import { z } from "zod";

/**
 * Use a single Prisma instance in dev to avoid hot‑reload problems
 */
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ────────────────────────────────────────────────────────────────────────────────
// Zod schema untuk mem‑validasi update payload
// ────────────────────────────────────────────────────────────────────────────────
const updateAdminSchema = z
  .object({
    nama: z.string().min(2, "Nama harus minimal 2 karakter").optional(),
    email: z.string().email("Email tidak valid").optional(),
    nomor_telepon: z
      .string()
      .min(10, "Nomor telepon harus minimal 10 karakter")
      .optional(),
    password: z.string().min(6, "Password harus minimal 6 karakter").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Payload kosong",
  });

// Helper: hapus field password sebelum dikirim ke client
function stripPassword<T extends { password?: string | null }>(obj: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = obj;
  return rest;
}

// Helper: parse id dari url
function extractId(url: string) {
  return url.split("/").pop();
}

// ────────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/[id]
// ────────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);

    const admin = await prisma.admin.findUnique({
      where: { id, deletedAt: null },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(stripPassword(admin));
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data admin" },
      { status: 500 },
    );
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// PUT /api/admin/[id]
// ────────────────────────────────────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);
    const body = await req.json();

    // Validasi input
    const parsed = updateAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    // Cegah perubahan email ke alamat yang sudah terpakai
    if (parsed.data.email) {
      const emailExist = await prisma.admin.findFirst({
        where: { email: parsed.data.email, id: { not: id }, deletedAt: null },
        select: { id: true },
      });
      if (emailExist) {
        return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
      }
    }

    // Hash password bila ada perubahan password
    let dataToUpdate = { ...parsed.data } as typeof parsed.data;
    if (dataToUpdate.password) {
      const bcrypt = await import("bcryptjs");
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(stripPassword(updatedAdmin));
  } catch (error: any) {
    console.error("Error updating admin:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// DELETE (soft) /api/admin/[id]
// ────────────────────────────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = extractId(req.url);

    // Cegah menghapus diri sendiri
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun sendiri" },
        { status: 400 },
      );
    }

    // Hitung admin aktif (deletedAt == null)
    const activeAdminCount = await prisma.admin.count({ where: { deletedAt: null } });
    if (activeAdminCount <= 1) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus admin terakhir" },
        { status: 400 },
      );
    }

    // Soft delete → set deletedAt
    const deleted = await prisma.admin.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    if (!deleted) {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting admin:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
