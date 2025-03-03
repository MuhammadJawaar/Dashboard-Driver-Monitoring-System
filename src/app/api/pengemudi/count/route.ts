import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// **GET TOTAL COUNT OF PENGEMUDI**
export async function GET() {
  try {
    const totalPengemudi = await prisma.pengemudi.count();
    return NextResponse.json({ totalPengemudi });
  } catch (error) {
    console.error("Error fetching total pengemudi count:", error);
    return NextResponse.json(
      { error: "Gagal mengambil jumlah total pengemudi" },
      { status: 500 }
    );
  }
}
