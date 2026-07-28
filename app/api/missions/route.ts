import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import { cookies } from "next/headers";

// GET /api/missions → 미션 목록 + 오늘 참여 여부
// ?all=1 파라미터 시 비활성 미션 포함 (어드민 전용)
export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "1";
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;

  const db = getDb();
  const missions = db.prepare(
    showAll ? "SELECT * FROM missions ORDER BY id" : "SELECT * FROM missions WHERE active = 1 ORDER BY id"
  ).all();

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

// POST /api/missions → 새 미션 등록 (어드민)
export async function POST(req: NextRequest) {
  const { type = "daily", title, description, points, daily_limit = 1 } = await req.json();
  if (!title || !points) {
    return NextResponse.json({ error: "제목과 포인트는 필수입니다." }, { status: 400 });
  }
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO missions (type, title, description, points, daily_limit, active) VALUES (?, ?, ?, ?, ?, 1)"
    )
    .run(type, title, description ?? "", Number(points), Number(daily_limit));
  const mission = db.prepare("SELECT * FROM missions WHERE id = ?").get(result.lastInsertRowid);
  return NextResponse.json({ ok: true, mission });
}

// PATCH /api/missions → 포인트 수정 or active 토글
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  const db = getDb();

  if ("active" in body) {
    db.prepare("UPDATE missions SET active = ? WHERE id = ?").run(body.active ? 1 : 0, id);
  } else if ("points" in body) {
    db.prepare("UPDATE missions SET points = ? WHERE id = ?").run(body.points, id);
  }

  return NextResponse.json({ ok: true });
}
