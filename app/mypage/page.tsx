export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import LogoutButton from "./LogoutButton";
import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

interface PointHistory { id: number; type: string; amount: number; description: string; created_at: string; }

export default async function MypagePage() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const user = await getOrCreateUser(memberKey);

  const history = await sql`
    SELECT id, type, amount, description, created_at
    FROM point_history WHERE user_id = ${user.id} ORDER BY created_at DESC LIMIT 20
  ` as PointHistory[];

  const initials = user.name.slice(0, 1);
  const masked = user.member_key
    ? user.member_key.slice(0, 4) + "****" + (user.member_key.length > 8 ? user.member_key.slice(-4) : "")
    : "****";

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F6F4EF]">

      {/* 다크 헤더 — HTML과 동일 */}
      <div style={{ background: "#1A1A1A", padding: "56px 20px 20px" }}>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>마이페이지</div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* 프로필 카드 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", padding: 16, borderRadius: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#1A1A1A", color: "#C9A96E",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 18, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>{user.name}님</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>그린 멤버 · 회원번호 {masked}</div>
          </div>
        </div>

        {/* 포인트 카드 */}
        <div style={{
          background: "linear-gradient(155deg,#232323,#141414)",
          border: "1px solid rgba(201,169,110,0.4)",
          borderRadius: 16, padding: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ color: "#C9A96E", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>보유 포인트</div>
            <div className="font-display" style={{ color: "#fff", fontSize: 28, fontWeight: 800, marginTop: 6 }}>
              {Number(user.points).toLocaleString()}
              <span style={{ color: "#C9A96E", fontSize: 14 }}> P</span>
            </div>
          </div>
          <Link
            href="/mypage/reward"
            style={{ background: "#C9A96E", color: "#1A1A1A", fontSize: 12, fontWeight: 800, padding: "10px 16px", borderRadius: 24, flexShrink: 0, textDecoration: "none" }}
          >
            리워드 상점
          </Link>
        </div>

        {/* 포인트 내역 */}
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", marginTop: 6 }}>포인트 내역</div>

        {history.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 12, padding: "24px 16px", textAlign: "center", fontSize: 13, color: "#999" }}>
            아직 포인트 내역이 없습니다
          </div>
        ) : (
          history.map((h) => (
            <div
              key={h.id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "14px 16px", borderRadius: 12 }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{h.description}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{String(h.created_at).slice(0, 10)}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: h.type === "earn" ? "#C9A96E" : "#999" }}>
                {h.type === "earn" ? "+" : "−"}{Number(h.amount)}P
              </div>
            </div>
          ))
        )}

        <LogoutButton />
      </div>

      <BottomNav />
    </div>
  );
}
