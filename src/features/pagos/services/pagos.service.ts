/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import type {
  PaginatedPayments,
  Payment,
  PaymentFilters,
  CreatePaymentInput,
} from '../types/pagos.types';

function unwrapPaginated(body: any): any {
  let current = body;
  while (current && typeof current === 'object') {
    if (Array.isArray(current?.data) && current?.meta) return current;
    if ('data' in current && typeof current.data === 'object') {
      current = current.data;
      continue;
    }
    break;
  }
  return current;
}

function unwrapSingle(body: any): any {
  let current = body;
  while (current && typeof current === 'object' && 'data' in current) {
    current = current.data;
  }
  return current;
}

export const pagosService = {
  async getAll(filters: PaymentFilters): Promise<PaginatedPayments> {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.loanId) params.set('loanId', String(filters.loanId));

    const res    = await apiClient.get(`/payments?${params.toString()}`);
    const result = unwrapPaginated(res.data);
    return {
      data: Array.isArray(result?.data) ? result.data : [],
      meta: result?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    };
  },

  async getOne(id: number): Promise<Payment> {
    const res = await apiClient.get(`/payments/${id}`);
    return unwrapSingle(res.data);
  },

  async create(data: CreatePaymentInput): Promise<Payment> {
    const res = await apiClient.post('/payments', data);
    return unwrapSingle(res.data);
  },

  async reverse(id: number): Promise<Payment> {
    const res = await apiClient.patch(`/payments/${id}/reverse`);
    return unwrapSingle(res.data);
  },
};
