import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;

export async function GET(req: Request) {
  const token = await getToken({ req, secret });
  console.log("JSON Web Token:", token);
  return NextResponse.json(token);
}