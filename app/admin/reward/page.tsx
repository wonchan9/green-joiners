"use client";
import { useState } from "react";
import AdminNav from "../AdminNav";
import { MOCK_REWARDS, MOCK_REWARD_REQUESTS } from "@/mock/data";

export default function AdminRewardPage() {
  const [requests, setRequests] = useState(MOCK_REWARD_REQUESTS);
  const [rewards, setRewards] = useState(MOCK_REWARDS);
  const [tab, setTab] = useState<"requests" | "manage">("requests");
  const [showAdd, setShowAdd] = useState(false);
  const [newReward, setNewReward] = useState({ title: "", required_points: 0 });

  const complete = (id: number) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "completed" } : r)));
  };

  const addReward = () => {
    if (!newReward.title || !newReward.required_points) return;
    setRewards([...rewards, { id: Date.now(), ...newReward, stock: 99, image_emoji: "" }]);
    setNewReward({ title: "", required_points: 0 });
    setShowAdd(false);
  };

  const tabs = [
    { key: "requests" as const, label: "교환 신청 관리" },
    { key: "manage" as const, label: "리워드 종류 관리" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      <AdminNav current="/admin/reward" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black">리워드 관리</h1>
            <p className="text-sm text-gray-400 mt-0.5">교환 신청과 리워드 종류를 관리하세요</p>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mb-5">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  tab === key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "requests" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {["회원", "리워드", "포인트", "상태", "액션"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium">{r.name}</td>
                      <td className="px-5 py-4 text-gray-600">{r.reward_title}</td>
                      <td className="px-5 py-4 font-bold text-[#C9A96E]">{r.used_points}P</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          r.status === "completed"
                            ? "bg-[#FBF5E8] text-[#C9A96E]"
                            : "bg-amber-50 text-amber-600"
                        }`}>
                          {r.status === "completed" ? "지급완료" : "대기"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {r.status === "pending" && (
                          <button
                            onClick={() => complete(r.id)}
                            className="text-xs bg-[#E5002B] text-white px-3 py-1.5 rounded-lg font-semibold"
                          >
                            지급완료
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "manage" && (
            <>
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => setShowAdd(true)}
                  className="text-sm bg-[#E5002B] text-white px-4 py-2 rounded-xl font-bold"
                >
                  + 리워드 추가
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-100">
                    <tr>
                      {["리워드명", "필요 포인트", "잔여"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rewards.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-medium">{r.title}</td>
                        <td className="px-5 py-4 font-bold text-[#C9A96E]">{r.required_points}P</td>
                        <td className="px-5 py-4 text-gray-600">{r.stock}개</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-bold text-lg mb-5">리워드 추가</h2>
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">리워드 이름</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                placeholder="리워드 이름 입력"
                value={newReward.title}
                onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">교환 필요 포인트</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                placeholder="포인트 입력"
                value={newReward.required_points || ""}
                onChange={(e) => setNewReward({ ...newReward, required_points: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm font-semibold">취소</button>
              <button onClick={addReward} className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white text-sm font-bold">등록하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
