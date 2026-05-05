/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter }   from 'next/navigation';
import { toast }       from 'sonner';
import Cookies from 'js-cookie';

import { authService }   from '../services/auth.service';
import { cookieStorage } from '@/lib/cookies';
import { useAuthStore }  from '@/store/auth.store';
import type { LoginRequest } from '../types/auth.types';

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const tokens = await authService.login(credentials);
      if (!tokens?.accessToken) throw new Error('No se recibió token');

      cookieStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      const user = await authService.me();
      cookieStorage.setRole(user.role);

      return user;
    },
    onSuccess: (user) => {
      setUser(user);
      toast.success(`Bienvenido, ${user.firstName}!`);

      setTimeout(() => {
        if (user.role === 'CUSTOMER') {
          router.push('/mis-prestamos');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }, 100);
    },
    onError: (error: any) => {
      // Solo loguear el error, no mostrar toast
      console.error('Login mutation error:', error);
      // El error se propaga automáticamente al componente
    },
  });
}

export function useLogout() {
  const router      = useRouter();
  const clearAuth   = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = cookieStorage.getRefreshToken();
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    },
    onSettled: () => {
      cookieStorage.clearTokens();
      clearAuth();
      queryClient.clear();
      router.push('/login');
      toast.success('Sesión cerrada correctamente');
    },
  });
}

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey:  ['auth', 'me'],
    queryFn:   async () => {
      const token = cookieStorage.getAccessToken();
      if (!token) {
        throw new Error('No token');
      }

      try {
        const userData = await authService.me();
        setUser(userData);
        cookieStorage.setRole(userData.role);
        return userData;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        cookieStorage.clearTokens();
        throw error;
      }
    },
    retry:     false,
    staleTime: 5 * 60 * 1000,
    enabled:   typeof window !== 'undefined' && !!cookieStorage.getAccessToken() && !isAuthenticated,
    initialData: user || undefined,
  });
}

export function useRole() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return {
    role,
    isAdmin: role === 'ADMIN',
    isAnalyst: role === 'ANALYST',
    isCustomer: role === 'CUSTOMER',
    hasRole: (allowedRoles: string[]) => allowedRoles.includes(role || ''),
  };
}

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { data: userData, isLoading: isLoadingQuery } = useMe();

  return {
    user: userData || user,
    isAuthenticated: isAuthenticated || !!userData,
    isLoading: isLoading || isLoadingQuery,
    isAdmin: user?.role === 'ADMIN' || userData?.role === 'ADMIN',
    isAnalyst: user?.role === 'ANALYST' || userData?.role === 'ANALYST',
    isCustomer: user?.role === 'CUSTOMER' || userData?.role === 'CUSTOMER',
  };
}
