import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";
const prisma = new PrismaClient();

// **COUNT TOTAL RASPBERRY PI**
export async function GET() {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;        
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
