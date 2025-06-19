import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Admin } from "@/types/admin";
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
// Validation schema for creating admin
// -----------------------------------------------------------------------------
const adminSchema = z.object({
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  nomor_telepon: z.string().min(10, "Nomor telepon harus minimal 10 karakter"),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
});

// Helper: remove password before sending to client
function stripPassword<T extends { password?: string | null }>(obj: T) {
  const { password, ...rest } = obj;
  return rest;
}

// -----------------------------------------------------------------------------
// GET /api/admin  (list with search & pagination, hide soft‑deleted)
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

    // Search condition among active admins only (deletedAt == null)
    const whereCond = {
      deletedAt: null,
      OR: [
        { nama: { contains: query, mode: "insensitive" as const } },
        { email: { contains: query, mode: "insensitive" as const } },
        { nomor_telepon: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const totalAdmins = await prisma.admin.count({ where: whereCond });
    const totalPages = Math.max(Math.ceil(totalAdmins / limit), 1);
    const currentPage = Math.min(page, totalPages);

    const admins: Admin[] = await prisma.admin.findMany({
      where: whereCond,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      admins: admins.map(stripPassword),
      pagination: {
        page: currentPage,
        limit,
        totalPages,
        totalAdmins,
      },
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: "Gagal mengambil data admin" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// POST /api/admin  (create new admin)
// -----------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Body request tidak boleh kosong" }, { status: 400 });
    }

    const parsed = adminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const { nama, email, nomor_telepon, password } = parsed.data;

    // Duplicate check among active admins
    const dup = await prisma.admin.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email }, { nomor_telepon }],
      },
      select: { id: true },
    });
    if (dup) {
      return NextResponse.json({ error: "Email atau nomor telepon sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const bcrypt = await import("bcryptjs");
    const hashedPass = await bcrypt.hash(password, 10);

    const newAdmin: Admin = await prisma.admin.create({
      data: {
        id: randomUUID(),
        nama,
        email,
        nomor_telepon,
        password: hashedPass,
      },
    });

    return NextResponse.json(stripPassword(newAdmin), { status: 201 });
  } catch (error: any) {
    console.error("Error creating admin:", error);

    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Email atau nomor telepon sudah terdaftar" }, { status: 400 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}