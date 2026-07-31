"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, MissionIcon, PersonIcon } from "./Icons";

const tabs = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/mission", label: "미션", Icon: MissionIcon },
  { href: "/mypage", label: "MY", Icon: PersonIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#E8E8E8] flex z-50">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center pt-2.5 pb-3 gap-1 text-xs relative transition-colors ${
              active ? "text-[#C9A96E] font-bold" : "text-gray-400"
            }`}
          >
            {active && <span className="absolute top-0 inset-x-0 h-0.5 bg-[#C9A96E]" />}
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
