export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import BottomNav from "@/components/BottomNav";
import { ChevronRightIcon, ReceiptIcon, BasketIcon, TumblerIcon, TagIcon, CameraIcon } from "@/components/Icons";
import { getOrCreateUser } from "@/lib/session";
import { getMissionsWithStatus } from "@/lib/missions";

const missionConfig: Record<string, {
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
}> = {
  receipt: { Icon: ReceiptIcon, bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]" },
  basket:  { Icon: BasketIcon,  bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]" },
  tumbler: { Icon: TumblerIcon, bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]" },
  reals:   { Icon: TagIcon,     bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]" },
  daily:   { Icon: CameraIcon,  bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]" },
};

export default async function Home() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";

  const user = await getOrCreateUser(memberKey);
  const missions = await getMissionsWithStatus(user.id);

  const incompleteMissions = missions.filter((m) => !m.completed_today).slice(0, 3);
  const completedCount = missions.filter((m) => m.completed_today).length;

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F6F4EF]">

      {/* 다크 히어로 헤더 */}
      <div className="bg-[#1A1A1A] px-5 pt-14 pb-10">
        <div className="flex justify-between items-start">
          <div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500 }}>안녕하세요</div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginTop: 2 }}>{user.name}님</div>
          </div>
          <div style={{
            border: "1px solid #C9A96E",
            color: "#C9A96E",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.5px",
            padding: "5px 10px",
            borderRadius: 20,
          }}>
            그린 멤버
          </div>
        </div>
      </div>

      {/* GREEN POINT 카드 — 헤더와 겹침 */}
      <div className="px-5" style={{ marginTop: -24 }}>
        <div style={{
          background: "linear-gradient(155deg, #232323, #141414)",
          border: "1px solid rgba(201,169,110,0.4)",
          borderRadius: 20,
          padding: "26px 22px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
        }}>
          <div style={{ color: "#C9A96E", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
            보유 포인트
          </div>
          <div className="font-display" style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
            <span style={{ color: "#fff", fontSize: 44, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>
              {Number(user.points).toLocaleString()}
            </span>
            <span style={{ color: "#C9A96E", fontSize: 18, fontWeight: 700 }}>P</span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <span style={{ color: "rgba(201,169,110,0.6)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
              그린 조이너스
            </span>
          </div>
        </div>
      </div>

      {/* 이번 달 캠페인 배너 */}
      <div className="px-5 mt-5">
        <div style={{
          background: "#1A1A1A",
          borderRadius: 16,
          padding: 20,
          borderLeft: "3px solid #B8935A",
        }}>
          <div style={{ color: "#C9A96E", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>이번 달 캠페인</div>
          <div className="font-display" style={{ color: "#fff", fontSize: 19, fontWeight: 700, marginTop: 8 }}>친환경 미션 위크</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 6 }}>미션 4개 모두 완료 시 보너스 200P</div>
        </div>
      </div>

      {/* 오늘의 미션 */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>오늘의 미션</h2>
          <Link href="/mission" style={{ fontSize: 13, fontWeight: 700, color: "#C9A96E" }}>
            {completedCount}/{missions.length} 완료
          </Link>
        </div>
        <div style={{ height: 6, background: "#E5E3DD", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
          <div style={{
            height: "100%",
            background: "#C9A96E",
            borderRadius: 3,
            width: `${missions.length ? (completedCount / missions.length) * 100 : 0}%`,
          }} />
        </div>
        <div className="flex flex-col gap-2.5">
          {incompleteMissions.map((m) => {
            const { Icon, bg, color } = missionConfig[m.type] ?? missionConfig.daily;
            return (
              <Link
                key={m.id}
                href={`/mission/${m.type}`}
                style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <div className={`w-[38px] h-[38px] ${bg} rounded-full flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{m.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{m.description}</p>
                </div>
                <span className="bg-[#FBF5E8] text-[#C9A96E] font-bold text-xs px-2.5 py-1 rounded-lg shrink-0">
                  +{m.points}P
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 리워드샵 */}
      <div className="px-5 mt-3 mb-4">
        <Link href="/mypage/reward" className="bg-[#1A1A1A] rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">리워드 교환하기</p>
            <p className="text-white/40 text-xs mt-0.5">보유 {Number(user.points).toLocaleString()}P</p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-[#C9A96E]" />
        </Link>
      </div>

      <footer className="px-4 py-6 text-xs text-gray-400 text-center border-t border-gray-100">
        <p>코즈웍스 | 서울특별시 성동구 아차산로 | 사업자 123-45-67890</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/privacy" className="underline">개인정보처리방침</Link>
          <Link href="/terms" className="underline">이용약관</Link>
        </div>
      </footer>
      <BottomNav />
    </div>
  );
}
