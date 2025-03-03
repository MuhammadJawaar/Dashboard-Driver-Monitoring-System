import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// **GET TOTAL BUS COUNT**
export async function GET() {
  try {
    const totalBuses = await prisma.bus.count();

    return NextResponse.json({ totalBuses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total bus count:", error);
    return NextResponse.json(
      { error: "Gagal menghitung jumlah bus" },
      { status: 500 }
    );
  }
}
