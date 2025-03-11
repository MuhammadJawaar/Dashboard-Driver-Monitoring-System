import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;    
    const totalPelanggaran = await prisma.histori_pelanggaran.count();
    
    return NextResponse.json({ totalPelanggaran });
  } catch (error) {
    console.error("Error counting pelanggaran:", error);
    return NextResponse.json(
      { error: "Gagal menghitung data pelanggaran" },
      { status: 500 }
    );
  }
}
