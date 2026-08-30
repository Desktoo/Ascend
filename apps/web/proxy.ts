import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🎯 Unprotected public entry points
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isHomePage = pathname === "/";
  const isPublicRoute = isAuthRoute || isHomePage;

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Unauthenticated user attempting to access protected route (dashboard, habits, etc.)
  if (!accessToken && !refreshToken && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Logged-in user trying to visit /login, /signup, etc. -> redirect to dashboard
  if ((accessToken || refreshToken) && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};