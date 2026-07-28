import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/session";

// GET /api/points → 유저 포인트 내역
export async function GET() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;
  if (!memberKey) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  const user = getOrCreateUser(memberKey);
  const db = getDb();

  const history = db
    .prepare(
      `SELECT * FROM point_history WHERE user_id = ? ORDER BY created_at DESC`
    )
    .all(user.id);

  const { points } = db.prepare("SELECT points FROM users WHERE id = ?").get(user.id) as { points: number };

  return NextResponse.json({ points, history });
}
