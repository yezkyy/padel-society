import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  const isAdminRoute = pathname.startsWith("/admin");
  const isMemberRoute = pathname.startsWith("/member");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  if (isAdminRoute || isMemberRoute || isAuthRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      if (isAdminRoute || isMemberRoute) {
        url.pathname = "/login";
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
    } else {
      if (isAuthRoute) {
        const role = session.user.role;
        if (role === "ADMIN" || role === "OPERATOR") {
          url.pathname = "/admin/dashboard";
        } else {
          url.pathname = "/member/dashboard";
        }
        return NextResponse.redirect(url);
      }

      if (isAdminRoute) {
        const role = session.user.role;
        if (role !== "ADMIN" && role !== "OPERATOR") {
          url.pathname = "/403";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/member/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
