import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const extractCookieValue = (raw: string, name: string) => {
  const match = raw.match(new RegExp(`${name}=([^;]+)`));
  return match?.[1];
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refresh-token");
  const hasAccessToken = request.cookies.has("access-token");

  if ((pathname === "/login" || pathname === "/register") && hasRefreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/profile") && !hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasRefreshToken && !hasAccessToken) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Cookie: `refresh-token=${request.cookies.get("refresh-token")?.value}`,
        },
      });

      if (res.ok) {
        const response = NextResponse.next();
        const rawCookie = res.headers.get("set-cookie") ?? "";
        const accessToken = extractCookieValue(rawCookie, "access-token");

        if (accessToken) {
          response.cookies.set("access-token", accessToken, {
            httpOnly: true,
            path: "/",
            expires: new Date(Date.now() + 10 * 60 * 1000),
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }

        return response;
      }
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
