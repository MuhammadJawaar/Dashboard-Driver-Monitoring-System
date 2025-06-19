import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";
const prisma = new PrismaClient();

// **GET TOTAL COUNT OF PENGEMUDI**
export async function GET() {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const totalPengemudi = await prisma.pengemudi.count(
      {
      where: {
        deletedAt: null, // ✅ hanya hitung yang belum dihapus
      },
    }
    );
    return NextResponse.json({ totalPengemudi });
  } catch (error) {
    console.error("Error fetching total pengemudi count:", error);
    return NextResponse.json(
      { error: "Gagal mengambil jumlah total pengemudi" },
      { status: 500 }
    );
  }
}
