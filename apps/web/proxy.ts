import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { handleTokenRefresh } from "./core/services/client";

// 🎯 List only your UNPROTECTED public entry points (from the (auth) group)
const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!accessToken && !refreshToken && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (refreshToken && !accessToken && isPublicRoute) {
    console.log(`[Middleware] Access token missing. Attempting silent token rotation for: ${pathname}`);
    const refreshSuccess = await handleTokenRefresh()

    if(refreshSuccess){
      console.log(`[Middleware] Token rotation successful. Request moving forward.`);
      return refreshSuccess
    }

    console.warn(`[Middleware] Silent refresh failed. Bouncing user back to login.`);
    const loginUrl = new URL("/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};