import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import { getMissionsWithStatus } from "@/lib/missions";
import { cookies } from "next/headers";

// GET /api/missions → 미션 목록 + 오늘 참여 여부
// ?all=1 파라미터 시 비활성 미션 포함 (어드민 전용)
export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "1";
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;

  if (!memberKey) {
    const missions = showAll
      ? await sql`SELECT * FROM missions ORDER BY id`
      : await sql`SELECT * FROM missions WHERE active = 1 ORDER BY id`;
    return NextResponse.json(missions);
  }

  const user = await getOrCreateUser(memberKey);
  const missionsWithStatus = await getMissionsWithStatus(user.id, showAll);
  return NextResponse.json(missionsWithStatus);
}

// POST /api/missions → 새 미션 등록 (어드민)
export async function POST(req: NextRequest) {
  const { type = "daily", title, description, points, daily_limit = 1 } = await req.json();
  if (!title || !points) {
    return NextResponse.json({ error: "제목과 포인트는 필수입니다." }, { status: 400 });
  }
  const rows = await sql`
    INSERT INTO missions (type, title, description, points, daily_limit, active)
    VALUES (${type}, ${title}, ${description ?? ""}, ${Number(points)}, ${Number(daily_limit)}, 1)
    RETURNING *
  `;
  return NextResponse.json({ ok: true, mission: rows[0] });
}

// PATCH /api/missions → 포인트 수정 or active 토글
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if ("active" in body) {
    await sql`UPDATE missions SET active = ${body.active ? 1 : 0} WHERE id = ${id}`;
  } else if ("points" in body) {
    await sql`UPDATE missions SET points = ${body.points} WHERE id = ${id}`;
  }

  return NextResponse.json({ ok: true });
}
