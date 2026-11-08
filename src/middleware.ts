import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "./lib/admin/session";
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (["/api/admin/login", "/api/admin/verify", "/api/admin/session", "/api/admin/logout"].includes(path)) return NextResponse.next();
  if (await verifyToken(request.cookies.get(COOKIE_NAME)?.value)) return NextResponse.next();
  return path.startsWith("/api/") ? NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 }) : NextResponse.redirect(new URL("/blog", request.url));
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
