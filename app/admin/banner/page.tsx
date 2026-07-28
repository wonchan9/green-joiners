"use client";
import { useState } from "react";
import AdminNav from "../AdminNav";
import { MOCK_BANNERS } from "@/mock/data";

export default function AdminBannerPage() {
  const [banners, setBanners] = useState(
    MOCK_BANNERS.map((b) => ({ ...b, visible: true }))
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const add = () => {
    if (!newTitle) return;
    setBanners([...banners, { id: Date.now(), title: newTitle, subtitle: "", bg: "bg-[#1A1A1A]", visible: true }]);
    setNewTitle("");
    setShowAdd(false);
  };

  const remove = () => {
    setBanners(banners.filter((b) => !selected.includes(b.id)));
    setSelected([]);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      <AdminNav current="/admin/banner" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black">배너 관리</h1>
              <p className="text-sm text-gray-400 mt-0.5">캠페인 배너를 등록하고 관리하세요</p>
            </div>
            <div className="flex gap-2">
              {selected.length > 0 && (
                <button
                  onClick={remove}
                  className="text-sm text-[#E5002B] border border-[#E5002B]/30 bg-white px-4 py-2 rounded-xl font-semibold"
                >
                  삭제 ({selected.length})
                </button>
              )}
              <button
                onClick={() => setShowAdd(true)}
                className="text-sm bg-[#E5002B] text-white px-4 py-2 rounded-xl font-bold"
              >
                + 등록하기
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 text-left w-10">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelected(e.target.checked ? banners.map((b) => b.id) : [])
                      }
                      checked={selected.length === banners.length && banners.length > 0}
                    />
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">배너 제목</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {banners.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(b.id)}
                        onChange={(e) =>
                          setSelected(e.target.checked ? [...selected, b.id] : selected.filter((id) => id !== b.id))
                        }
                      />
                    </td>
                    <td className="px-5 py-4 font-medium">{b.title}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-[#FBF5E8] text-[#C9A96E] px-2.5 py-1 rounded-full font-semibold">
                        노출 중
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {banners.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-16">등록된 배너가 없습니다.</p>
            )}
          </div>
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-bold text-lg mb-5">배너 등록</h2>
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">배너 제목</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                placeholder="배너 제목 입력"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400 mb-5">
              이미지 업로드 (MVP: 생략)
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm font-semibold">취소</button>
              <button onClick={add} className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white text-sm font-bold">등록하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
