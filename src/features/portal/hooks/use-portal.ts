/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }         from 'sonner';
import { portalService } from '../services/portal.service';

const KEY = 'portal';

export function useMisLoans(page = 1) {
  return useQuery({
    queryKey:  [KEY, 'loans', page],
    queryFn:   () => portalService.getMisLoans(page),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMisApplications(page = 1) {
  return useQuery({
    queryKey:  [KEY, 'applications', page],
    queryFn:   () => portalService.getMisApplications(page),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: portalService.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, 'applications'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al crear solicitud';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => portalService.submitApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, 'applications'] });
      queryClient.invalidateQueries({ queryKey: [KEY, 'loans'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al enviar solicitud';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useMisInstallments(loanId: number, page = 1) {
  return useQuery({
    queryKey:  [KEY, 'installments', loanId, page],
    queryFn:   () => portalService.getMisInstallments(loanId, page),
    enabled:   !!loanId && loanId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMisPayments(page = 1) {
  return useQuery({
    queryKey:  [KEY, 'payments', page],
    queryFn:   () => portalService.getMisPayments(page),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMisNotifications(page = 1, onlyUnread = false) {
  return useQuery({
    queryKey:  [KEY, 'notifications', page, onlyUnread],
    queryFn:   () => portalService.getMisNotifications(page, 20, onlyUnread),
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => portalService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, 'notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => portalService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, 'notifications'] });
      toast.success('Todas las notificaciones marcadas como leídas');
    },
  });
}

export function useRealizarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      loanId:          number;
      installmentId:   number;
      amount:          number;
      paymentMethodId?: number;
      notes?:          string;
    }) => portalService.realizarPago(data),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: [KEY, 'installments'] });
      queryClient.invalidateQueries({ queryKey: [KEY, 'payments'] });
      queryClient.invalidateQueries({ queryKey: [KEY, 'loans'] });
      toast.success(`✅ Pago realizado. Ref: ${payment.reference}`);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ?? 'Error al procesar el pago';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
