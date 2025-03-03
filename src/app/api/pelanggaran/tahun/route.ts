import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // 1 Januari tahun ini

    // Ambil data pelanggaran dalam 12 bulan terakhir
    const pelanggaran = await prisma.histori_pelanggaran.findMany({
      where: {
        waktu_pelanggaran: {
          gte: startOfYear,
        },
      },
      select: {
        waktu_pelanggaran: true,
        jenis_pelanggaran: true,
      },
    });

    // Inisialisasi array kosong untuk tiap kategori
    const dataPelanggaran = {
      drowsiness: Array(12).fill(0),
      yawn: Array(12).fill(0),
      distracted: Array(12).fill(0),
    };

    // Proses data untuk dikelompokkan berdasarkan bulan
    pelanggaran.forEach((item) => {
      const bulan = new Date(item.waktu_pelanggaran).getMonth(); // Ambil bulan (0-11)
      if (item.jenis_pelanggaran.toLowerCase() === "drowsiness") {
        dataPelanggaran.drowsiness[bulan] += 1;
      } else if (item.jenis_pelanggaran.toLowerCase() === "yawn") {
        dataPelanggaran.yawn[bulan] += 1;
      } else if (item.jenis_pelanggaran.toLowerCase() === "distracted") {
        dataPelanggaran.distracted[bulan] += 1;
      }
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
