/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/prestamos/services/prestamos.service.ts
import { apiClient } from '@/lib/api-client';
import type {
  PaginatedLoans,
  Loan,
  LoanFilters,
  CreateLoanInput,
} from '../types/prestamos.types';

function unwrap<T>(body: any): T {
  const current = body;
  // Para paginados
  if (typeof body === 'object') {
    let c = body;
    while (c && typeof c === 'object') {
      if (Array.isArray(c?.data) && c?.meta) return c as T;
      if ('data' in c && typeof c.data === 'object') { c = c.data; continue; }
      break;
    }
    // Para objetos simples
    let c2 = body;
    while (c2 && typeof c2 === 'object' && 'data' in c2) {
      c2 = c2.data;
    }
    return c2 as T;
  }
  return current as T;
}

export const prestamosService = {
  // ✅ Método para obtener préstamos (filtra automáticamente por usuario según rol)
  async getPrestamos(page: number = 1, limit: number = 10, status?: string): Promise<PaginatedLoans> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (status) params.set('status', status);

    const res = await apiClient.get(`/loans?${params.toString()}`);
    return unwrap<PaginatedLoans>(res.data);
  },

  // ✅ Método para mis préstamos (usando el mismo endpoint)
  async getMisPrestamos(page: number = 1, limit: number = 10): Promise<PaginatedLoans> {
    // El backend filtrará automáticamente por el usuario autenticado
    return this.getPrestamos(page, limit);
  },

  async getAll(filters: LoanFilters): Promise<PaginatedLoans> {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status) params.set('status', filters.status);

    const res = await apiClient.get(`/loans?${params.toString()}`);
    return unwrap<PaginatedLoans>(res.data);
  },

  async getOne(id: number): Promise<Loan> {
    const res = await apiClient.get(`/loans/${id}`);
    return unwrap<Loan>(res.data);
  },

  async create(data: CreateLoanInput): Promise<Loan> {
    const res = await apiClient.post('/loans', data);
    return unwrap<Loan>(res.data);
  },

  async disburse(id: number): Promise<Loan> {
    const res = await apiClient.patch(`/loans/${id}/disburse`);
    return unwrap<Loan>(res.data);
  },
};
