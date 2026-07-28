import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/session";

// POST /api/participate — body: { mission_id, quantity? }
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;
  if (!memberKey) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  const user = getOrCreateUser(memberKey);
  const { mission_id, quantity = 1 } = await req.json();
  const db = getDb();

  const mission = db.prepare("SELECT * FROM missions WHERE id = ?").get(mission_id) as {
    id: number; title: string; points: number; daily_limit: number;
  } | undefined;
  if (!mission) return NextResponse.json({ error: "미션 없음" }, { status: 404 });

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (
    db.prepare(
      "SELECT COUNT(*) as cnt FROM participations WHERE user_id = ? AND mission_id = ? AND date(created_at) = ?"
    ).get(user.id, mission.id, today) as { cnt: number }
  ).cnt;

  if (todayCount >= mission.daily_limit && mission.daily_limit > 0) {
    return NextResponse.json({ error: "오늘은 이미 참여했습니다" }, { status: 409 });
  }

  const earnedPoints = mission.points * Math.max(1, quantity);

  db.transaction(() => {
    db.prepare(
      "INSERT INTO participations (user_id, mission_id, earned_points) VALUES (?, ?, ?)"
    ).run(user.id, mission.id, earnedPoints);
    db.prepare("UPDATE users SET points = points + ? WHERE id = ?").run(earnedPoints, user.id);
    db.prepare(
      "INSERT INTO point_history (user_id, type, amount, description) VALUES (?, 'earn', ?, ?)"
    ).run(user.id, earnedPoints, `${mission.title} 참여`);
  })();

  const updated = db.prepare("SELECT points FROM users WHERE id = ?").get(user.id) as { points: number };
  return NextResponse.json({ ok: true, earned_points: earnedPoints, total_points: updated.points });
}

// GET /api/participate → 전체 참여 내역 (어드민)
export async function GET() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.id, p.status, p.earned_points, p.created_at,
           u.member_key, u.name,
           m.title as mission_title, m.type as mission_type
    FROM participations p
    JOIN users u ON p.user_id = u.id
    JOIN missions m ON p.mission_id = m.id
    ORDER BY p.created_at DESC
  `).all();
  return NextResponse.json(rows);
}

// PATCH /api/participate → 반려 처리
export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  const db = getDb();
  const p = db.prepare("SELECT * FROM participations WHERE id = ?").get(id) as {
    id: number; user_id: number; earned_points: number; status: string;
  } | undefined;
  if (!p || p.status !== "completed") return NextResponse.json({ error: "처리 불가" }, { status: 400 });

  db.transaction(() => {
    db.prepare("UPDATE participations SET status = 'rejected' WHERE id = ?").run(id);
    db.prepare("UPDATE users SET points = points - ? WHERE id = ?").run(p.earned_points, p.user_id);
    db.prepare(
      "INSERT INTO point_history (user_id, type, amount, description) VALUES (?, 'use', ?, '미션 반려 포인트 회수')"
    ).run(p.user_id, p.earned_points);
  })();

  return NextResponse.json({ ok: true });
}
