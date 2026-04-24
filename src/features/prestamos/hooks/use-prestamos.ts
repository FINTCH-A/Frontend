/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }             from 'sonner';
import { prestamosService }  from '../services/prestamos.service';
import type {
  LoanFilters,
  CreateLoanInput,
} from '../types/prestamos.types';

const QUERY_KEY = 'prestamos';

// use-prestamos.ts
export function usePrestamos(filters: LoanFilters = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey:  [QUERY_KEY, filters],
    queryFn:   () => prestamosService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePrestamo(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => prestamosService.getOne(id),
    enabled:  !!id,
  });
}

export function useCreatePrestamo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLoanInput) => prestamosService.create(data),
    onSuccess: (loan) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      toast.success(`Préstamo ${loan.loanCode} creado correctamente`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al crear préstamo';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useDesembolsarPrestamo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => prestamosService.disburse(id),
    onSuccess: (loan) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['cuotas'] });
      toast.success(`Préstamo ${loan.loanCode} desembolsado. Cuotas generadas.`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al desembolsar';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
