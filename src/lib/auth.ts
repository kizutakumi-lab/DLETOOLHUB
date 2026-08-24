import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Vercel環境での NEXTAUTH_URL / URLの自己補完ガード (Invalid URL防止)
if (!process.env.NEXTAUTH_URL) {
  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  } else {
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
  }
}

export const ALLOWED_DOMAIN = 'dle.jp';

export function isAllowedDomain(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : ['admin@dle.jp'];
  return adminEmails.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_google_client_secret',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const allowed = isAllowedDomain(user.email);
      if (!allowed) {
        return '/login?error=AccessDenied';
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // ログイン成功後は常にトップページへリダイレクト
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.isAdmin = isAdminUser(user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session.user as any).isAdmin = token.isAdmin ?? isAdminUser(token.email as string);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dle-tool-portal-secret-key-2026',
};
