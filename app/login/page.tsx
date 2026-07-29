"use client";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [membershipNo, setMembershipNo] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!membershipNo.trim() || !name.trim()) {
      setError("멤버십 번호와 이름을 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membership_no: membershipNo.trim(), name: name.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "오류가 발생했습니다.");
        return;
      }
      router.push("/");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 w-fit">
            <Logo size="lg" />
          </div>
          <p className="text-[10px] tracking-[0.25em] text-[#E5002B] font-bold uppercase mb-1">Green Joiners</p>
          <h1 className="font-black text-2xl text-[#1A1A1A]">그린 조이너스</h1>
          <p className="text-sm text-gray-400 mt-1">롯데백화점 친환경 캠페인</p>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">롯데 멤버십 번호</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B] transition-colors tracking-widest font-mono placeholder:font-sans placeholder:tracking-normal"
              placeholder="멤버십 번호 입력"
              value={membershipNo}
              onChange={(e) => setMembershipNo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이름</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B] transition-colors"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
          {error && (
            <p className="text-xs text-[#E5002B] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-[#E5002B] text-white font-bold py-4 rounded-2xl text-base mt-1 active:opacity-90 disabled:opacity-50"
          >
            {loading ? "확인 중..." : "참여하기"}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
          롯데백화점 L.POINT 멤버십 번호로 참여하세요.<br />
          캠페인 종료 후 포인트는 자동 소멸됩니다.
        </p>
      </div>
    </div>
  );
}
