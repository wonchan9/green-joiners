export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { GiftIcon } from "@/components/Icons";
import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";

interface Reward { id: number; title: string; required_points: number; stock: number; }

export default async function RewardListPage() {
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const user = await getOrCreateUser(memberKey);

  const rewards = await sql`SELECT * FROM rewards WHERE visible = 1` as Reward[];

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F4F4F4]">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-40">
        <Link href="/mypage" className="text-gray-400 text-xl leading-none">←</Link>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.15em] text-[#C9A96E] font-bold uppercase leading-none">Reward</p>
          <h1 className="font-bold text-base leading-snug">리워드샵</h1>
        </div>
        <span className="text-xs font-bold text-[#C9A96E] border border-[#C9A96E] px-2.5 py-1 rounded-full">
          {Number(user.points).toLocaleString()}P
        </span>
      </div>

      <div className="px-4 py-5">
        <p className="text-sm text-gray-400 mb-4">포인트로 리워드를 교환하세요</p>
        <div className="flex flex-col gap-3">
          {rewards.map((r) => {
            const canExchange = Number(user.points) >= Number(r.required_points) && Number(r.stock) > 0;
            return (
              <Link
                key={r.id}
                href={`/mypage/reward/${r.id}`}
                className={`bg-white rounded-2xl overflow-hidden flex shadow-sm ${
                  canExchange ? "border border-[#C9A96E]/40" : "border border-gray-100"
                }`}
              >
                {canExchange && <span className="w-1 bg-[#C9A96E] shrink-0" />}
                <div className="flex-1 p-4 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    canExchange ? "bg-[#FBF5E8]" : "bg-gray-50"
                  }`}>
                    <GiftIcon className={`w-7 h-7 ${canExchange ? "text-[#C9A96E]" : "text-gray-300"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">잔여 {r.stock}개</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-black text-sm ${canExchange ? "text-[#C9A96E]" : "text-gray-300"}`}>
                      {Number(r.required_points).toLocaleString()}P
                    </p>
                    {!canExchange && (
                      <p className="text-xs text-gray-300 mt-0.5">
                        {Number(r.stock) === 0 ? "품절" : "포인트 부족"}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
