/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }                from 'sonner';
import { solicitudesService }   from '../services/solicitudes.service';
import type {
  ApplicationFilters,
  ReviewApplicationInput,
} from '../types/solicitudes.types';

const QUERY_KEY = 'solicitudes';

export function useSolicitudes(filters: ApplicationFilters) {
  return useQuery({
    queryKey:  [QUERY_KEY, filters],
    queryFn:   () => solicitudesService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSolicitud(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => solicitudesService.getOne(id),
    enabled:  !!id,
  });
}

export function useReviewSolicitud() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id:   number;
      data: ReviewApplicationInput;
    }) => solicitudesService.review(id, data) as Promise<{ status: string }>,
    onSuccess: (app: { status: string }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      const labels: Record<string, string> = {
        APPROVED:     '✅ Solicitud aprobada',
        REJECTED:     '❌ Solicitud rechazada',
        UNDER_REVIEW: '🔍 En revisión',
      };
      toast.success(labels[app.status] ?? 'Solicitud actualizada');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al revisar';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useCancelSolicitud() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => solicitudesService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Solicitud cancelada');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al cancelar';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
