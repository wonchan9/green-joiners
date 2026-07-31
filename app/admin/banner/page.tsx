"use client";
import { useState, useEffect, useRef } from "react";
import AdminNav from "../AdminNav";
import Modal from "@/components/Modal";
import Image from "next/image";

interface Banner { id: number; image_url: string; link_url: string; visible: number; }

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => fetch("/api/banners").then((r) => r.json()).then(setBanners);

  useEffect(() => { load(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      // Vercel Blob 업로드
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/banners/upload", { method: "PUT", body: form });
      if (!uploadRes.ok) throw new Error("업로드 실패");
      const { url } = await uploadRes.json();

      // 배너 DB 등록
      await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url, link_url: linkUrl }),
      });
      setFile(null);
      setPreview("");
      setLinkUrl("");
      setShowAdd(false);
      load();
    } catch {
      alert("업로드에 실패했습니다. Vercel Blob 토큰을 확인하세요.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    await Promise.all(
      selected.map((id) =>
        fetch("/api/banners", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
      )
    );
    load();
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
              <p className="text-sm text-gray-400 mt-0.5">캠페인 배너 이미지를 등록하고 관리하세요</p>
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
                + 이미지 등록
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
                      onChange={(e) => setSelected(e.target.checked ? banners.map((b) => b.id) : [])}
                      checked={selected.length === banners.length && banners.length > 0}
                    />
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">미리보기</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">이미지 URL</th>
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
                    <td className="px-5 py-4">
                      {b.image_url && b.image_url.startsWith("http") ? (
                        <div className="w-16 h-10 relative rounded overflow-hidden bg-gray-100">
                          <Image src={b.image_url} alt="banner" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-300">없음</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-xs text-gray-600 max-w-xs truncate">{b.image_url}</td>
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
        <Modal>
            <h2 className="font-bold text-lg mb-5">배너 이미지 등록</h2>

            {/* 이미지 선택 영역 */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer mb-4 transition-colors ${
                preview ? "border-[#C9A96E]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {preview ? (
                <div className="relative w-full h-32">
                  <Image src={preview} alt="preview" fill className="object-contain rounded" />
                </div>
              ) : (
                <div className="text-gray-400">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold">이미지 클릭하여 선택</p>
                  <p className="text-xs mt-0.5">JPG, PNG, GIF 지원</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">링크 URL (선택)</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E5002B]"
                placeholder="클릭 시 이동할 URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setShowAdd(false); setFile(null); setPreview(""); }}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-sm font-semibold"
              >
                취소
              </button>
              <button
                onClick={upload}
                disabled={!file || uploading}
                className="flex-1 py-3 rounded-xl bg-[#E5002B] text-white text-sm font-bold disabled:opacity-40"
              >
                {uploading ? "업로드 중..." : "등록하기"}
              </button>
            </div>
        </Modal>
      )}
    </div>
  );
}
