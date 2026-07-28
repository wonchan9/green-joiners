import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// POST /api/admin → 로그인
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const db = getDb();
  const admin = db
    .prepare("SELECT * FROM admin_users WHERE username = ? AND password = ?")
    .get(username, password);
  if (!admin) return NextResponse.json({ error: "인증 실패" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", "1", { path: "/", httpOnly: false });
  return res;
}

// DELETE /api/admin → 로그아웃
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_auth");
  return res;
}
