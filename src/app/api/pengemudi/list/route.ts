import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";

const prisma = new PrismaClient();

/**
 * Simplified endpoint for driver dropdown / autocomplete.
 *
 * Path: /api/pengemudi/list  (adjust folder to `app/api/pengemudi/list/route.ts`)
 *
 * Supported query params:
 *   - query  : optional text to search in `nama` (case‑insensitive)
 *   - limit  : optional max number of records (default 100)
 */
export async function GET(req: Request) {
  try {
    // Optional auth; keep consistent with other secured endpoints
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim();
    const limit = Number(searchParams.get("limit")) || 100;

    if (limit < 1) {
      return NextResponse.json(
        { error: "Parameter limit harus > 0" },
        { status: 400 }
      );
    }

    const drivers = await prisma.pengemudi.findMany({
      where: query
        ? {
            nama: {
              contains: query,
              mode: "insensitive",
            },
          }
        : undefined,
      select: {
        id: true,
        nama: true,
      },
      orderBy: { nama: "asc" },
      take: limit,
    });

    return NextResponse.json(drivers);
  } catch (error) {
    console.error("Error fetching driver list:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar pengemudi" },
      { status: 500 }
    );
  }
}
