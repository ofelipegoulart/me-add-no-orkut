import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/account") &&
    pathname !== "/account/modifyPassword" &&
    pathname !== "/account/deleteAccount";
  const isSignUp = pathname === "/SignUp";
  const isApiRoute = pathname.startsWith("/api");

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (!token && !isAuthPage && !isSignUp) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (token && !token.onboarded && !isSignUp) {
    return NextResponse.redirect(new URL("/SignUp", request.url));
  }

  if (token && token.onboarded && (isAuthPage || isSignUp)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|logos|images).*)"],
};
