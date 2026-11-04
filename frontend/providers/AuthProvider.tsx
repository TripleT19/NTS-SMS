'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMe, logout as logoutApi } from '@/lib/auth';
import type { AuthPayload } from '@/lib/types/auth';

type AuthState = {
  user: AuthPayload['user'] | null;
  roles: string[];
  permissions: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  can: (permission: string) => boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    user: AuthPayload['user'] | null;
    roles: string[];
    permissions: string[];
    loading: boolean;
  }>({
    user: null,
    roles: [],
    permissions: [],
    loading: true,
  });
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const data = await fetchMe();
      setState({
        user: data.user,
        roles: data.roles,
        permissions: data.permissions,
        loading: false,
      });
    } catch {
      setState({ user: null, roles: [], permissions: [], loading: false });
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    setState({ user: null, roles: [], permissions: [], loading: false });
    router.push('/login');
  }, [router]);

  const can = useCallback(
    (permission: string): boolean => {
      return (
        state.permissions.includes(permission) ||
        state.roles.includes('Super Admin')
      );
    },
    [state.permissions, state.roles]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ ...state, refresh, signOut, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}