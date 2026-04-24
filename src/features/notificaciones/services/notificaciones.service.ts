/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import type { PaginatedNotifications } from '../types/notificaciones.types';

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

export const notificacionesService = {
  async getAll(
    page       = 1,
    limit      = 20,
    onlyUnread = false,
  ): Promise<PaginatedNotifications> {
    const params = new URLSearchParams({
      page:       String(page),
      limit:      String(limit),
      onlyUnread: String(onlyUnread),
    });
    const res    = await apiClient.get(`/notifications?${params.toString()}`);
    const result = unwrapPaginated(res.data);
    return {
      data: Array.isArray(result?.data) ? result.data : [],
      meta: result?.meta ?? {
        total: 0, page: 1, limit, totalPages: 0,
        hasNextPage: false, hasPrevPage: false, unread: 0,
      },
    };
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  },
};
