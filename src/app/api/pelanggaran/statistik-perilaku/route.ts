import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const granularity = (searchParams.get("granularity") || "monthly").toLowerCase();
    const yearParam = parseInt(searchParams.get("year") || "");
    const monthParam = parseInt(searchParams.get("month") || "");
    const driverId = searchParams.get("driverId");

    const targetYear = !isNaN(yearParam) ? yearParam : new Date().getFullYear();

    if (granularity === "daily" && (isNaN(monthParam) || monthParam < 1 || monthParam > 12)) {
      return NextResponse.json(
        { error: "`month` (1‑12) wajib jika granularity=daily" },
        { status: 400 }
      );
    }

    let startDate: Date, endDate: Date;
    if (granularity === "daily") {
      startDate = new Date(targetYear, monthParam - 1, 1);
      endDate = new Date(targetYear, monthParam, 1);
    } else {
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear + 1, 0, 1);
    }

    const where: any = {
      waktu_pelanggaran: { gte: startDate, lt: endDate },
    };

    if (driverId) {
      where.raspberrypi = { id_pengemudi: driverId };
    }

    const pelanggaran = await prisma.histori_pelanggaran.findMany({
      where,
      select: {
        waktu_pelanggaran: true,
        jenis_pelanggaran: true,
      },
    });

    const CATEGORIES = ["drowsiness", "yawn", "distraction"] as const;
    const counter: Record<(typeof CATEGORIES)[number], number> = {
      drowsiness: 0,
      yawn: 0,
      distraction: 0,
    };

    pelanggaran.forEach(({ jenis_pelanggaran }) => {
      const jenis = jenis_pelanggaran.toLowerCase() as keyof typeof counter;
      if (counter[jenis] !== undefined) {
        counter[jenis]++;
      }
    });

    const result = {
      series: [counter["drowsiness"], counter["yawn"], counter["distraction"]],
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Gagal mengambil statistik perilaku:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data statistik" },
      { status: 500 }
    );
  }
}
