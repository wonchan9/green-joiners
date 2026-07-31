export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

interface PointHistory { id: number; type: string; amount: number; description: string; created_at: string; }

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const user = await getOrCreateUser(memberKey);

  const history = await sql`
    SELECT id, type, amount, description, created_at
    FROM point_history WHERE user_id = ${user.id} ORDER BY created_at DESC
  ` as PointHistory[];

  return (
    <div className="pb-24 max-w-md mx-auto bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-40">
        <Link href="/mypage" className="text-gray-400 text-xl leading-none">←</Link>
        <h1 className="flex-1 font-bold text-base leading-snug">포인트 내역</h1>
        <span className="text-xs font-bold text-[#C9A96E] border border-[#C9A96E] px-2.5 py-1 rounded-full">
          {Number(user.points).toLocaleString()}P
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
                <p className="text-xs text-gray-400 mt-0.5">{String(h.created_at).slice(0, 16)}</p>
              </div>
              <span className={`font-bold text-sm shrink-0 ml-2 ${h.type === "earn" ? "text-[#C9A96E]" : "text-gray-400"}`}>
                {h.type === "earn" ? "+" : "−"}{Number(h.amount)}P
              </span>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
