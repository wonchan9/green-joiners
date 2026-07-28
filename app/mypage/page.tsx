import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { GiftIcon, ListIcon, ChevronRightIcon } from "@/components/Icons";
import { getDb } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

interface PointHistory { id: number; type: string; amount: number; description: string; created_at: string; }

export default async function MypagePage() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const db = getDb();
  const user = getOrCreateUser(memberKey);

  const history = db.prepare(
    "SELECT id, type, amount, description, created_at FROM point_history WHERE user_id = ? ORDER BY created_at DESC"
  ).all(user.id) as PointHistory[];

  const earnTotal = history.filter((h) => h.type === "earn").reduce((s, h) => s + h.amount, 0);
  const useTotal  = history.filter((h) => h.type === "use").reduce((s, h) => s + h.amount, 0);

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F4F4F4]">
      <Header points={user.points} />

      {/* 포인트 히어로 카드 */}
      <div className="mx-4 mt-4">
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-lg">
          <p className="text-[10px] tracking-[0.2em] text-[#C9A96E] font-bold uppercase mb-4">My Point</p>
          <p className="text-sm text-white/50 mb-1">안녕하세요, {user.name}님</p>
          <div className="flex items-end gap-1 mb-5">
            <span className="text-5xl font-black text-white leading-none">{user.points.toLocaleString()}</span>
            <span className="text-[#C9A96E] font-black text-3xl leading-none mb-1">P</span>
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

      {/* 메뉴 그리드 */}
      <section className="px-4 py-4 grid grid-cols-2 gap-3">
        <Link href="/mypage/reward" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 bg-[#FBF5E8] rounded-xl flex items-center justify-center">
            <GiftIcon className="w-5 h-5 text-[#C9A96E]" />
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-[#C9A96E] font-bold uppercase">Reward</p>
            <p className="font-bold text-sm mt-0.5">리워드샵</p>
            <p className="text-xs text-gray-400">포인트로 교환</p>
          </div>
        </Link>
        <Link href="/mypage/history" className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
            <ListIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-400 font-bold uppercase">History</p>
            <p className="font-bold text-sm mt-0.5">포인트 내역</p>
            <p className="text-xs text-gray-400">적립/사용 내역</p>
          </div>
        </Link>
      </section>

      {/* 최근 내역 */}
      <section className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-[#E5002B] rounded-full" />
            <h2 className="font-bold text-sm">최근 포인트 내역</h2>
          </div>
          <Link href="/mypage/history" className="flex items-center gap-0.5 text-xs text-[#E5002B]">
            전체보기 <ChevronRightIcon className="w-3 h-3" />
          </Link>
        </div>
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-400 shadow-sm">
            아직 포인트 내역이 없습니다
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {history.slice(0, 5).map((h, i) => (
              <div
                key={h.id}
                className={`flex items-center gap-3 px-4 py-3 ${i !== 0 ? "border-t border-gray-50" : ""}`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${h.type === "earn" ? "bg-[#C9A96E]" : "bg-gray-200"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{h.description}</p>
                  <p className="text-xs text-gray-400">{h.created_at.slice(0, 16)}</p>
                </div>
                <span className={`font-bold text-sm shrink-0 ${h.type === "earn" ? "text-[#C9A96E]" : "text-gray-400"}`}>
                  {h.type === "earn" ? "+" : "−"}{h.amount}P
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
}
