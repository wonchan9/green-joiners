import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { MOCK_USER, MOCK_POINT_HISTORY } from "@/mock/data";

export default function HistoryPage() {
  return (
    <div className="pb-24 max-w-md mx-auto bg-white">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-40">
        <Link href="/mypage" className="text-gray-400 text-xl leading-none">←</Link>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.15em] text-gray-400 font-bold uppercase leading-none">History</p>
          <h1 className="font-bold text-base leading-snug">포인트 내역</h1>
        </div>
        <span className="text-xs font-bold text-[#C9A96E] border border-[#C9A96E] px-2.5 py-1 rounded-full">
          {MOCK_USER.points.toLocaleString()}P
        </span>
      </div>

      <div className="bg-white">
        {MOCK_POINT_HISTORY.map((h, i) => (
          <div
            key={h.id}
            className={`flex items-center gap-3 px-4 py-4 ${i !== 0 ? "border-t border-gray-50" : ""}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${h.type === "earn" ? "bg-[#C9A96E]" : "bg-gray-200"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{h.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{h.created_at}</p>
            </div>
            <span className={`font-bold text-sm shrink-0 ml-2 ${h.type === "earn" ? "text-[#C9A96E]" : "text-gray-400"}`}>
              {h.type === "earn" ? "+" : "−"}{h.amount}P
            </span>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
