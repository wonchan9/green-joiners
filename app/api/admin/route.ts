import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/admin → 로그인
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const rows = await sql`
    SELECT * FROM admin_users WHERE username = ${username} AND password = ${password}
  `;
  if (rows.length === 0) return NextResponse.json({ error: "인증 실패" }, { status: 401 });

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
