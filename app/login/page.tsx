"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

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
    <div className="min-h-screen" style={{ background: "#1A1A1A" }}>
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      {/* 상단 패턴 영역 */}
      <div
        className="h-52 flex-shrink-0 flex items-end px-6 pb-6 relative"
        style={{
          background: "repeating-linear-gradient(135deg,#2b2b2b,#2b2b2b 12px,#232323 12px,#232323 24px)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(0deg,#1A1A1A 10%,rgba(26,26,26,0) 70%)" }}
        />
        <div className="relative z-10">
          <h1 className="font-display text-white text-[28px] font-bold leading-tight">
            쇼핑하고<br />지구도 지키는 습관
          </h1>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="flex-1 px-6 pt-8 pb-10 flex flex-col gap-4 w-full">
        {/* 로고 */}
        <div className="flex items-center gap-3 mb-2">
          <Logo size="md" />
          <span className="text-white font-black text-base">그린 조이너스</span>
        </div>

        <div>
          <p className="text-white/50 text-xs font-semibold mb-2">이름</p>
          <input
            className="w-full rounded-xl px-4 py-4 text-white text-base font-bold outline-none placeholder:text-white/25 placeholder:font-normal"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,169,110,0.4)",
            }}
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
        </div>

        <div>
          <p className="text-white/50 text-xs font-semibold mb-2">회원번호</p>
          <input
            className="w-full rounded-xl px-4 py-4 text-white text-base font-bold outline-none placeholder:text-white/25 placeholder:font-normal"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,169,110,0.4)",
            }}
            placeholder="회원번호를 입력하세요"
            value={membershipNo}
            onChange={(e) => setMembershipNo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            inputMode="numeric"
          />
        </div>

        {error && (
          <p className="text-xs text-[#C9A96E] bg-white/5 border border-[#C9A96E]/30 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="w-full text-[#1A1A1A] font-black py-4 rounded-[30px] text-base mt-2 disabled:opacity-50 active:opacity-80"
          style={{ background: "#B8935A" }}
        >
          {loading ? "확인 중..." : "로그인"}
        </button>

        <p className="text-xs text-white/30 text-center mt-2">
          회원번호를 잊으셨나요?
        </p>
      </div>
    </div>
    </div>
  );
}
