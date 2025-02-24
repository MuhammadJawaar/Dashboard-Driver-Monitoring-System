import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validasi schema untuk update supervisor
const updateSupervisorSchema = z.object({
  nama: z.string().min(2, "Nama harus minimal 2 karakter").optional(),
  email: z.string().email("Email tidak valid").optional(),
  nomor_telepon: z.string().min(10, "Nomor telepon harus minimal 10 karakter").optional(),
  password: z.string().min(6, "Password harus minimal 6 karakter").optional(),
});

// **GET SUPERVISOR BY ID**
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const supervisor = await prisma.supervisor.findUnique({
      where: { id },
    });

    if (!supervisor) {
      return NextResponse.json({ error: "Supervisor tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(supervisor);
  } catch (error) {
    console.error("Error fetching supervisor:", error);
    return NextResponse.json({ error: "Gagal mengambil data supervisor" }, { status: 500 });
  }
}

// **UPDATE SUPERVISOR BY ID**
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Validasi input
    const parsedData = updateSupervisorSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    // Update data di database
    const updatedSupervisor = await prisma.supervisor.update({
      where: { id },
      data: parsedData.data,
    });

    return NextResponse.json(updatedSupervisor);
  } catch (error: any) {
    console.error("Error updating supervisor:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Supervisor tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// **DELETE SUPERVISOR BY ID**
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.supervisor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Supervisor berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting supervisor:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Supervisor tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
