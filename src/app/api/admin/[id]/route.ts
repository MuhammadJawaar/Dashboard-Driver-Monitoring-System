import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../auth"
import { z } from "zod";

const prisma = new PrismaClient();

// Validasi schema untuk update admin
const updateAdminSchema = z.object({
  nama: z.string().min(2, "Nama harus minimal 2 karakter").optional(),
  email: z.string().email("Email tidak valid").optional(),
  nomor_telepon: z.string().min(10, "Nomor telepon harus minimal 10 karakter").optional(),
  password: z.string().min(6, "Password harus minimal 6 karakter").optional(),
});

// **GET Admin BY ID**
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json({ error: "Gagal mengambil data admin" }, { status: 500 });
  }
}

// **UPDATE Admin BY ID**
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Validasi input
    const parsedData = updateAdminSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    // Update data di database
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: parsedData.data,
    });

    return NextResponse.json(updatedAdmin);
  } catch (error: any) {
    console.error("Error updating admin:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

// **DELETE Admin BY ID**
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  

  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (session.user.id === id) {
      return NextResponse.json({ error: "Anda tidak dapat menghapus akun sendiri" }, { status: 400 });
    }
    
    // Cek jumlah admin yang ada
    const totalAdmin = await prisma.admin.count();

    if (totalAdmin <= 1) {
      return NextResponse.json({ error: "Tidak dapat menghapus admin terakhir" }, { status: 400 });
    }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Admin berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting admin:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

