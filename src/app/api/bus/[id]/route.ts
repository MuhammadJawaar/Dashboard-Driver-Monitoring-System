import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureAuth } from "@/lib/authApi";

const prisma = new PrismaClient();

// Validasi schema untuk update
const busUpdateSchema = z.object({
  plat_bus: z.string().min(3, "Plat bus minimal 3 karakter").optional(),
  merek: z.string().min(2, "Merek minimal 2 karakter").optional(),
  kapasitas: z.number().min(1, "Kapasitas harus lebih dari 0").optional(),
  tahun_pembuatan: z
    .number()
    .min(1900, "Tahun pembuatan tidak valid")
    .max(new Date().getFullYear(), "Tahun pembuatan tidak boleh lebih dari tahun sekarang")
    .optional(),
});

// **GET BUS BY ID**
export async function GET(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = req.url.split("/").pop(); // Ambil ID dari URL

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const bus = await prisma.bus.findUnique({ where: { id } });

    if (!bus) {
      return NextResponse.json({ error: "Bus tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(bus);
  } catch (error) {
    console.error("Error fetching bus:", error);
    return NextResponse.json({ error: "Gagal mengambil data bus" }, { status: 500 });
  }
}

// **UPDATE BUS BY ID**
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

    const parsedData = busUpdateSchema.safeParse(body);
    if (!parsedData.success) {
      const errorMessages = parsedData.error.errors.map(err => ({
        field: err.path.join("."),
        message: err.message
      }));
      return NextResponse.json({ errors: errorMessages }, { status: 400 });
    }

    const updatedBus = await prisma.bus.update({
      where: { id },
      data: parsedData.data,
    });

    return NextResponse.json(updatedBus);
  } catch (error: any) {
    console.error("Error updating bus:", error);

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Plat bus sudah terdaftar" }, { status: 400 });
    }

    return NextResponse.json({ error: "Gagal memperbarui bus" }, { status: 500 });
  }
}

// **DELETE BUS BY ID**
export async function DELETE(req: Request) {
  try {
    const session = await ensureAuth();
    if (session instanceof NextResponse) return session;

    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const deletedBus = await prisma.bus.delete({ where: { id } });

    return NextResponse.json({ message: "Bus berhasil dihapus", deletedBus });
  } catch (error: any) {
    

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Bus tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ error: "Gagal menghapus bus" }, { status: 500 });
  }
}
