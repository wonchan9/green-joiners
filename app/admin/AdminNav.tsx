import Link from "next/link";

const menus = [
  { href: "/admin/banner",        label: "배너 관리"  },
  { href: "/admin/mission",       label: "미션 관리"  },
  { href: "/admin/participation", label: "참여 관리"  },
  { href: "/admin/reward",        label: "리워드 관리" },
  { href: "/admin/member",        label: "회원 관리"  },
];

export default function AdminNav({ current }: { current: string }) {
  return (
    <aside className="w-56 shrink-0 bg-[#1A1A1A] min-h-screen flex flex-col">
      {/* 로고 */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E5002B] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-black">G</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">그린 조이너스</p>
            <p className="text-white/30 text-[10px] tracking-wide">Admin</p>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 py-4 px-3">
        <p className="text-white/25 text-[10px] tracking-[0.2em] px-3 mb-3 uppercase">Menu</p>
        {menus.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${
              current === m.href
                ? "bg-[#E5002B] text-white"
                : "text-white/50 hover:text-white hover:bg-white/8"
            }`}
          >
            {m.label}
          </Link>
        ))}
      </nav>

      {/* 하단 */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/admin"
          className="flex items-center px-3 py-2.5 text-white/30 hover:text-white/60 text-sm rounded-xl transition-colors"
        >
          로그아웃
        </Link>
      </div>
    </aside>
  );
}
