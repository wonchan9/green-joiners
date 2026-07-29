"use client";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: id, password: pw }),
      });
      if (!res.ok) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        router.push("/admin/banner");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 왼쪽 브랜딩 패널 */}
      <div className="hidden lg:flex flex-1 bg-[#1A1A1A] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 w-fit">
            <Logo size="xl" />
          </div>
          <h1 className="text-white font-black text-2xl mb-1">그린 조이너스</h1>
          <p className="text-white/30 text-sm">Admin Dashboard</p>
          <div className="mt-10 border-t border-white/10 pt-8">
            <p className="text-[10px] tracking-[0.2em] text-[#C9A96E] font-bold uppercase">Green Joiners × LOTTE</p>
            <p className="text-white/20 text-xs mt-1">친환경 캠페인 관리 시스템</p>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="w-full lg:w-[420px] bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Logo size="md" />
            <span className="font-black text-[#1A1A1A]">그린 조이너스</span>
          </div>

          <h2 className="text-2xl font-black mb-1">관리자 로그인</h2>
          <p className="text-sm text-gray-400 mb-8">캠페인 관리 시스템에 로그인하세요</p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">아이디</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B] transition-colors"
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">비밀번호</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B] transition-colors"
                placeholder="비밀번호를 입력하세요"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            {error && (
              <p className="text-xs text-[#E5002B] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-[#E5002B] text-white font-bold py-3.5 rounded-xl mt-2 active:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
            <p className="text-xs text-gray-400 text-center">테스트 계정: admin / admin1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
