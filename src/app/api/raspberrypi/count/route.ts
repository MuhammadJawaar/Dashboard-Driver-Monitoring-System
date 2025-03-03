import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// **COUNT TOTAL RASPBERRY PI**
export async function GET() {
  try {
    const totalRaspberryPi = await prisma.raspberrypi.count();
    return NextResponse.json({ totalRaspberryPi });
  } catch (error) {
    console.error("Error counting Raspberry Pi:", error);
    return NextResponse.json(
      { error: "Gagal menghitung jumlah Raspberry Pi" },
      { status: 500 }
    );
  }
}
