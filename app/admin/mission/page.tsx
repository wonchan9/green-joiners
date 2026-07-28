"use client";
import { useState } from "react";
import AdminNav from "../AdminNav";
import { MOCK_MISSIONS } from "@/mock/data";

export default function AdminMissionPage() {
  const [missions, setMissions] = useState(MOCK_MISSIONS);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPoints, setEditPoints] = useState(0);

  const savePoints = () => {
    setMissions(missions.map((m) => (m.id === editId ? { ...m, points: editPoints } : m)));
    setEditId(null);
  };

  const typeLabel: Record<string, string> = {
    receipt: "영수증", basket: "장바구니", tumbler: "텀블러", reals: "리얼스", daily: "데일리",
  };

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      <AdminNav current="/admin/mission" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black">미션 관리</h1>
            <p className="text-sm text-gray-400 mt-0.5">미션별 지급 포인트를 설정하세요</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">미션명</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">유형</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">지급 포인트</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {missions.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium">{m.title}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-lg font-medium">
                        {typeLabel[m.type] ?? m.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#C9A96E]">{m.points}P</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setEditId(m.id); setEditPoints(m.points); }}
                        className="text-xs text-[#1A1A1A] border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:border-[#E5002B] hover:text-[#E5002B] transition-colors font-semibold"
                      >
                        포인트 수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {editId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-bold text-lg mb-1">포인트 수정</h2>
            <p className="text-sm text-gray-400 mb-5">{missions.find(m => m.id === editId)?.title}</p>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">지급 포인트</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                value={editPoints}
                onChange={(e) => setEditPoints(Number(e.target.value))}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditId(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm font-semibold">취소</button>
              <button onClick={savePoints} className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white text-sm font-bold">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
