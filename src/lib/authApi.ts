import { auth } from "../../auth";
import { NextResponse } from "next/server";

export async function ensureAuth() {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
