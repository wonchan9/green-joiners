import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/session";

// POST /api/auth → 로그인 (멤버십 번호 + 이름)
export async function POST(req: NextRequest) {
  const { membership_no, name } = await req.json();
  if (!membership_no || !name) {
    return NextResponse.json({ error: "멤버십 번호와 이름을 입력해주세요." }, { status: 400 });
  }

  const memberKey = String(membership_no).trim();
  const userName = String(name).trim();

  const user = await getOrCreateUser(memberKey, userName);
  const res = NextResponse.json({ ok: true, user });
  res.cookies.set("member_key", memberKey, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

// GET /api/auth?member_key=xxx → 레거시 (미사용)
export async function GET(req: NextRequest) {
  const memberKey = req.nextUrl.searchParams.get("member_key");
  if (!memberKey) {
    return NextResponse.json({ error: "member_key 없음" }, { status: 400 });
  }
  const user = await getOrCreateUser(memberKey);
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
