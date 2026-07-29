const sizeMap = { sm: 28, md: 32, lg: 56, xl: 64 };

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const px = sizeMap[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* 배경 */}
      <rect width="100" height="100" rx="22" fill="#1A1A1A" />
      {/* 잎 외형 — 위 뾰족, 아래 둥근 */}
      <path
        d="M50 14C50 14 78 26 78 52C78 68 65.5 86 50 86C34.5 86 22 68 22 52C22 26 50 14 50 14Z"
        fill="#C9A96E"
      />
      {/* 중앙 잎맥 */}
      <path
        d="M50 22 L50 80"
        stroke="#1A1A1A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 우측 잎맥 */}
      <path
        d="M50 43 C57 40 63 39 69 39"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* 좌측 잎맥 */}
      <path
        d="M50 57 C43 55 37 55 31 56"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
