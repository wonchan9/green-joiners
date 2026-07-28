import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/session";

// GET /api/auth?member_key=xxx → 쿠키 세팅
export async function GET(req: NextRequest) {
  const memberKey = req.nextUrl.searchParams.get("member_key");
  if (!memberKey) {
    return NextResponse.json({ error: "member_key 없음" }, { status: 400 });
  }
  const user = getOrCreateUser(memberKey);
  const res = NextResponse.json({ ok: true, user });
  res.cookies.set("member_key", memberKey, { path: "/", httpOnly: false });
  return res;
}

// DELETE /api/auth → 로그아웃
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("member_key");
  return res;
}
