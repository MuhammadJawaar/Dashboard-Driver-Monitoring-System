import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") || "");

    const targetYear = !isNaN(year) ? year : new Date().getFullYear();
    const startOfYear = new Date(targetYear, 0, 1); // 1 Jan
    const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999); // 31 Dec

    const pelanggaran = await prisma.histori_pelanggaran.findMany({
      where: {
        waktu_pelanggaran: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        waktu_pelanggaran: true,
        jenis_pelanggaran: true,
      },
    });

    const dataPelanggaran = {
      drowsiness: Array(12).fill(0),
      yawn: Array(12).fill(0),
      distraction: Array(12).fill(0),
    };

    pelanggaran.forEach((item) => {
      const bulan = new Date(item.waktu_pelanggaran).getMonth(); // 0-11
      const jenis = item.jenis_pelanggaran.toLowerCase();

      if (jenis === "drowsiness") dataPelanggaran.drowsiness[bulan]++;
      else if (jenis === "yawn") dataPelanggaran.yawn[bulan]++;
      else if (jenis === "distraction") dataPelanggaran.distraction[bulan]++;
    });

    return NextResponse.json(dataPelanggaran);
  } catch (error) {
    console.error("Error fetching yearly violation data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pelanggaran tahunan" },
      { status: 500 }
    );
  }
}
