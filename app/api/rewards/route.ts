import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { getOrCreateUser } from "@/lib/session";

// GET /api/rewards → 리워드 목록
export async function GET() {
  const db = getDb();
  const rewards = db.prepare("SELECT * FROM rewards WHERE visible = 1").all();
  return NextResponse.json(rewards);
}

// POST /api/rewards → 리워드 교환 신청
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;
  if (!memberKey) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  const user = getOrCreateUser(memberKey);
  const { reward_id } = await req.json();
  const db = getDb();

  const reward = db.prepare("SELECT * FROM rewards WHERE id = ? AND visible = 1").get(reward_id) as {
    id: number; title: string; required_points: number; stock: number;
  } | undefined;

  if (!reward) return NextResponse.json({ error: "리워드 없음" }, { status: 404 });
  if (reward.stock <= 0) return NextResponse.json({ error: "품절" }, { status: 409 });

  const currentUser = db.prepare("SELECT points FROM users WHERE id = ?").get(user.id) as { points: number };
  if (currentUser.points < reward.required_points) {
    return NextResponse.json({ error: "포인트 부족" }, { status: 400 });
  }

  db.transaction(() => {
    db.prepare("INSERT INTO reward_requests (user_id, reward_id, used_points) VALUES (?, ?, ?)").run(
      user.id, reward.id, reward.required_points
    );
    db.prepare("UPDATE users SET points = points - ? WHERE id = ?").run(reward.required_points, user.id);
    db.prepare("UPDATE rewards SET stock = stock - 1 WHERE id = ?").run(reward.id);
    db.prepare(
      "INSERT INTO point_history (user_id, type, amount, description) VALUES (?, 'use', ?, ?)"
    ).run(user.id, reward.required_points, `${reward.title} 교환`);
  })();

  return NextResponse.json({ ok: true });
}
