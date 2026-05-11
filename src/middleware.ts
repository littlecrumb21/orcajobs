import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string })?.role;

  if ((pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup")) && isLoggedIn) {
    if (role === "EMPLOYER") return Response.redirect(new URL("/employer/dashboard", req.url));
    if (role === "ADMIN") return Response.redirect(new URL("/admin", req.url));
    return Response.redirect(new URL("/applicant/dashboard", req.url));
  }

  if (pathname.startsWith("/applicant") && !isLoggedIn) {
    return Response.redirect(new URL(`/auth/login?next=${pathname}`, req.url));
  }
  if (pathname.startsWith("/employer") && !isLoggedIn) {
    return Response.redirect(new URL(`/auth/login?next=${pathname}`, req.url));
  }
  if (pathname.startsWith("/admin") && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return Response.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/applicant") && role === "EMPLOYER") {
    return Response.redirect(new URL("/employer/dashboard", req.url));
  }
  if (pathname.startsWith("/employer") && role === "APPLICANT") {
    return Response.redirect(new URL("/applicant/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/auth/:path*", "/applicant/:path*", "/employer/:path*", "/admin/:path*"],
};
