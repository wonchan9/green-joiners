"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CompleteModalProps {
  points: number;
  totalPoints: number;
  onClose: () => void;
}

export function CompleteModal({ points, totalPoints, onClose }: CompleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
        <div className="bg-[#1A1A1A] py-7 px-6 text-center">
          <p className="text-[10px] tracking-[0.2em] text-[#C9A96E] font-bold mb-3 uppercase">Mission Complete</p>
          <h2 className="text-xl font-black text-white">미션 완료!</h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-400 text-sm mb-5">포인트가 적립되었습니다</p>
          <div className="bg-[#FBF5E8] rounded-2xl py-5 px-4 mb-5">
            <p className="text-[10px] text-gray-400 mb-2 tracking-widest">획득 포인트</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-4xl font-black text-[#C9A96E] leading-none">+{points}</span>
              <span className="text-[#C9A96E] font-black text-2xl leading-none mb-0.5">P</span>
            </div>
            <p className="text-xs text-gray-400 mt-3">누적 포인트 {totalPoints.toLocaleString()}P</p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-[#E5002B] text-white font-bold py-4 rounded-2xl text-base active:opacity-90"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

function GuideBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FBF5E8] rounded-2xl overflow-hidden flex">
      <span className="w-1 bg-[#C9A96E] shrink-0" />
      <div className="px-4 py-4 text-sm text-gray-600">
        <p className="text-[10px] tracking-[0.15em] text-[#C9A96E] font-bold mb-1.5 uppercase">Guide</p>
        {children}
      </div>
    </div>
  );
}

async function participate(missionId: number, quantity = 1) {
  const res = await fetch("/api/participate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mission_id: missionId, quantity }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "참여 실패");
  }
  return res.json() as Promise<{ ok: boolean; earned_points: number; total_points: number }>;
}

function useMissionSubmit() {
  const [result, setResult] = useState<{ earned_points: number; total_points: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (missionId: number, quantity = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await participate(missionId, quantity);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, submit };
}

// 모바일 영수증 미션
export function ReceiptMission({ missionId, points }: { missionId: number; points: number }) {
  const { result, loading, error, submit } = useMissionSubmit();
  const router = useRouter();

  if (result) return (
    <CompleteModal points={result.earned_points} totalPoints={result.total_points} onClose={() => router.push("/mission")} />
  );

  return (
    <div className="px-4 py-6 flex flex-col gap-4">
      <GuideBox>
        <p>롯데백화점 앱에서 구매 후 모바일 영수증을 발급받으세요.<br />발급이 확인되면 자동으로 미션이 완료됩니다!</p>
      </GuideBox>
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8 text-[#E5002B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2z"/>
            <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="10" y1="9" x2="14" y2="9"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">모바일 영수증 발급</p>
        <p className="text-xs text-gray-400">발급 확인 시 자동 완료 · 1일 1회</p>
      </div>
      {error && <p className="text-xs text-[#E5002B] bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}
      <button onClick={() => submit(missionId)} disabled={loading} className="w-full bg-[#E5002B] text-white font-bold py-4 rounded-2xl text-base active:opacity-90 disabled:opacity-50">
        {loading ? "처리 중..." : "[MVP] 영수증 발급 완료 시뮬레이션"}
      </button>
    </div>
  );
}

// QR 미션
export function QrMission({ missionId, points, label }: { missionId: number; points: number; label: string }) {
  const { result, loading, error, submit } = useMissionSubmit();
  const router = useRouter();

  if (result) return (
    <CompleteModal points={result.earned_points} totalPoints={result.total_points} onClose={() => router.push("/mission")} />
  );

  return (
    <div className="px-4 py-6 flex flex-col gap-4">
      <GuideBox>
        <p>{label} 이용 후 비치된 QR코드를 촬영하세요.<br />QR 촬영 즉시 미션이 완료됩니다!</p>
      </GuideBox>
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 border border-gray-100">
        <div className="w-44 h-44 bg-[#F4F4F4] rounded-2xl flex flex-col items-center justify-center gap-2">
          <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="3" height="3"/><rect x="19" y="14" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/><rect x="18" y="18" width="3" height="3"/>
          </svg>
          <span className="text-xs text-gray-300">QR 스캔 영역</span>
        </div>
        <p className="text-xs text-gray-400">1일 1회 참여 가능</p>
      </div>
      {error && <p className="text-xs text-[#E5002B] bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}
      <button onClick={() => submit(missionId)} disabled={loading} className="w-full bg-[#E5002B] text-white font-bold py-4 rounded-2xl text-base active:opacity-90 disabled:opacity-50">
        {loading ? "처리 중..." : "[MVP] QR 촬영 완료 시뮬레이션"}
      </button>
    </div>
  );
}

// 리얼스 미션
export function RealsMission({ missionId, points }: { missionId: number; points: number }) {
  const [count, setCount] = useState(0);
  const { result, loading, error, submit } = useMissionSubmit();
  const router = useRouter();

  const handle = () => {
    if (count < 1) return;
    submit(missionId, count);
  };

  if (result) return (
    <CompleteModal points={result.earned_points} totalPoints={result.total_points} onClose={() => router.push("/mission")} />
  );

  return (
    <div className="px-4 py-6 flex flex-col gap-4">
      <GuideBox>
        <p>리얼스에서 친환경 제품을 판매하세요.<br />판매 확정 시 개수에 따라 포인트가 적립됩니다!</p>
      </GuideBox>
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <p className="text-xs text-gray-400 font-bold mb-4 text-center">판매 확정 제품 수 선택</p>
        <div className="flex items-center gap-6 justify-center mb-4">
          <button
            onClick={() => setCount(Math.max(0, count - 1))}
            className="w-12 h-12 rounded-full bg-gray-100 font-bold text-xl text-gray-500 active:opacity-70"
          >
            −
          </button>
          <span className="text-4xl font-black w-16 text-center tabular-nums">{count}</span>
          <button
            onClick={() => setCount(count + 1)}
            className="w-12 h-12 rounded-full border-2 border-[#C9A96E] text-[#C9A96E] font-bold text-xl active:opacity-70"
          >
            +
          </button>
        </div>
        <div className="bg-[#FBF5E8] rounded-xl py-2.5 text-center">
          <span className="text-[#C9A96E] font-black text-lg">+{points * count}P</span>
          <span className="text-[#C9A96E]/60 text-xs ml-1">예상 적립</span>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">참여 횟수 제한 없음</p>
      </div>
      {error && <p className="text-xs text-[#E5002B] bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}
      <button
        onClick={handle}
        disabled={count < 1 || loading}
        className={`w-full font-bold py-4 rounded-2xl text-base active:opacity-90 ${
          count > 0 && !loading ? "bg-[#E5002B] text-white" : "bg-gray-100 text-gray-300"
        }`}
      >
        {loading ? "처리 중..." : "리얼스 참여 확인하기"}
      </button>
    </div>
  );
}

// 데일리 미션
export function DailyMission({ missionId, points }: { missionId: number; points: number }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const { result, loading, error, submit } = useMissionSubmit();
  const router = useRouter();

  const handle = () => {
    if (!photo) return;
    submit(missionId);
  };

  if (result) return (
    <CompleteModal points={result.earned_points} totalPoints={result.total_points} onClose={() => router.push("/mission")} />
  );

  return (
    <div className="px-4 py-6 flex flex-col gap-4">
      <GuideBox>
        <p>오늘의 친환경 활동 사진을 업로드하고 참여하기를 눌러주세요!</p>
      </GuideBox>
      <div
        onClick={() => setPhoto("uploaded")}
        className={`bg-white rounded-2xl flex flex-col items-center justify-center py-10 gap-4 cursor-pointer border-2 border-dashed transition-colors ${
          photo ? "border-[#C9A96E]" : "border-gray-200"
        }`}
      >
        {photo ? (
          <>
            <div className="w-16 h-16 bg-[#FBF5E8] rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-[#C9A96E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#C9A96E]">사진 등록 완료</p>
              <p className="text-xs text-gray-400 mt-0.5">참여하기 버튼을 눌러주세요</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500">사진 업로드</p>
              <p className="text-xs text-gray-400 mt-0.5">1일 1회 참여 가능</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-[#E5002B] bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}
      <button
        onClick={handle}
        disabled={!photo || loading}
        className={`w-full font-bold py-4 rounded-2xl text-base active:opacity-90 ${
          photo && !loading ? "bg-[#E5002B] text-white" : "bg-gray-100 text-gray-300"
        }`}
      >
        {loading ? "처리 중..." : "참여하기"}
      </button>
    </div>
  );
}
