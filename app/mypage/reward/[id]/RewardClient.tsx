"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Reward {
  id: number;
  title: string;
  required_points: number;
}

export default function RewardClient({ reward, canExchange }: { reward: Reward; canExchange: boolean }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
        <div className="bg-white rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl text-center">
          <div className="bg-[#1A1A1A] py-6 px-6">
            <p className="text-[10px] tracking-[0.2em] text-[#C9A96E] font-bold uppercase mb-2">Exchange Complete</p>
            <h2 className="text-xl font-black text-white">교환 신청 완료</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm mb-1">{reward.title}</p>
            <p className="text-xs text-gray-400 mb-6">지급까지 영업일 기준 3~5일 소요됩니다.</p>
            <button
              onClick={() => router.push("/mypage")}
              className="w-full bg-[#E5002B] text-white font-bold py-3.5 rounded-2xl active:opacity-90"
            >
              마이페이지로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => canExchange && setShowConfirm(true)}
        className={`w-full font-bold py-4 rounded-2xl text-base mt-2 active:opacity-90 ${
          canExchange ? "bg-[#E5002B] text-white" : "bg-gray-100 text-gray-300"
        }`}
      >
        {canExchange ? "교환하기" : reward.required_points > 750 ? "포인트 부족" : "품절"}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-lg font-black mb-2">교환하시겠어요?</h2>
            <p className="text-sm text-gray-500 mb-1">{reward.title}</p>
            <p className="text-[#C9A96E] font-bold mb-6">{reward.required_points.toLocaleString()}P 차감</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-600">취소</button>
              <button
                onClick={() => { setShowConfirm(false); setDone(true); }}
                className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white font-bold"
              >
                교환
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
