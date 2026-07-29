import { cookies } from "next/headers";
import { sql } from "./db";

export interface SessionUser {
  id: number;
  member_key: string;
  name: string;
  points: number;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value;
  if (!memberKey) return null;
  const rows = await sql`SELECT * FROM users WHERE member_key = ${memberKey}`;
  return (rows[0] as SessionUser) ?? null;
}

export async function getOrCreateUser(memberKey: string, name?: string): Promise<SessionUser> {
  const insertName = name ?? "그린조이너";
  const rows = await sql`
    INSERT INTO users (member_key, name)
    VALUES (${memberKey}, ${insertName})
    ON CONFLICT (member_key) DO UPDATE SET
      name = COALESCE(${name ?? null}, users.name)
    RETURNING *
  `;
  return rows[0] as SessionUser;
}
