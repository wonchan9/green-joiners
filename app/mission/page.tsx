export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { ReceiptIcon, BasketIcon, TumblerIcon, TagIcon, CameraIcon } from "@/components/Icons";
import { getOrCreateUser } from "@/lib/session";
import { getMissionsWithStatus } from "@/lib/missions";

const missionConfig: Record<string, {
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
  label: string;
}> = {
  receipt: { Icon: ReceiptIcon, bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]", label: "영수증"   },
  basket:  { Icon: BasketIcon,  bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]", label: "장바구니" },
  tumbler: { Icon: TumblerIcon, bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]", label: "텀블러"   },
  reals:   { Icon: TagIcon,     bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]", label: "리얼스"   },
  daily:   { Icon: CameraIcon,  bg: "bg-[#1A1A1A]", color: "text-[#C9A96E]", label: "데일리"   },
};

export default async function MissionListPage() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const user = await getOrCreateUser(memberKey);
  const missions = await getMissionsWithStatus(user.id);

  const completedCount = missions.filter((m) => m.completed_today).length;

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F6F4EF]">

      {/* 다크 헤더 — HTML 마이페이지 패턴과 동일 */}
      <div style={{ background: "#1A1A1A", padding: "56px 20px 20px" }}>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>미션</div>
      </div>

      {/* 진행 상황 + 미션 목록 */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>오늘의 미션</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C9A96E" }}>{completedCount}/{missions.length} 완료</div>
        </div>
        <div style={{ height: 6, background: "#E5E3DD", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "#C9A96E",
            borderRadius: 3,
            width: `${missions.length ? (completedCount / missions.length) * 100 : 0}%`,
          }} />
        </div>
      </div>

      <div style={{ padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {missions.map((m) => {
          const cfg = missionConfig[m.type] ?? missionConfig.daily;
          const { Icon, bg, color, label } = cfg;

          if (m.completed_today) {
            return (
              <div
                key={m.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#fff", borderRadius: 14, opacity: 0.4 }}
              >
                <div className="w-[38px] h-[38px] bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gray-400 border border-gray-300 px-1.5 py-0.5 rounded font-medium">{label}</span>
                  <p className="font-bold text-sm mt-0.5">{m.title}</p>
                </div>
                <span className="text-xs text-gray-400 font-semibold shrink-0">완료</span>
              </div>
            );
          }

          return (
            <Link
              key={m.id}
              href={`/mission/${m.type}`}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#fff", borderRadius: 14, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
            >
              <div className={`w-[38px] h-[38px] ${bg} rounded-full flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] border px-1.5 py-0.5 rounded font-medium ${color} border-current`}>{label}</span>
                <p className="font-bold text-sm mt-0.5">{m.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{m.description}</p>
              </div>
              <span className="bg-[#FBF5E8] text-[#C9A96E] font-bold text-xs px-2.5 py-1 rounded-lg shrink-0">
                +{m.points}P
              </span>
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
