import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;    
    // Daftar kategori pelanggaran yang harus selalu ada

    const defaultCategories = ["drowsiness", "yawn", "distraction"];

    // Ambil total pelanggaran per kategori tanpa batasan tahun
    const data = await prisma.histori_pelanggaran.groupBy({
      by: ["jenis_pelanggaran"],
      _count: { jenis_pelanggaran: true },
    });

    // Buat map dari hasil query
    const dataMap = new Map(
      data.map((item) => [item.jenis_pelanggaran, item._count.jenis_pelanggaran])
    );

    // Pastikan semua kategori memiliki nilai, default 0 jika tidak ada di database
    const labels = defaultCategories;
    const series = labels.map((category) => dataMap.get(category) || 0);

    return NextResponse.json({ labels, series });
  } catch (error) {
    console.error("Error fetching statistik:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data statistik" },
      { status: 500 }
    );
  }
}
