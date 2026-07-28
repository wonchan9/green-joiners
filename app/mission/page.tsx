export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ReceiptIcon, BasketIcon, TumblerIcon, TagIcon, CameraIcon } from "@/components/Icons";
import { getDb } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

const missionConfig: Record<string, {
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  color: string;
  label: string;
}> = {
  receipt: { Icon: ReceiptIcon, bg: "bg-red-50",     color: "text-[#E5002B]",  label: "영수증"   },
  basket:  { Icon: BasketIcon,  bg: "bg-emerald-50", color: "text-emerald-600", label: "장바구니" },
  tumbler: { Icon: TumblerIcon, bg: "bg-sky-50",     color: "text-sky-500",    label: "텀블러"   },
  reals:   { Icon: TagIcon,     bg: "bg-[#FBF5E8]",  color: "text-[#C9A96E]",  label: "리얼스"   },
  daily:   { Icon: CameraIcon,  bg: "bg-violet-50",  color: "text-violet-500", label: "데일리"   },
};

interface Mission {
  id: number; type: string; title: string; description: string;
  points: number; daily_limit: number; completed_today?: boolean;
}

export default async function MissionListPage() {
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

  const completedCount = missions.filter((m) => m.completed_today).length;

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F4F4F4]">
      <Header points={user.points} />

      <div className="px-4 pt-5 pb-4">
        <p className="text-[10px] tracking-[0.2em] text-[#E5002B] font-bold uppercase mb-1">Mission</p>
        <h1 className="font-black text-2xl">미션</h1>
        <p className="text-sm text-gray-400 mt-0.5">참여하고 포인트를 적립하세요</p>

        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500">오늘의 달성률</span>
            <span className="text-xs font-bold text-[#E5002B]">{completedCount}/{missions.length}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E5002B] rounded-full"
              style={{ width: `${missions.length ? (completedCount / missions.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-2.5">
        {missions.map((m) => {
          const cfg = missionConfig[m.type] ?? missionConfig.daily;
          const { Icon, bg, color, label } = cfg;

          if (m.completed_today) {
            return (
              <div key={m.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 opacity-40">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-gray-400 border border-gray-300 px-1.5 py-0.5 rounded font-medium">{label}</span>
                  </div>
                  <p className="font-bold text-sm">{m.title}</p>
                </div>
                <span className="text-xs text-gray-400 font-semibold shrink-0">완료</span>
              </div>
            );
          }

          return (
            <Link
              key={m.id}
              href={`/mission/${m.type}`}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[10px] border px-1.5 py-0.5 rounded font-medium ${color} border-current`}>
                    {label}
                  </span>
                </div>
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

      <BottomNav />
    </div>
  );
}
