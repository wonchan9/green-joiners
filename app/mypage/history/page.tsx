import { cookies } from "next/headers";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { getDb } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

interface PointHistory { id: number; type: string; amount: number; description: string; created_at: string; }

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const db = getDb();
  const user = getOrCreateUser(memberKey);

  const history = db.prepare(
    "SELECT id, type, amount, description, created_at FROM point_history WHERE user_id = ? ORDER BY created_at DESC"
  ).all(user.id) as PointHistory[];

  return (
    <div className="pb-24 max-w-md mx-auto bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-40">
        <Link href="/mypage" className="text-gray-400 text-xl leading-none">←</Link>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.15em] text-gray-400 font-bold uppercase leading-none">History</p>
          <h1 className="font-bold text-base leading-snug">포인트 내역</h1>
        </div>
        <span className="text-xs font-bold text-[#C9A96E] border border-[#C9A96E] px-2.5 py-1 rounded-full">
          {user.points.toLocaleString()}P
        </span>
      </div>

      <div className="bg-white">
        {history.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-20">포인트 내역이 없습니다</p>
        ) : (
          history.map((h, i) => (
            <div
              key={h.id}
              className={`flex items-center gap-3 px-4 py-4 ${i !== 0 ? "border-t border-gray-50" : ""}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${h.type === "earn" ? "bg-[#C9A96E]" : "bg-gray-200"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{h.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.created_at.slice(0, 16)}</p>
              </div>
              <span className={`font-bold text-sm shrink-0 ml-2 ${h.type === "earn" ? "text-[#C9A96E]" : "text-gray-400"}`}>
                {h.type === "earn" ? "+" : "−"}{h.amount}P
              </span>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
