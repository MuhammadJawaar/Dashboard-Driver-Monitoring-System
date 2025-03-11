import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureAuth } from "@/lib/authApi";
const prisma = new PrismaClient();

// Validasi schema untuk update pengemudi
const pengemudiUpdateSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").optional(),
  alamat: z.string().min(5, "Alamat minimal 5 karakter").optional(),
  nomor_telepon: z.string().min(10, "Nomor telepon minimal 10 digit").optional(),
  tanggal_lahir: z.string().refine(
    (date) => !isNaN(Date.parse(date)), 
    { message: "Format tanggal lahir tidak valid" }
  ).optional(),
});

// **GET PENGEMUDI BY ID**
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;    
    const id = req.url.split("/").pop(); // Ambil ID dari URL

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const pengemudi = await prisma.pengemudi.findUnique({ where: { id } });

    if (!pengemudi) {
      return NextResponse.json({ error: "Pengemudi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(pengemudi);
  } catch (error) {
    console.error("Error fetching pengemudi:", error);
    return NextResponse.json({ error: "Gagal mengambil data pengemudi" }, { status: 500 });
  }
}

// **UPDATE PENGEMUDI BY ID**
export async function PUT(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;    
    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Body request tidak boleh kosong" }, { status: 400 });
    }

    const parsedData = pengemudiUpdateSchema.safeParse(body);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.errors.map(err => ({
        field: err.path.join("."),
        message: err.message
      }));
      return NextResponse.json({ errors: errorMessages }, { status: 400 });
    }

    const updatedPengemudi = await prisma.pengemudi.update({
      where: { id },
      data: parsedData.data,
    });

    return NextResponse.json(updatedPengemudi);
  } catch (error: any) {
    console.error("Error updating pengemudi:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengemudi" }, { status: 500 });
  }
}

// **DELETE PENGEMUDI BY ID**
export async function DELETE(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;    
    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const deletedPengemudi = await prisma.pengemudi.delete({ where: { id } });

    return NextResponse.json({ message: "Pengemudi berhasil dihapus", deletedPengemudi });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Pengemudi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Gagal menghapus pengemudi" }, { status: 500 });
  }
}
