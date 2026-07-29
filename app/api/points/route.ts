import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/session";

// GET /api/points → 유저 포인트 내역
export async function GET() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;
  if (!memberKey) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  const user = await getOrCreateUser(memberKey);

  const [history, pointsRow] = await Promise.all([
    sql`SELECT * FROM point_history WHERE user_id = ${user.id} ORDER BY created_at DESC`,
    sql`SELECT points FROM users WHERE id = ${user.id}`,
  ]);

  return NextResponse.json({ points: pointsRow[0].points, history });
}
