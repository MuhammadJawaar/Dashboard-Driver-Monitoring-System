import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id as string;
        token.nama = user.nama as string;
      }
      return token as JWT & { id: string; nama: string };
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.nama = token.nama as string;
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
