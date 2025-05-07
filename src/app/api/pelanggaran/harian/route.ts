import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page dan limit harus bernilai positif" },
        { status: 400 }
      );
    }
    
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    // Ambil semua data tanpa pagination terlebih dahulu
    const pelanggarans = await prisma.histori_pelanggaran.findMany({
      where: {
        waktu_pelanggaran: {
          gte: startDate,
          lt: endDate,
        },
        raspberrypi: {
          pengemudi: {
            nama: {
              contains: query,
              mode: 'insensitive', // Biar case-insensitive
            },
          },
        },
      },
      include: {
        raspberrypi: {
          include: {
            pengemudi: true,
          },
        },
      },
    });

    // Kelompokkan pelanggaran berdasarkan pengemudi
    const grouped = groupPelanggaranByPengemudi(pelanggarans);

    // Hitung total data setelah pengelompokan
    const totalData = grouped.length;

    // Hitung total halaman berdasarkan total data yang sudah dikelompokkan
    const totalPages = Math.ceil(totalData / limit);

    // Hitung skip dan take untuk pagination
    const skip = (page - 1) * limit;
    const paginatedResult = grouped.slice(skip, skip + limit);

    return NextResponse.json({
      data: paginatedResult,
      pagination: {
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Mapping bobot berdasarkan jenis pelanggaran
 */
const weightMapping: Record<string, number> = {
  'drowsiness': 5,
  'yawn': 2,
  'distraction': 0.5
};

/**
 * Mapping kategori berdasarkan total weight
 */
const categoryMapping: { minWeight: number; category: string }[] = [
  { minWeight: 20, category: 'High' },
  { minWeight: 15, category: 'Medium High' },
  { minWeight: 10, category: 'Medium' },
  { minWeight: 5, category: 'Medium Low' },
  { minWeight: 1, category: 'Low' },
];

/**
 * Fungsi mengelompokkan pelanggaran per pengemudi
 */
function groupPelanggaranByPengemudi(pelanggarans: any[]) {
  const grouped: Record<string, {
    pengemudiId: string;
    nama: string | null;
    countByType: Record<string, number>;
    totalWeight: number;
    category: string;
  }> = {};

  for (const pelanggaran of pelanggarans) {
    const pengemudi = pelanggaran.raspberrypi?.pengemudi;
    if (!pengemudi) continue;

    const { id: pengemudiId, nama } = pengemudi;
    const jenis = pelanggaran.jenis_pelanggaran;
    const weight = weightMapping[jenis] ?? 2; // default weight 2 kalau tidak ditemukan

    if (!grouped[pengemudiId]) {
      grouped[pengemudiId] = {
        pengemudiId,
        nama: nama ?? null,
        countByType: {},
        totalWeight: 0,
        category: '',
      };
    }

    grouped[pengemudiId].countByType[jenis] = (grouped[pengemudiId].countByType[jenis] ?? 0) + 1;
    grouped[pengemudiId].totalWeight += weight;
  }

  // Assign kategori berdasarkan totalWeight
  for (const data of Object.values(grouped)) {
    data.category = getCategory(data.totalWeight);
  }

  return Object.values(grouped);
}

/**
 * Fungsi menentukan kategori dari totalWeight
 */
function getCategory(totalWeight: number): string {
  const found = categoryMapping.find(mapping => totalWeight >= mapping.minWeight);
  return found ? found.category : 'Safe';
}
