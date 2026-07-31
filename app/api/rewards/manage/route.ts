import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/rewards/manage → 리워드 등록 (어드민)
export async function POST(req: NextRequest) {
  const { title, required_points, stock = 99 } = await req.json();
  if (!title || !required_points) {
    return NextResponse.json({ error: "이름과 필요 포인트는 필수입니다." }, { status: 400 });
  }
  await sql`INSERT INTO rewards (title, required_points, stock) VALUES (${title}, ${Number(required_points)}, ${Number(stock)})`;
  return NextResponse.json({ ok: true });
}
