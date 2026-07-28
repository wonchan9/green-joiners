"use client";
import { useState } from "react";
import AdminNav from "../AdminNav";
import { MOCK_MEMBERS } from "@/mock/data";

export default function AdminMemberPage() {
  const [members] = useState(MOCK_MEMBERS);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<typeof MOCK_MEMBERS[0] | null>(null);

  const filtered = members.filter(
    (m) => m.name.includes(search) || m.member_key.includes(search)
  );

  const totalPoints = members.reduce((s, m) => s + m.points, 0);

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      <AdminNav current="/admin/member" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black">회원 관리</h1>
            <p className="text-sm text-gray-400 mt-0.5">캠페인 참여 회원을 조회하세요</p>
          </div>

          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">전체 회원</p>
              <p className="text-2xl font-black">{members.length}<span className="text-sm font-normal text-gray-400 ml-1">명</span></p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">총 발행 포인트</p>
              <p className="text-2xl font-black text-[#C9A96E]">{totalPoints.toLocaleString()}<span className="text-sm font-bold ml-1">P</span></p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">평균 보유 포인트</p>
              <p className="text-2xl font-black">{Math.round(totalPoints / members.length).toLocaleString()}<span className="text-sm font-bold text-gray-400 ml-1">P</span></p>
            </div>
          </div>

          {/* 검색 */}
          <div className="relative mb-4">
            <input
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B] pr-10 shadow-sm"
              placeholder="이름 또는 회원번호로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">⌕</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {["회원번호", "이름", "보유 포인트", "가입일"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((m) => (
                  <tr key={m.id} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setDetail(m)}>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs">{m.member_key}</td>
                    <td className="px-5 py-4 font-semibold">{m.name}</td>
                    <td className="px-5 py-4 font-bold text-[#C9A96E]">{m.points.toLocaleString()}P</td>
                    <td className="px-5 py-4 text-gray-400">{m.joined_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-16">검색 결과가 없습니다.</p>
            )}
          </div>
        </div>
      </main>

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#F4F4F4] rounded-full flex items-center justify-center font-bold text-gray-500">
                {detail.name[0]}
              </div>
              <div>
                <h2 className="font-bold text-base">{detail.name}</h2>
                <p className="text-xs text-gray-400 font-mono">{detail.member_key}</p>
              </div>
            </div>
            <div className="bg-[#FBF5E8] rounded-xl p-4 mb-5 text-center">
              <p className="text-xs text-gray-400 mb-1">보유 포인트</p>
              <p className="text-2xl font-black text-[#C9A96E]">{detail.points.toLocaleString()}P</p>
            </div>
            <div className="text-sm text-gray-500 mb-5 flex justify-between">
              <span>가입일</span>
              <span className="font-medium text-gray-700">{detail.joined_at}</span>
            </div>
            <button onClick={() => setDetail(null)} className="w-full py-3 rounded-xl bg-gray-100 text-sm font-semibold">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
