"use client";
import { useState, useEffect } from "react";
import AdminNav from "../AdminNav";

interface Mission { id: number; type: string; title: string; description: string; points: number; daily_limit: number; active: number; }

export default function AdminMissionPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPoints, setEditPoints] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newMission, setNewMission] = useState({ title: "", description: "", points: 50, daily_limit: 1 });

  const load = () =>
    fetch("/api/missions").then((r) => r.json()).then((data) => setMissions(data));

  useEffect(() => { load(); }, []);

  const savePoints = async () => {
    await fetch("/api/missions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, points: editPoints }),
    });
    setMissions(missions.map((m) => (m.id === editId ? { ...m, points: editPoints } : m)));
    setEditId(null);
  };

  const toggleActive = async (m: Mission) => {
    const newActive = m.active ? 0 : 1;
    await fetch("/api/missions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, active: newActive }),
    });
    setMissions(missions.map((x) => (x.id === m.id ? { ...x, active: newActive } : x)));
  };

  const addMission = async () => {
    if (!newMission.title || !newMission.points) return;
    await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "daily", ...newMission }),
    });
    setNewMission({ title: "", description: "", points: 50, daily_limit: 1 });
    setShowAdd(false);
    load();
  };

  const typeLabel: Record<string, string> = {
    receipt: "영수증", basket: "장바구니", tumbler: "텀블러", reals: "리얼스", daily: "데일리",
  };

  // 어드민에서는 전체 미션(비활성 포함) 표시
  const [showAll, setShowAll] = useState(true);
  const displayed = showAll ? missions : missions.filter((m) => m.active);

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      <AdminNav current="/admin/mission" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black">미션 관리</h1>
              <p className="text-sm text-gray-400 mt-0.5">미션 ON/OFF 및 포인트를 설정하세요</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-semibold"
              >
                {showAll ? "활성만 보기" : "전체 보기"}
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="text-sm bg-[#E5002B] text-white px-4 py-2 rounded-xl font-bold"
              >
                + 데일리 미션 추가
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">미션명</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">유형</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">지급 포인트</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ON/OFF</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((m) => (
                  <tr key={m.id} className={`hover:bg-gray-50 transition-colors ${!m.active ? "opacity-40" : ""}`}>
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
                        onClick={() => toggleActive(m)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          m.active ? "bg-[#E5002B]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            m.active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
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
            {displayed.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-16">미션 데이터를 불러오는 중...</p>
            )}
          </div>
        </div>
      </main>

      {/* 포인트 수정 모달 */}
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

      {/* 데일리 미션 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-bold text-lg mb-5">데일리 미션 추가</h2>
            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">미션 제목</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                  placeholder="예: 텀블러 사용 인증"
                  value={newMission.title}
                  onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">미션 설명</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                  placeholder="미션 참여 방법을 입력하세요"
                  value={newMission.description}
                  onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">지급 포인트</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                    value={newMission.points}
                    onChange={(e) => setNewMission({ ...newMission, points: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">1일 한도</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                    value={newMission.daily_limit}
                    onChange={(e) => setNewMission({ ...newMission, daily_limit: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm font-semibold">취소</button>
              <button
                onClick={addMission}
                disabled={!newMission.title || !newMission.points}
                className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white text-sm font-bold disabled:opacity-40"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
