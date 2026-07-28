"use client";
import { useState, useEffect } from "react";
import AdminNav from "../AdminNav";

interface Participation {
  id: number; member_key: string; name: string;
  mission_title: string; mission_type: string;
  earned_points: number; status: string; created_at: string;
}

export default function AdminParticipationPage() {
  const [items, setItems] = useState<Participation[]>([]);
  const [detail, setDetail] = useState<Participation | null>(null);

  const load = () => fetch("/api/participate").then((r) => r.json()).then(setItems);

  useEffect(() => { load(); }, []);

  const reject = async (id: number) => {
    await fetch("/api/participate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDetail(null);
    load();
  };

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      <AdminNav current="/admin/participation" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black">참여 관리</h1>
            <p className="text-sm text-gray-400 mt-0.5">미션 참여 내역을 확인하고 관리하세요</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">전체 참여</p>
              <p className="text-2xl font-black">{items.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">완료</p>
              <p className="text-2xl font-black text-[#C9A96E]">{items.filter(i => i.status === "completed").length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">반려</p>
              <p className="text-2xl font-black text-[#E5002B]">{items.filter(i => i.status === "rejected").length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">회원</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">미션</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">포인트</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">상태</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((p) => (
                  <tr key={p.id} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setDetail(p)}>
                    <td className="px-5 py-4 font-medium">{p.name}</td>
                    <td className="px-5 py-4 text-gray-600">{p.mission_title}</td>
                    <td className="px-5 py-4 font-bold text-[#C9A96E]">+{p.earned_points}P</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        p.status === "completed"
                          ? "bg-[#FBF5E8] text-[#C9A96E]"
                          : "bg-red-50 text-[#E5002B]"
                      }`}>
                        {p.status === "completed" ? "완료" : "반려"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{p.created_at.slice(0, 16)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-16">참여 내역이 없습니다.</p>
            )}
          </div>
        </div>
      </main>

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-bold text-lg mb-5">참여 상세</h2>
            <div className="flex flex-col gap-3 text-sm mb-6">
              {[
                { label: "회원", value: detail.name },
                { label: "미션", value: detail.mission_title },
                { label: "포인트", value: `+${detail.earned_points}P`, gold: true },
                { label: "일시", value: detail.created_at.slice(0, 16) },
              ].map(({ label, value, gold }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className={`font-medium ${gold ? "text-[#C9A96E] font-bold" : ""}`}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">상태</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  detail.status === "completed" ? "bg-[#FBF5E8] text-[#C9A96E]" : "bg-red-50 text-[#E5002B]"
                }`}>
                  {detail.status === "completed" ? "완료" : "반려"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDetail(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm font-semibold">닫기</button>
              {detail.status === "completed" && (
                <button onClick={() => reject(detail.id)} className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white text-sm font-bold">
                  반려 / 포인트 회수
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
