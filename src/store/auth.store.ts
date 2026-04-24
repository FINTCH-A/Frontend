/* eslint-disable @typescript-eslint/no-unused-vars */
// frontend-avante/src/store/auth.store.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/features/auth/services/auth.service';
import Cookies from 'js-cookie';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'ANALYST' | 'CUSTOMER';
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;  // ← AGREGAR ESTO
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;  // ← OPCIONAL: para controlar loading
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,  // ← Inicializar en true

      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('avante_access_token');
        Cookies.remove('avante_user_role');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }

          const user = await authService.me();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          localStorage.removeItem('accessToken');
          Cookies.remove('refreshToken');
          Cookies.remove('avante_access_token');
          Cookies.remove('avante_user_role');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'avante-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  ),
);
