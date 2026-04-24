/* eslint-disable @typescript-eslint/no-unused-vars */
// frontend-avante/src/features/auth/services/auth.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import Cookies from 'js-cookie';
import type { LoginRequest, AuthTokens, AuthUser } from '../types/auth.types';

function unwrap<T>(body: any): T {
  let current = body;
  while (current && typeof current === 'object') {
    if (Array.isArray(current?.data) && current?.meta) return current as T;
    if ('data' in current && typeof current.data === 'object') {
      current = current.data;
      continue;
    }
    break;
  }
  return current as T;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthTokens> {
    const res = await apiClient.post('/auth/login', credentials);
    const tokens = unwrap<AuthTokens>(res.data);
    if (!tokens?.accessToken) throw new Error('No se recibió token de acceso');

    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 7, path: '/' });
    }
    return tokens;
  },

  async me(): Promise<AuthUser> {
    const res = await apiClient.get('/auth/me');
    const user = unwrap<AuthUser>(res.data);
    if (!user?.id) throw new Error('No se pudo obtener el usuario');
    return user;
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      Cookies.remove('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const res = await apiClient.post('/auth/refresh', { refreshToken });
    const tokens = unwrap<AuthTokens>(res.data);
    if (!tokens?.accessToken) throw new Error('No se pudo refrescar el token');

    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 7, path: '/' });
    }
    return tokens;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
