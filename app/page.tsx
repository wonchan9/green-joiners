export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ChevronRightIcon, ReceiptIcon, BasketIcon, TumblerIcon, TagIcon, CameraIcon } from "@/components/Icons";
import { getDb } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

const missionConfig: Record<string, {
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
}> = {
  receipt: { Icon: ReceiptIcon, bg: "bg-red-50",     color: "text-[#E5002B]"  },
  basket:  { Icon: BasketIcon,  bg: "bg-emerald-50", color: "text-emerald-600" },
  tumbler: { Icon: TumblerIcon, bg: "bg-sky-50",     color: "text-sky-500"    },
  reals:   { Icon: TagIcon,     bg: "bg-[#FBF5E8]",  color: "text-[#C9A96E]"  },
  daily:   { Icon: CameraIcon,  bg: "bg-violet-50",  color: "text-violet-500" },
};

interface Mission {
  id: number; type: string; title: string; description: string;
  points: number; daily_limit: number; completed_today?: boolean;
}
interface PointHistory { type: string; amount: number; }

export default async function Home() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";

  const db = getDb();
  const user = getOrCreateUser(memberKey);
  const today = new Date().toISOString().slice(0, 10);

  const rawMissions = db.prepare("SELECT * FROM missions WHERE active = 1").all() as Mission[];
  const missions: Mission[] = rawMissions.map((m) => {
    const { cnt } = db.prepare(
      "SELECT COUNT(*) as cnt FROM participations WHERE user_id = ? AND mission_id = ? AND date(created_at) = ?"
    ).get(user.id, m.id, today) as { cnt: number };
    return { ...m, completed_today: cnt >= m.daily_limit };
  });

  const history = db.prepare(
    "SELECT type, amount FROM point_history WHERE user_id = ? ORDER BY created_at DESC"
  ).all(user.id) as PointHistory[];

  const earnTotal = history.filter((h) => h.type === "earn").reduce((s, h) => s + h.amount, 0);
  const useTotal  = history.filter((h) => h.type === "use").reduce((s, h) => s + h.amount, 0);

  const incompleteMissions = missions.filter((m) => !m.completed_today).slice(0, 3);
  const completedCount = missions.filter((m) => m.completed_today).length;

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F4F4F4]">
      <Header points={user.points} />

      {/* 포인트 카드 */}
      <div className="mx-4 mt-4">
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-[#C9A96E] font-bold uppercase">Green Joiners</p>
              <p className="text-[10px] text-white/30 mt-0.5">Eco Reward Card</p>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#C9A96E]/50 flex items-center justify-center">
              <span className="text-[#C9A96E] text-xs font-black">G</span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-[10px] text-white/40 mb-0.5">보유 포인트</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black text-white leading-none">{user.points.toLocaleString()}</span>
              <span className="text-[#C9A96E] font-black text-2xl leading-none mb-0.5">P</span>
            </div>
            <p className="text-[10px] text-white/30 mt-1">{user.name}님의 그린 포인트</p>
          </div>
          <div className="flex gap-6 border-t border-white/10 pt-4">
            <div>
              <p className="text-[10px] text-white/40">누적 적립</p>
              <p className="text-[#C9A96E] font-bold text-sm">+{earnTotal.toLocaleString()}P</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40">누적 사용</p>
              <p className="text-white font-bold text-sm">{useTotal.toLocaleString()}P</p>
            </div>
          </div>
        </div>
      </div>

      {/* 오늘의 미션 */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-[#E5002B] rounded-full" />
            <h2 className="font-bold text-base">오늘의 미션</h2>
          </div>
          <Link href="/mission" className="flex items-center gap-0.5 text-xs text-[#E5002B] font-semibold">
            전체보기 <ChevronRightIcon className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#E5002B] rounded-full" style={{ width: `${(completedCount / missions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-400 shrink-0 tabular-nums">{completedCount}/{missions.length} 완료</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {incompleteMissions.map((m) => {
            const { Icon, bg, color } = missionConfig[m.type] ?? missionConfig.daily;
            return (
              <Link key={m.id} href={`/mission/${m.type}`} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${color}`} />
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
      </section>

      {/* 캠페인 소개 */}
      <section className="mx-4 mt-4">
        <div className="bg-[#FBF5E8] rounded-2xl overflow-hidden flex">
          <span className="w-1 bg-[#C9A96E] shrink-0" />
          <div className="px-4 py-4">
            <p className="text-[10px] tracking-[0.15em] text-[#C9A96E] font-bold mb-1.5 uppercase">Campaign</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              그린 조이너스는 롯데백화점과 함께하는 친환경 실천 리워드 캠페인입니다.
              미션에 참여하고 포인트를 적립해 다양한 리워드로 교환하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 리워드샵 */}
      <section className="mx-4 mt-3 mb-4">
        <Link href="/mypage/reward" className="bg-[#1A1A1A] rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.15em] text-[#C9A96E] font-bold mb-0.5 uppercase">Reward Shop</p>
            <p className="text-white font-bold text-sm">리워드 교환하기</p>
            <p className="text-white/40 text-xs mt-0.5">보유 {user.points.toLocaleString()}P</p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-[#C9A96E]" />
        </Link>
      </section>

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
