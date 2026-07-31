import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "그린 조이너스",
  description: "그린 조이너스 친환경 캠페인",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#F6F4EF] min-h-screen">{children}</body>
    </html>
  );
}
