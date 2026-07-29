"use client";
import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/Icons";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border border-gray-100 text-sm text-gray-400 font-semibold shadow-sm"
    >
      <LogoutIcon className="w-4 h-4" />
      로그아웃
    </button>
  );
}
