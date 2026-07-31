import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { getOrCreateUser } from "@/lib/session";
import { ReceiptMission, QrMission, RealsMission, DailyMission } from "../MissionClients";

const typeLabel: Record<string, string> = {
  receipt: "모바일 영수증 미션",
  basket: "장바구니 미션",
  tumbler: "다회용기/텀블러 미션",
  reals: "리얼스 미션",
  daily: "데일리 일상 미션",
};

interface Mission { id: number; type: string; points: number; title: string; daily_limit: number; }

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const cookieStore = await cookies();
  const memberKey = cookieStore.get("member_key")?.value ?? "guest";
  const user = await getOrCreateUser(memberKey);

  const missionRows = await sql`SELECT * FROM missions WHERE type = ${type} AND active = 1`;
  if (missionRows.length === 0) notFound();
  const mission = missionRows[0] as Mission;

  const today = new Date().toISOString().slice(0, 10);
  const countRows = await sql`
    SELECT COUNT(*) as cnt FROM participations
    WHERE user_id = ${user.id} AND mission_id = ${mission.id} AND created_at::date = ${today}::date
  `;
  const cnt = Number(countRows[0].cnt);
  const completedToday = cnt >= Number(mission.daily_limit);

  return (
    <div className="pb-20 max-w-md mx-auto bg-[#F6F4EF]">
      <div className="bg-[#1A1A1A] px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <Link href="/mission" className="text-white/60 text-xl leading-none">←</Link>
        <h1 className="font-bold text-base flex-1 text-white">{typeLabel[type]}</h1>
        <span className="text-xs font-bold text-[#C9A96E] border border-[#C9A96E]/60 px-2.5 py-1 rounded-full">
          +{mission.points}P
        </span>
      </div>

      {completedToday ? (
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p className="font-bold text-gray-600">오늘의 미션 완료!</p>
          <p className="text-sm text-gray-400 mt-1">내일 다시 참여하세요</p>
        </div>
      ) : (
        <>
          {type === "receipt" && <ReceiptMission missionId={mission.id} points={mission.points} />}
          {type === "basket" && <QrMission missionId={mission.id} points={mission.points} label="롯데백화점 장바구니" />}
          {type === "tumbler" && <QrMission missionId={mission.id} points={mission.points} label="다회용기/텀블러" />}
          {type === "reals" && <RealsMission missionId={mission.id} points={mission.points} />}
          {type === "daily" && <DailyMission missionId={mission.id} points={mission.points} />}
        </>
      )}
    </div>
  );
}
