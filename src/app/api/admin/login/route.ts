import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET Admins (All or by Email, exclude soft-deleted)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const admin = await prisma.admin.findFirst({
        where: {
          email,
          deletedAt: null, // ✅ hanya ambil admin yang belum dihapus
        },
      });

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
      }

      return NextResponse.json(admin);
    }

    const admins = await prisma.admin.findMany({
      where: {
        deletedAt: null, // ✅ hanya ambil admin yang belum dihapus
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json({ error: "Failed to fetch admin" }, { status: 500 });
  }
}
