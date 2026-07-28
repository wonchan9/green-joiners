// MVP용 간단한 세션 관리 (쿠키 기반)
import { cookies } from "next/headers";
import { getDb } from "./db";

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

  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE member_key = ?").get(memberKey) as SessionUser | undefined;
  return user ?? null;
}

export function getOrCreateUser(memberKey: string, name?: string): SessionUser {
  const db = getDb();
  let user = db.prepare("SELECT * FROM users WHERE member_key = ?").get(memberKey) as SessionUser | undefined;
  if (!user) {
    const userName = name ?? "그린조이너";
    db.prepare("INSERT INTO users (member_key, name) VALUES (?, ?)").run(memberKey, userName);
    user = db.prepare("SELECT * FROM users WHERE member_key = ?").get(memberKey) as SessionUser;
  } else if (name && user.name !== name) {
    // 이름이 변경된 경우 업데이트
    db.prepare("UPDATE users SET name = ? WHERE member_key = ?").run(name, memberKey);
    user = { ...user, name };
  }
  return user;
}
