import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import { cookies } from "next/headers";

// GET /api/missions → 미션 목록 + 오늘 참여 여부
export async function GET() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;

  const db = getDb();
  const missions = db.prepare("SELECT * FROM missions WHERE active = 1").all();

  if (!memberKey) return NextResponse.json(missions);

  const user = getOrCreateUser(memberKey);
  const today = new Date().toISOString().slice(0, 10);

  const missionsWithStatus = (missions as Record<string, unknown>[]).map((m) => {
    const todayCount = (
      db
        .prepare(
          `SELECT COUNT(*) as cnt FROM participations
           WHERE user_id = ? AND mission_id = ? AND date(created_at) = ?`
        )
        .get(user.id, m.id, today) as { cnt: number }
    ).cnt;
    return { ...m, completed_today: todayCount >= (m.daily_limit as number) };
  });

  return NextResponse.json(missionsWithStatus);
}

// PATCH /api/missions/:id → 관리자 포인트 수정
export async function PATCH(req: NextRequest) {
  const { id, points } = await req.json();
  const db = getDb();
  db.prepare("UPDATE missions SET points = ? WHERE id = ?").run(points, id);
  return NextResponse.json({ ok: true });
}
