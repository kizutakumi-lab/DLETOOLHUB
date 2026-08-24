'use client';

import React, { createContext, useContext } from 'react';
import { SessionProvider, useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { UserSession } from '@/types';

interface AuthContextType {
  user: UserSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'loading',
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: nextAuthStatus } = useSession();

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/login' });
  };

  const signInWithGoogle = async () => {
    await nextAuthSignIn('google', { callbackUrl: '/' }, { prompt: 'select_account' });
  };

  let currentUser: UserSession | null = null;
  let status: 'loading' | 'authenticated' | 'unauthenticated' = 'unauthenticated';

  if (nextAuthStatus === 'loading') {
    status = 'loading';
  } else if (session?.user) {
    currentUser = {
      name: session.user.name || '社内ユーザー',
      email: session.user.email || '',
      image: session.user.image || undefined,
      isAdmin: (session.user as any).isAdmin || false,
    };
    status = 'authenticated';
  } else {
    status = 'unauthenticated';
  }

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        status,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
