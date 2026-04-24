/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast }             from 'sonner';
import { usuariosService }   from '../services/usuarios.service';
import type {
  UserFilters,
  CreateUserInput,
  UpdateUserInput,
} from '../types/usuarios.types';

const QUERY_KEY = 'usuarios';

export function useUsuarios(filters: UserFilters) {
  return useQuery({
    queryKey:  [QUERY_KEY, filters],
    queryFn:   () => usuariosService.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUsuario(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => usuariosService.getOne(id),
    enabled:  !!id,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => usuariosService.create(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(`Usuario ${user.firstName} creado correctamente`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al crear usuario';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) =>
      usuariosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Usuario actualizado correctamente');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al actualizar';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useUpdateStatusUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      usuariosService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al cambiar estado';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usuariosService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Usuario eliminado correctamente');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al eliminar';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
