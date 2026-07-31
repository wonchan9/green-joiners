export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import { GiftIcon } from "@/components/Icons";
import RewardClient from "./RewardClient";

interface Reward { id: number; title: string; required_points: number; stock: number; }

export default async function RewardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const user = await getOrCreateUser(memberKey);

  const rows = await sql`SELECT * FROM rewards WHERE id = ${Number(id)} AND visible = 1`;
  if (rows.length === 0) notFound();
  const reward = rows[0] as Reward;

  const canExchange = Number(user.points) >= Number(reward.required_points) && Number(reward.stock) > 0;

  return (
    <div className="pb-20 max-w-md mx-auto bg-[#F6F4EF]">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-40">
        <Link href="/mypage/reward" className="text-gray-500 text-xl">←</Link>
        <h1 className="font-bold text-base">리워드 상세</h1>
      </div>

      <div className="px-4 py-8 flex flex-col items-center gap-4">
        <div className="w-24 h-24 bg-[#FBF5E8] rounded-3xl flex items-center justify-center">
          <GiftIcon className="w-12 h-12 text-[#C9A96E]" />
        </div>
        <h2 className="font-display text-2xl font-bold">{reward.title}</h2>
        <p className="text-gray-500 text-sm">잔여 수량: {reward.stock}개</p>

        <div className="w-full bg-white rounded-2xl p-4 shadow-sm mt-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">필요 포인트</span>
            <span className="font-bold text-[#C9A96E]">{Number(reward.required_points).toLocaleString()}P</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">보유 포인트</span>
            <span className="font-bold">{Number(user.points).toLocaleString()}P</span>
          </div>
        </div>

        <RewardClient reward={reward} canExchange={canExchange} />
      </div>
    </div>
  );
}
