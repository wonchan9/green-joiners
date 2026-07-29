import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/session";

// GET /api/rewards → 리워드 목록
export async function GET() {
  const rewards = await sql`SELECT * FROM rewards WHERE visible = 1`;
  return NextResponse.json(rewards);
}

// POST /api/rewards → 리워드 교환 신청
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;
  if (!memberKey) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  const user = await getOrCreateUser(memberKey);
  const { reward_id } = await req.json();

  const rewardRows = await sql`SELECT * FROM rewards WHERE id = ${reward_id} AND visible = 1`;
  if (rewardRows.length === 0) return NextResponse.json({ error: "리워드 없음" }, { status: 404 });
  const reward = rewardRows[0];

  if (Number(reward.stock) <= 0) return NextResponse.json({ error: "품절" }, { status: 409 });

  const userRows = await sql`SELECT points FROM users WHERE id = ${user.id}`;
  if (Number(userRows[0].points) < Number(reward.required_points)) {
    return NextResponse.json({ error: "포인트 부족" }, { status: 400 });
  }

  const desc = `${reward.title} 교환`;
  await sql.transaction([
    sql`INSERT INTO reward_requests (user_id, reward_id, used_points) VALUES (${user.id}, ${reward.id}, ${reward.required_points})`,
    sql`UPDATE users SET points = points - ${reward.required_points} WHERE id = ${user.id}`,
    sql`UPDATE rewards SET stock = stock - 1 WHERE id = ${reward.id}`,
    sql`INSERT INTO point_history (user_id, type, amount, description) VALUES (${user.id}, 'use', ${reward.required_points}, ${desc})`,
  ]);

  return NextResponse.json({ ok: true });
}
