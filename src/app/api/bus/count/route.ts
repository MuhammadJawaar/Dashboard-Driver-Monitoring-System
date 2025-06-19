import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";

const prisma = new PrismaClient();

// **GET TOTAL BUS COUNT (only non-deleted buses)**
export async function GET() {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const totalBuses = await prisma.bus.count({
      where: {
        deletedAt: null, // ✅ hanya hitung yang belum dihapus
      },
    });

    return NextResponse.json({ totalBuses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total bus count:", error);
    return NextResponse.json(
      { error: "Gagal menghitung jumlah bus" },
      { status: 500 }
    );
  }
}
