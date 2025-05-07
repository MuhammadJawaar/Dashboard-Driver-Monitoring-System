import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "@/lib/authApi";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    // Daftar kategori pelanggaran yang harus selalu ada
    const defaultCategories = ["drowsiness", "yawn", "distraction"];

    // Ambil parameter tahun dan bulan dari query string
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get("tahun") || "", 10); // tahun yang dipilih
    const month = parseInt(url.searchParams.get("bulan") || "", 10); // bulan yang dipilih

    // Filter data berdasarkan tahun dan bulan jika tersedia
    let whereCondition = {};

    if (year && month) {
      // Jika tahun dan bulan ada, filter berdasarkan bulan tertentu
      whereCondition = {
        createdAt: {
          gte: new Date(year, month - 1, 1), // Mulai dari bulan yang dipilih
          lt: new Date(year, month, 1), // Sebelum bulan berikutnya
        },
      };
    } else if (year) {
      // Jika hanya tahun yang ada, filter seluruh tahun
      whereCondition = {
        createdAt: {
          gte: new Date(year, 0, 1), // Mulai dari Januari
          lt: new Date(year + 1, 0, 1), // Sebelum tahun berikutnya (Desember)
        },
      };
    }

    // Ambil total pelanggaran per kategori sesuai dengan filter yang ada
    const data = await prisma.histori_pelanggaran.groupBy({
      by: ["jenis_pelanggaran"],
      where: whereCondition,
      _count: {
        jenis_pelanggaran: true,
      },
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
