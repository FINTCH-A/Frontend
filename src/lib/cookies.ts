// frontend-avante/src/lib/cookies.ts
import Cookies from 'js-cookie';

export const cookieStorage = {
  // ============================================================
  // TOKENS
  // ============================================================
  getAccessToken: () => localStorage.getItem('accessToken'),

  getRefreshToken: () => Cookies.get('refreshToken'),

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
    // Cookie para el middleware
    Cookies.set('avante_access_token', accessToken, { expires: 7, path: '/' });
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('avante_access_token');
    Cookies.remove('avante_user_role');
  },

  // ============================================================
  // ROL
  // ============================================================
  setRole: (role: string) => {
    if (role) {
      localStorage.setItem('userRole', role);
      Cookies.set('avante_user_role', role, { expires: 7, path: '/' });
    } else {
      localStorage.removeItem('userRole');
      Cookies.remove('avante_user_role');
    }
  },

  getRole: () => {
    return localStorage.getItem('userRole');
  },

  // ✅ NUEVO: Método que estabas usando
  getUserRole: () => {
    return localStorage.getItem('userRole') || Cookies.get('avante_user_role');
  },

  // ============================================================
  // UTILIDADES
  // ============================================================
  hasToken: () => {
    return !!localStorage.getItem('accessToken') || !!Cookies.get('avante_access_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};
