import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config (no Prisma, no bcrypt)
// Used by middleware only — full auth.ts is used by API routes and server components
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [], // credentials provider added in auth.ts (Node.js only)
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error — role added in auth.ts authorize()
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      // @ts-expect-error — role added above
      session.user.role = token.role;
      return session;
    },
  },
};
