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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleExchange = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reward_id: reward.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "교환 실패");
      }
      setShowConfirm(false);
      setDone(true);
    } catch (e: unknown) {
      setShowConfirm(false);
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

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
      {error && <p className="text-xs text-[#E5002B] bg-red-50 px-3 py-2 rounded-lg text-center w-full">{error}</p>}
      <button
        onClick={() => canExchange && setShowConfirm(true)}
        className={`w-full font-bold py-4 rounded-2xl text-base mt-2 active:opacity-90 ${
          canExchange ? "bg-[#E5002B] text-white" : "bg-gray-100 text-gray-300"
        }`}
      >
        {canExchange ? "교환하기" : reward.required_points > 0 ? "포인트 부족" : "품절"}
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
                onClick={handleExchange}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white font-bold disabled:opacity-50"
              >
                {loading ? "처리 중..." : "교환"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
