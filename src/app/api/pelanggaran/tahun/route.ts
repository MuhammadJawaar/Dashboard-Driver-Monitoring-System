import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // const session = await ensureAuth();
    // if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);

    // --- parameter -------------------------------------------------------
    const granularity = (searchParams.get("granularity") || "monthly").toLowerCase(); // daily | monthly
    const yearParam   = parseInt(searchParams.get("year") || "");
    const monthParam  = parseInt(searchParams.get("month") || "");   // 1‑12
    const driverId    = searchParams.get("driverId");                // opsional
    // --------------------------------------------------------------------

    const targetYear  = !isNaN(yearParam) ? yearParam : new Date().getFullYear();

    // validasi dasar
    if (granularity === "daily" && (isNaN(monthParam) || monthParam < 1 || monthParam > 12)) {
      return NextResponse.json(
        { error: "`month` (1‑12) wajib jika granularity=daily" },
        { status: 400 }
      );
    }

    // hitung rentang tanggal
    let startDate: Date, endDate: Date;
    if (granularity === "daily") {
      startDate = new Date(targetYear, monthParam - 1, 1);
      endDate   = new Date(targetYear, monthParam, 1);
    } else {
      startDate = new Date(targetYear, 0, 1);
      endDate   = new Date(targetYear + 1, 0, 1);
    }

    // where‑clause utama
    const where: any = {
      waktu_pelanggaran: { gte: startDate, lt: endDate },
    };

    // filter driver → via relasi raspberrypi.id_pengemudi
    if (driverId) {
      where.raspberrypi = { id_pengemudi: driverId };
    }

    // tarik hanya kolom yang diperlukan
    const pelanggaran = await prisma.histori_pelanggaran.findMany({
      where,
      select: {
        waktu_pelanggaran: true,
        jenis_pelanggaran: true,
      },
    });

    // inisialisasi hasil
    const CATEGORIES = ["drowsiness", "yawn", "distraction"] as const;
    const result: Record<(typeof CATEGORIES)[number], number[]> = {} as any;

    if (granularity === "daily") {
      const daysInMonth = new Date(targetYear, monthParam, 0).getDate();
      CATEGORIES.forEach((c) => (result[c] = Array(daysInMonth).fill(0)));

      pelanggaran.forEach(({ waktu_pelanggaran, jenis_pelanggaran }) => {
        const dayIdx = new Date(waktu_pelanggaran).getDate() - 1;
        const cat    = jenis_pelanggaran.toLowerCase() as keyof typeof result;
        if (result[cat]) result[cat][dayIdx]++;
      });
    } else {
      CATEGORIES.forEach((c) => (result[c] = Array(12).fill(0)));

      pelanggaran.forEach(({ waktu_pelanggaran, jenis_pelanggaran }) => {
        const monthIdx = new Date(waktu_pelanggaran).getMonth();
        const cat      = jenis_pelanggaran.toLowerCase() as keyof typeof result;
        if (result[cat]) result[cat][monthIdx]++;
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil data statistik" },
      { status: 500 }
    );
  }
}
