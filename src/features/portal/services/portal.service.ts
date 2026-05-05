/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import type {
  PaginatedLoans,
  PaginatedApplications,
  PaginatedInstallments,
  PaginatedPayments,
  PaginatedNotifications,
  LoanApplication,
} from '../types/portal.types';

// ============================================================
// CORRECCIÓN 1: unwrapPaginated() - Maneja triple anidación
// ============================================================
// Casos que maneja:
// 1. { data: { data: { items: [], meta } } }  <- Triple anidación
// 2. { data: { items: [], meta } }             <- Doble anidación
// 3. { data: [], meta }                        <- Directo
// 4. { items: [], meta }                       <- Sin capa data
// ============================================================
function unwrapPaginated(body: any): any {
  let current = body;

  while (current && typeof current === 'object') {
    // CASO 1: Triple anidación { data: { data: items, meta } }
    if (current?.data?.data && (Array.isArray(current.data.data) || current.data.meta)) {
      return {
        data: Array.isArray(current.data.data) ? current.data.data : [],
        meta: current.data.meta || { total: 0, page: 1, limit: 20, totalPages: 0, hasNextPage: false, hasPrevPage: false },
      };
    }

    // CASO 2: Doble anidación con items { data: { items: [], meta } }
    if (current?.data && typeof current.data === 'object' && !Array.isArray(current.data)) {
      if (Array.isArray(current.data.items) || current.data.meta) {
        return {
          data: current.data.items || current.data.data || [],
          meta: current.data.meta || { total: 0, page: 1, limit: 20, totalPages: 0, hasNextPage: false, hasPrevPage: false },
        };
      }
      // Seguir desenvolviendo si no tiene items/meta
      current = current.data;
      continue;
    }

    // CASO 3: { data: [], meta } directo
    if (Array.isArray(current?.data) && current?.meta) {
      return current;
    }

    // CASO 4: { items: [], meta } sin capa data
    if (Array.isArray(current?.items) && current?.meta) {
      return current;
    }

    // CASO 5: Si tiene data que es array pero sin meta
    if (Array.isArray(current?.data) && !current?.meta) {
      return {
        data: current.data,
        meta: { total: current.data.length, page: 1, limit: current.data.length, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      };
    }

    break;
  }

  // Fallback seguro
  return {
    data: Array.isArray(current) ? current : [],
    meta: { total: 0, page: 1, limit: 20, totalPages: 0, hasNextPage: false, hasPrevPage: false },
  };
}

// Para respuestas que no son paginadas (objetos simples)
function unwrapSingle(body: any): any {
  let current = body;
  while (current && typeof current === 'object' && 'data' in current && !Array.isArray(current.data)) {
    current = current.data;
  }
  return current;
}

// Helper para garantizar estructura paginada consistente
function safePaginated<T>(
  result: any,
  limit: number,
): { data: T[]; meta: any } {
  // Si result ya tiene la estructura correcta
  if (result && Array.isArray(result.data) && result.meta) {
    return result as { data: T[]; meta: any };
  }

  // Si result es un array directo
  if (Array.isArray(result)) {
    return {
      data: result,
      meta: {
        total: result.length,
        page: 1,
        limit,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  // Fallback
  return {
    data: Array.isArray(result?.data) ? result.data : [],
    meta: result?.meta ?? {
      total: 0,
      page: 1,
      limit,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

export const portalService = {

  // ─── PRÉSTAMOS ───────────────────────────────────────────────

  async getMisLoans(page = 1, limit = 20): Promise<PaginatedLoans> {
    const res = await apiClient.get(`/loans?page=${page}&limit=${limit}`);
    const result = unwrapPaginated(res.data);
    return safePaginated<any>(result, limit) as PaginatedLoans;
  },

  // ─── SOLICITUDES ─────────────────────────────────────────────

  async getMisApplications(
    page = 1,
    limit = 20,
  ): Promise<PaginatedApplications> {
    const res = await apiClient.get(`/loan-applications?page=${page}&limit=${limit}`);
    const result = unwrapPaginated(res.data);
    return safePaginated<any>(result, limit) as PaginatedApplications;
  },

  async createApplication(data: {
    requestedAmount: number;
    requestedTerm: number;
    purpose?: string;
  }): Promise<LoanApplication> {
    const res = await apiClient.post('/loan-applications', data);
    return unwrapSingle(res.data);
  },

  async submitApplication(id: number): Promise<LoanApplication> {
    const res = await apiClient.patch(`/loan-applications/${id}/submit`);
    return unwrapSingle(res.data);
  },

  // ─── CUOTAS ──────────────────────────────────────────────────

  async getMisInstallments(
    loanId: number,
    page = 1,
    limit = 60,
  ): Promise<PaginatedInstallments> {
    const res = await apiClient.get(`/loans/${loanId}/installments?page=${page}&limit=${limit}`);
    const result = unwrapPaginated(res.data);
    return safePaginated<any>(result, limit) as PaginatedInstallments;
  },

  // ─── PAGOS ───────────────────────────────────────────────────

  async getMisPayments(
    page = 1,
    limit = 20,
  ): Promise<PaginatedPayments> {
    const res = await apiClient.get(`/payments?page=${page}&limit=${limit}`);
    const result = unwrapPaginated(res.data);
    return safePaginated<any>(result, limit) as PaginatedPayments;
  },

  // ─── NOTIFICACIONES ──────────────────────────────────────────

  async getMisNotifications(
    page = 1,
    limit = 20,
    onlyUnread = false,
  ): Promise<PaginatedNotifications> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      onlyUnread: String(onlyUnread),
    });
    const res = await apiClient.get(`/notifications?${params.toString()}`);
    const result = unwrapPaginated(res.data);
    return safePaginated<any>(result, limit) as PaginatedNotifications;
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  },

  // ─── OBTENER PERFIL Y DATOS EXISTENTES ──────────────────────

  async getMyProfile(): Promise<any> {
    const res = await apiClient.get('/auth/me');
    return unwrapSingle(res.data);
  },

  async getMyAddress(): Promise<any | null> {
    try {
      const me = await this.getMyProfile();
      const res = await apiClient.get(`/users/${me.id}/address`);
      return unwrapSingle(res.data);
    } catch {
      return null;
    }
  },

  async getMyFinancialInfo(): Promise<any | null> {
    try {
      const me = await this.getMyProfile();
      const res = await apiClient.get(`/users/${me.id}/financial-info`);
      return unwrapSingle(res.data);
    } catch {
      return null;
    }
  },

  async getMyFamilyInfo(): Promise<any | null> {
    try {
      const me = await this.getMyProfile();
      const res = await apiClient.get(`/users/${me.id}/family-info`);
      return unwrapSingle(res.data);
    } catch {
      return null;
    }
  },

  async getMyPaymentMethods(): Promise<any[]> {
    return this.getMisPaymentMethods(); // Reutilizar método existente
  },

  async getApplicationDetail(id: number) {
    const response = await apiClient.get(`/loan-applications/${id}`);
    console.log('Raw application response:', response.data);
    const unwrapped = unwrapSingle(response.data);
    console.log('Unwrapped application:', unwrapped);
    return unwrapped;
  },

  async getLoanDetail(id: number) {
    const response = await apiClient.get(`/loans/${id}`);
    console.log('Raw loan response:', response.data);
    const unwrapped = unwrapSingle(response.data);
    console.log('Unwrapped loan:', unwrapped);
    return unwrapped;
  },

  // ─── GUARDAR DATOS ──────────────────────────────────────────

  async saveAddress(data: any): Promise<any> {
    const me = await this.getMyProfile();
    const payload = { ...data, country: data.country || 'Perú' };
    try {
      const res = await apiClient.put(`/users/${me.id}/address`, payload);
      return unwrapSingle(res.data);
    } catch {
      const res = await apiClient.post(`/users/${me.id}/address`, payload);
      return unwrapSingle(res.data);
    }
  },

  async saveFinancialInfo(data: any): Promise<any> {
    const me = await this.getMyProfile();
    try {
      const res = await apiClient.put(`/users/${me.id}/financial-info`, data);
      return unwrapSingle(res.data);
    } catch {
      const res = await apiClient.post(`/users/${me.id}/financial-info`, data);
      return unwrapSingle(res.data);
    }
  },

  async saveFamilyInfo(data: any): Promise<any> {
    const me = await this.getMyProfile();
    try {
      const res = await apiClient.put(`/users/${me.id}/family-info`, data);
      return unwrapSingle(res.data);
    } catch {
      const res = await apiClient.post(`/users/${me.id}/family-info`, data);
      return unwrapSingle(res.data);
    }
  },

  async savePaymentMethod(data: any): Promise<any> {
    const me = await this.getMyProfile();
    const res = await apiClient.post(`/users/${me.id}/payment-methods`, data);
    return unwrapSingle(res.data);
  },

  // ─── REALIZAR PAGO ───────────────────────────────────────────

  async realizarPago(data: {
    loanId: number;
    installmentId: number;
    amount: number;
    paymentMethodId?: number;
    notes?: string;
  }): Promise<any> {
    // Generar un reference más corto
    const reference = `PAY-${data.loanId}-${data.installmentId}-${Date.now()}`.slice(0, 100);

    const res = await apiClient.post('/payments', {
      ...data,
      reference, // ← agregar este campo si es requerido
    });
    return unwrapSingle(res.data);
  },

  async getMisPaymentMethods(): Promise<any[]> {
    try {
      const res = await apiClient.get('/auth/me');
      const me = unwrapSingle(res.data);
      const res2 = await apiClient.get(`/users/${me.id}/payment-methods`);
      const result = unwrapSingle(res2.data);
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  },
};
