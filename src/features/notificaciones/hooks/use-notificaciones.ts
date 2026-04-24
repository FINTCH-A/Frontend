'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }                    from 'sonner';
import { notificacionesService }    from '../services/notificaciones.service';

const QUERY_KEY = 'notificaciones';

export function useNotificaciones(
  page       = 1,
  limit      = 20,
  onlyUnread = false,
) {
  return useQuery({
    queryKey:  [QUERY_KEY, page, limit, onlyUnread],
    queryFn:   () =>
      notificacionesService.getAll(page, limit, onlyUnread),
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificacionesService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => {
      toast.error('Error al marcar como leída');
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificacionesService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Todas las notificaciones marcadas como leídas');
    },
    onError: () => {
      toast.error('Error al marcar como leídas');
    },
  });
}
