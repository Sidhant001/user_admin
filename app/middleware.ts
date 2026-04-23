import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookieValue = request.cookies.get("user")?.value;

  let user = null;

  if (cookieValue) {
    try {
      user = JSON.parse(decodeURIComponent(cookieValue));
    } catch {
      user = null;
    }
  }

  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname.startsWith("/user/dashboard")) {
    if (!user) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!user && pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    if (pathname.startsWith("/admin") && user.role !== "admin") {
      url.pathname = "/user/dashboard";
      return NextResponse.redirect(url);
    }

    if (pathname === "/login") {
      url.pathname =
        user.role === "admin" ? "/admin/user" : "/user/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}