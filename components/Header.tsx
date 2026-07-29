import Link from "next/link";
import Logo from "./Logo";

interface HeaderProps {
  points?: number;
}

export default function Header({ points }: HeaderProps) {
  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2">
        <Logo size="sm" />
        <span className="font-black text-[#1A1A1A] text-sm tracking-tight">그린 조이너스</span>
      </Link>
      {points !== undefined && (
        <Link
          href="/mypage"
          className="text-xs font-bold text-[#C9A96E] border border-[#C9A96E] px-3 py-1 rounded-full tracking-wide"
        >
          {points.toLocaleString()}P
        </Link>
      )}
    </header>
  );
}
