import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET SUPERVISORS (All or by Email)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const supervisor = await prisma.supervisor.findFirst({
        where: { email },
      });

      if (!supervisor) {
        return NextResponse.json({ error: "Supervisor not found" }, { status: 404 });
      }

      return NextResponse.json(supervisor);
    }

    const supervisors = await prisma.supervisor.findMany();
    return NextResponse.json(supervisors);
  } catch (error) {
    console.error("Error fetching supervisor:", error);
    return NextResponse.json({ error: "Failed to fetch supervisor" }, { status: 500 });
  }
}
