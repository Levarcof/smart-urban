import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  let role = null;

  // 🔐 Verify Token
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      role = payload.role;
    } catch (error) {
      console.log("Invalid token");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ❌ If NOT logged in
  if (!token) {
    if (
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ✅ If logged in as DEPARTMENT
  if (role === "department") {
    // Always redirect department to /department if trying to access home/login/signup
    if (
      pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/department", req.url));
    }
  }

  // ✅ If logged in as NORMAL USER
  if (role === "user") {
    // Block department route
    if (pathname.startsWith("/department")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Prevent login/signup access
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/department/:path*",
  ],
};