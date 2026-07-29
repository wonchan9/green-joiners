import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/rewards/requests → 교환 신청 목록 (어드민)
export async function GET() {
  const rows = await sql`
    SELECT rr.id, rr.user_id, rr.reward_id, rr.used_points, rr.status, rr.created_at,
           u.name, u.member_key,
           r.title as reward_title
    FROM reward_requests rr
    JOIN users u ON rr.user_id = u.id
    JOIN rewards r ON rr.reward_id = r.id
    ORDER BY rr.created_at DESC
  `;
  return NextResponse.json(rows);
}
