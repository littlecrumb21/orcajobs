import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string })?.role;

  // Redirect logged-in users away from auth pages
  if ((pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup")) && isLoggedIn) {
    if (role === "EMPLOYER") return NextResponse.redirect(new URL("/employer/dashboard", req.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.redirect(new URL("/applicant/dashboard", req.url));
  }

  // Protect authenticated sections
  if (pathname.startsWith("/applicant") && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/auth/login?next=${pathname}`, req.url));
  }
  if (pathname.startsWith("/employer") && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/auth/login?next=${pathname}`, req.url));
  }
  if (pathname.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Admin-only
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Role enforcement
  if (pathname.startsWith("/applicant") && role === "EMPLOYER") {
    return NextResponse.redirect(new URL("/employer/dashboard", req.url));
  }
  if (pathname.startsWith("/employer") && role === "APPLICANT") {
    return NextResponse.redirect(new URL("/applicant/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/auth/:path*", "/applicant/:path*", "/employer/:path*", "/admin/:path*"],
};
