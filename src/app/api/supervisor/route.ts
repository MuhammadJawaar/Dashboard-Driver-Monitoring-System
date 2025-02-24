import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Supervisor } from "@/types/supervisor";

const prisma = new PrismaClient();

// Validasi schema dengan Zod
const supervisorSchema = z.object({
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  nomor_telepon: z.string().min(10, "Nomor telepon harus minimal 10 karakter"),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
});

// **GET ALL SUPERVISORS with Search & Pagination**
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

    const totalSupervisors = await prisma.supervisor.count({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { nomor_telepon: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    const totalPages = Math.max(Math.ceil(totalSupervisors / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const supervisors: Supervisor[] = await prisma.supervisor.findMany({
      where: {
        OR: [
          { nama: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { nomor_telepon: { contains: query, mode: "insensitive" } },
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      supervisors: supervisors ?? [],
      pagination: {
        page: currentPage,
        limit,
        totalPages,
        totalSupervisors,
      },
    });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data supervisor" },
      { status: 500 }
    );
  }
}

// **CREATE A NEW SUPERVISOR**
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received Body:", body);

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Body request tidak boleh kosong" },
        { status: 400 }
      );
    }

    const parsedData = supervisorSchema.safeParse(body);
    if (!parsedData.success) {
      console.error("Validation Errors:", parsedData.error.format());
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { nama, email, nomor_telepon, password } = parsedData.data;

    console.log("Parsed Data:", parsedData.data);

    const newSupervisor: Supervisor = await prisma.supervisor.create({
      data: {
        id: randomUUID(),
        nama,
        email,
        nomor_telepon,
        password,
      },
    });

    return NextResponse.json(newSupervisor, { status: 201 });
  } catch (error: any) {
    console.error("Error creating supervisor:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email atau nomor telepon sudah terdaftar" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
