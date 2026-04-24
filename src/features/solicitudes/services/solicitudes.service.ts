/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import type {
  PaginatedApplications,
  LoanApplication,
  ApplicationFilters,
  ReviewApplicationInput,
} from '../types/solicitudes.types';

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

export const solicitudesService = {
  async getAll(filters: ApplicationFilters): Promise<PaginatedApplications> {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status) params.set('status', filters.status);

    const res    = await apiClient.get(`/loan-applications?${params.toString()}`);
    const result = unwrapPaginated(res.data);
    return {
      data: Array.isArray(result?.data) ? result.data : [],
      meta: result?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    };
  },

  async getOne(id: number): Promise<LoanApplication> {
    const res = await apiClient.get(`/loan-applications/${id}`);
    return unwrapSingle(res.data);
  },

  async review(id: number, data: ReviewApplicationInput): Promise<LoanApplication> {
    const res = await apiClient.patch(`/loan-applications/${id}/review`, data);
    return unwrapSingle(res.data);
  },

  async cancel(id: number): Promise<LoanApplication> {
    const res = await apiClient.patch(`/loan-applications/${id}/cancel`);
    return unwrapSingle(res.data);
  },
};
