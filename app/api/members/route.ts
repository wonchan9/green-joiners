import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/members → 회원 목록 (어드민)
export async function GET() {
  const members = await sql`
    SELECT id, member_key, name, points, created_at as joined_at
    FROM users ORDER BY created_at DESC
  `;
  return NextResponse.json(members);
}
