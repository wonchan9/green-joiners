import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_MISSIONS } from "@/mock/data";
import { ReceiptMission, QrMission, RealsMission, DailyMission } from "../MissionClients";

const typeLabel: Record<string, string> = {
  receipt: "모바일 영수증 미션",
  basket: "장바구니 미션",
  tumbler: "다회용기/텀블러 미션",
  reals: "리얼스 미션",
  daily: "데일리 일상 미션",
};

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const mission = MOCK_MISSIONS.find((m) => m.type === type);
  if (!mission) notFound();

  return (
    <div className="pb-20 max-w-md mx-auto bg-[#F4F4F4]">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-40">
        <Link href="/mission" className="text-gray-400 text-xl leading-none">←</Link>
        <h1 className="font-bold text-base flex-1">{typeLabel[type]}</h1>
        <span className="text-xs font-bold text-[#C9A96E] border border-[#C9A96E] px-2.5 py-1 rounded-full">
          +{mission.points}P
        </span>
      </div>

      {type === "receipt" && <ReceiptMission points={mission.points} />}
      {type === "basket" && <QrMission points={mission.points} label="롯데백화점 장바구니" />}
      {type === "tumbler" && <QrMission points={mission.points} label="다회용기/텀블러" />}
      {type === "reals" && <RealsMission points={mission.points} />}
      {type === "daily" && <DailyMission points={mission.points} />}
    </div>
  );
}
