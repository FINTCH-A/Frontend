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
    try {
      const res = await apiClient.post('/auth/login', credentials);
      const tokens = unwrap<AuthTokens>(res.data);

      if (!tokens?.accessToken) {
        throw new Error('No se recibió token de acceso');
      }

      localStorage.setItem('accessToken', tokens.accessToken);
      if (tokens.refreshToken) {
        Cookies.set('refreshToken', tokens.refreshToken, { expires: 7, path: '/' });
      }
      return tokens;
    } catch (error: any) {
      // Manejar errores de autenticación
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
      }
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos. Por favor, verifica la información ingresada.');
      }
      if (error.response?.data?.message) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;
        throw new Error(message);
      }
      throw new Error('Error de conexión. Por favor, intenta de nuevo más tarde.');
    }
  },

  async me(): Promise<AuthUser> {
    try {
      const res = await apiClient.get('/auth/me');
      const user = unwrap<AuthUser>(res.data);
      if (!user?.id) throw new Error('No se pudo obtener el usuario');
      return user;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      throw new Error('Error al obtener información del usuario');
    }
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
    try {
      const res = await apiClient.post('/auth/refresh', { refreshToken });
      const tokens = unwrap<AuthTokens>(res.data);
      if (!tokens?.accessToken) throw new Error('No se pudo refrescar el token');

      localStorage.setItem('accessToken', tokens.accessToken);
      if (tokens.refreshToken) {
        Cookies.set('refreshToken', tokens.refreshToken, { expires: 7, path: '/' });
      }
      return tokens;
    } catch (error: any) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
