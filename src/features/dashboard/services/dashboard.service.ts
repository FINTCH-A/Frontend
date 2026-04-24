/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  totalUsers: number;
  activeLoans: number;
  pendingApplications: number;
  totalDisbursed: number;
  userTrend: string;
  loanTrend: string;
  applicationTrend: string;
  disbursedTrend: string;
}

export interface RecentActivity {
  id: number;
  type: 'payment' | 'application' | 'loan' | 'kyc';
  description: string;
  timeAgo: string;
  createdAt: string;
}

export interface SystemAlert {
  id: number;
  level: 'error' | 'warning' | 'info';
  message: string;
}

// ============================================================
// FUNCIÓN PARA EXTRAER DATOS DE RESPUESTAS ANIDADAS
// ============================================================
function unwrapData(response: any): any {
  let current = response;

  // Seguir desenvolviendo mientras haya una propiedad 'data' que sea objeto
  while (current && typeof current === 'object' && 'data' in current) {
    // Si data es un array, es el resultado final
    if (Array.isArray(current.data)) {
      return current.data;
    }
    // Si data es un objeto, seguir desenvolviendo
    if (current.data && typeof current.data === 'object') {
      current = current.data;
      continue;
    }
    break;
  }

  // Si llegamos aquí, devolver lo que hay
  return current;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get('/dashboard/stats');
      // Para stats, la respuesta puede estar envuelta
      const data = unwrapData(response.data);
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        activeLoans: 0,
        pendingApplications: 0,
        totalDisbursed: 0,
        userTrend: '0%',
        loanTrend: '0%',
        applicationTrend: '0%',
        disbursedTrend: '0%',
      };
    }
  },

  async getRecentActivity(limit: number = 5): Promise<RecentActivity[]> {
    try {
      const response = await apiClient.get(`/dashboard/recent-activity?limit=${limit}`);

      // ✅ Usar unwrapData para manejar la anidación { data: { data: [...] } }
      const data = unwrapData(response.data);

      // Asegurar que devolvemos un array
      if (Array.isArray(data)) {
        console.log(`✅ Recent activity: ${data.length} items`);
        return data;
      }

      console.warn('Unexpected response format for recent activity:', data);
      return [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  },

  async getSystemAlerts(): Promise<SystemAlert[]> {
    try {
      const response = await apiClient.get('/dashboard/alerts');

      // ✅ Usar unwrapData para manejar la anidación
      const data = unwrapData(response.data);

      if (Array.isArray(data)) {
        return data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      return [];
    }
  },
};
