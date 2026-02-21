import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;

  // if user NOT logged in & trying to access home
  if (!token && !url.startsWith("/login") && !url.startsWith("/signup")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // if user logged in & trying to access login/signup
  if (token && (url.startsWith("/login") || url.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
