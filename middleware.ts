import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 어드민, API, 정적 파일 제외
  if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return response;
  }

  // member_key 없으면 자동 생성
  if (!request.cookies.get("member_key")) {
    const key = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    response.cookies.set("member_key", key, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
