/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import type {
  PaginatedUsers,
  User,
  UserFilters,
  CreateUserInput,
  UpdateUserInput,
} from '../types/usuarios.types';

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

export const usuariosService = {
  async getAll(filters: UserFilters): Promise<PaginatedUsers> {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.role)   params.set('role',   filters.role);
    if (filters.status) params.set('status', filters.status);

    const res    = await apiClient.get(`/users?${params.toString()}`);
    const result = unwrapPaginated(res.data);
    return {
      data: Array.isArray(result?.data) ? result.data : [],
      meta: result?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    };
  },

  async getOne(id: number): Promise<User> {
    const res = await apiClient.get(`/users/${id}`);
    return unwrapSingle(res.data);
  },

  async create(data: CreateUserInput): Promise<User> {
    const res = await apiClient.post('/users', data);
    return unwrapSingle(res.data);
  },

  async update(id: number, data: UpdateUserInput): Promise<User> {
    const res = await apiClient.patch(`/users/${id}`, data);
    return unwrapSingle(res.data);
  },

  async updateStatus(id: number, status: string): Promise<User> {
    const res = await apiClient.patch(`/users/${id}/status`, { status });
    return unwrapSingle(res.data);
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
