/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import type { PaginatedInstallments, Installment } from '../types/cuotas.types';

// ✅ CORREGIDO: Función para extraer datos paginados
function unwrapPaginated(body: any): any {
  // El backend devuelve directamente { data: [], meta: {} }
  if (body && Array.isArray(body?.data) && body?.meta) {
    return body;
  }

  // Si hay un nivel adicional de anidación
  let current = body;
  while (current && typeof current === 'object') {
    if (Array.isArray(current?.data) && current?.meta) return current;
    if ('data' in current && typeof current.data === 'object') {
      current = current.data;
      continue;
    }
    break;
  }

  // Si no encuentra nada, devolver estructura vacía
  return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
}

function unwrapSingle(body: any): any {
  let current = body;
  while (current && typeof current === 'object' && 'data' in current) {
    current = current.data;
  }
  return current;
}

export const cuotasService = {
  async getByLoan(
    loanId: number,
    page: number = 1,
    limit: number = 60,
  ): Promise<PaginatedInstallments> {
    const res = await apiClient.get(
      `/loans/${loanId}/installments?page=${page}&limit=${limit}`,
    );

    // ✅ Debug: ver qué devuelve el backend
    console.log('📦 Respuesta del backend:', res.data);

    const result = unwrapPaginated(res.data);

    console.log('📦 Datos extraídos:', result);

    return {
      data: Array.isArray(result?.data) ? result.data : [],
      meta: {
        total: result?.meta?.total ?? 0,
        page: result?.meta?.page ?? page,
        limit: result?.meta?.limit ?? limit,
        totalPages: result?.meta?.totalPages ?? 0,
        hasNextPage: result?.meta?.hasNextPage ?? false,
        hasPrevPage: result?.meta?.hasPrevPage ?? false,
      },
    };
  },

  async getNextDue(loanId: number): Promise<Installment | null> {
    try {
      const res = await apiClient.get(
        `/loans/${loanId}/installments/next-due`,
      );
      return unwrapSingle(res.data);
    } catch {
      return null;
    }
  },

  async getOne(loanId: number, id: number): Promise<Installment> {
    const res = await apiClient.get(
      `/loans/${loanId}/installments/${id}`,
    );
    return unwrapSingle(res.data);
  },
};
