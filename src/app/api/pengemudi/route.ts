import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Pengemudi } from "@/types/pengemudi"; // Import interface
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient();

// Validasi schema dengan Zod
const pengemudiSchema = z.object({
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  alamat: z.string().min(5, "Alamat harus minimal 5 karakter"),
  nomor_telepon: z.string().min(10, "Nomor telepon harus minimal 10 karakter"), // Fix typo here
  tanggal_lahir: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal lahir tidak valid",
  }),
});

// **GET ALL PENGEMUDI with Search & Pagination**
export async function GET(req: Request) {
  try {
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Page dan limit harus bernilai positif" },
        { status: 400 }
      );
    }

    // Hitung total data
    const totalPengemudi = await prisma.pengemudi.count({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { alamat: { contains: query, mode: "insensitive" } },
          { nomor_telepon: { contains: query, mode: "insensitive" } }, // Fix typo here
        ],
      },
    });

    // Pastikan halaman tidak melebihi total
    const totalPages = Math.max(Math.ceil(totalPengemudi / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    // Ambil data dengan pencarian & pagination
    const pengemudi: Pengemudi[] = await prisma.pengemudi.findMany({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { alamat: { contains: query, mode: "insensitive" } },
          { nomor_telepon: { contains: query, mode: "insensitive" } }, // Fix typo here
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      pengemudi: pengemudi ?? [],
      pagination: {
        page: currentPage,
        limit,
        totalPages,
        totalPengemudi,
      },
    });
  } catch (error) {
    console.error("Error fetching pengemudi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengemudi" },
      { status: 500 }
    );
  }
}

// **CREATE A NEW PENGEMUDI**
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received Body:", body); // Debugging

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Body request tidak boleh kosong" },
        { status: 400 }
      );
    }

    const parsedData = pengemudiSchema.safeParse(body);
    if (!parsedData.success) {
      console.error("Validation Errors:", parsedData.error.format()); // Debugging
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { nama, alamat, nomor_telepon, tanggal_lahir } = parsedData.data;

    console.log("Parsed Data:", parsedData.data); // Debugging

    const newPengemudi: Pengemudi = await prisma.pengemudi.create({
      data: {
        id: randomUUID(),
        nama,
        alamat,
        nomor_telepon,
        tanggal_lahir: new Date(tanggal_lahir),
      },
    });

    return NextResponse.json(newPengemudi, { status: 201 });
  } catch (error: any) {
    console.error("Error creating pengemudi:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nomor telepon sudah terdaftar" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
