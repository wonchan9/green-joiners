import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/session";

// POST /api/participate — body: { mission_id, quantity? }
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;
  if (!memberKey) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  const user = await getOrCreateUser(memberKey);
  const { mission_id, quantity = 1 } = await req.json();

  const missionRows = await sql`SELECT * FROM missions WHERE id = ${mission_id}`;
  if (missionRows.length === 0) return NextResponse.json({ error: "미션 없음" }, { status: 404 });
  const mission = missionRows[0];

  const today = new Date().toISOString().slice(0, 10);
  const countRows = await sql`
    SELECT COUNT(*) as cnt FROM participations
    WHERE user_id = ${user.id} AND mission_id = ${mission.id} AND created_at::date = ${today}::date
  `;
  const todayCount = Number(countRows[0].cnt);

  if (todayCount >= Number(mission.daily_limit) && Number(mission.daily_limit) > 0) {
    return NextResponse.json({ error: "오늘은 이미 참여했습니다" }, { status: 409 });
  }

  const earnedPoints = Number(mission.points) * Math.max(1, quantity);
  const desc = `${mission.title} 참여`;

  await sql.transaction([
    sql`INSERT INTO participations (user_id, mission_id, earned_points) VALUES (${user.id}, ${mission.id}, ${earnedPoints})`,
    sql`UPDATE users SET points = points + ${earnedPoints} WHERE id = ${user.id}`,
    sql`INSERT INTO point_history (user_id, type, amount, description) VALUES (${user.id}, 'earn', ${earnedPoints}, ${desc})`,
  ]);

  const updatedRows = await sql`SELECT points FROM users WHERE id = ${user.id}`;
  return NextResponse.json({ ok: true, earned_points: earnedPoints, total_points: updatedRows[0].points });
}

// GET /api/participate → 전체 참여 내역 (어드민)
export async function GET() {
  const rows = await sql`
    SELECT p.id, p.status, p.earned_points, p.created_at,
           u.member_key, u.name,
           m.title as mission_title, m.type as mission_type
    FROM participations p
    JOIN users u ON p.user_id = u.id
    JOIN missions m ON p.mission_id = m.id
    ORDER BY p.created_at DESC
  `;
  return NextResponse.json(rows);
}

// PATCH /api/participate → 반려 처리
export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  const pRows = await sql`SELECT * FROM participations WHERE id = ${id}`;
  if (pRows.length === 0 || pRows[0].status !== "completed") {
    return NextResponse.json({ error: "처리 불가" }, { status: 400 });
  }
  const p = pRows[0];

  await sql.transaction([
    sql`UPDATE participations SET status = 'rejected' WHERE id = ${id}`,
    sql`UPDATE users SET points = points - ${p.earned_points} WHERE id = ${p.user_id}`,
    sql`INSERT INTO point_history (user_id, type, amount, description) VALUES (${p.user_id}, 'use', ${p.earned_points}, '미션 반려 포인트 회수')`,
  ]);

  return NextResponse.json({ ok: true });
}
