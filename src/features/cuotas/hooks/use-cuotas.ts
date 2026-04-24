'use client';

import { useQuery } from '@tanstack/react-query';
import { cuotasService } from '../services/cuotas.service';
import { apiClient } from '@/lib/api-client';

const QUERY_KEY = 'cuotas';

export function useCuotas(loanId: number, page = 1, limit = 60) {
  return useQuery({
    queryKey: [QUERY_KEY, loanId, page, limit],
    queryFn: async () => {
      // ✅ Llamada directa sin pasar por el servicio problemático
      const response = await apiClient.get(`/loans/${loanId}/installments?page=${page}&limit=${limit}`);

      // ✅ El backend devuelve directamente { data: [], meta: {} }
      const data = response.data?.data ?? [];
      const meta = response.data?.meta ?? {};

      return {
        data: data,
        meta: {
          total: meta.total ?? 0,
          page: meta.page ?? page,
          limit: meta.limit ?? limit,
          totalPages: meta.totalPages ?? 0,
          hasNextPage: meta.hasNextPage ?? false,
          hasPrevPage: meta.hasPrevPage ?? false,
        },
      };
    },
    enabled: typeof loanId === 'number' && loanId > 0,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useNextDue(loanId: number) {
  return useQuery({
    queryKey: [QUERY_KEY, 'next-due', loanId],
    queryFn: () => cuotasService.getNextDue(loanId),
    enabled: typeof loanId === 'number' && loanId > 0,
  });
}
