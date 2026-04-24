/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }         from 'sonner';
import { pagosService }  from '../services/pagos.service';
import type {
  PaymentFilters,
  CreatePaymentInput,
} from '../types/pagos.types';

const QUERY_KEY = 'pagos';

export function usePagos(filters: PaymentFilters) {
  return useQuery({
    queryKey:  [QUERY_KEY, filters],
    queryFn:   () => pagosService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePago(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => pagosService.getOne(id),
    enabled:  !!id,
  });
}

export function useCreatePago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentInput) => pagosService.create(data),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['cuotas'] });
      queryClient.invalidateQueries({ queryKey: ['prestamos'] });
      toast.success(`Pago registrado. Ref: ${payment.reference}`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al registrar pago';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useReversePago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pagosService.reverse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['cuotas'] });
      toast.success('Pago revertido correctamente');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al revertir';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
