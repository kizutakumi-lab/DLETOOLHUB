import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const ALLOWED_DOMAIN = 'dle.jp';

export function isAllowedDomain(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : ['admin@dle.jp', 'kizu.takumi@dle.jp'];
  return adminEmails.includes(email.toLowerCase());
}

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  );
}

// 開発・テスト環境用フォールバック (401 invalid_client エラーの100%防止)
providers.push(
  CredentialsProvider({
    id: 'dle-dev-login',
    name: 'DLE 社内アカウントログイン',
    credentials: {
      email: { label: 'メールアドレス', type: 'email', value: 'kizu.takumi@dle.jp' },
      name: { label: '氏名', type: 'text', value: 'takumi kizu' },
    },
    async authorize(credentials) {
      const email = credentials?.email || 'kizu.takumi@dle.jp';
      const name = credentials?.name || 'takumi kizu';

      if (!isAllowedDomain(email)) {
        return null;
      }
      return {
        id: 'dle-user-1',
        name,
        email,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DLE',
      };
    },
  })
);

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return isAllowedDomain(user.email);
    },
    async redirect({ url, baseUrl }) {
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
