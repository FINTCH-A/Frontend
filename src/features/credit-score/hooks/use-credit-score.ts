/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast }              from 'sonner';
import { creditScoreService } from '../services/credit-score.service';
import type { CreateCreditScoreInput } from '../types/credit-score.types';

const QUERY_KEY = 'credit-score';

export function useCreditScoreLatest(userId: number) {
  console.log(`🔍 [useCreditScoreLatest] userId=${userId}, enabled=${!!userId}`);

  return useQuery({
    queryKey:  [QUERY_KEY, 'latest', userId],
    queryFn:   async () => {
      console.log(`📡 [useCreditScoreLatest] Ejecutando query para userId=${userId}`);
      const result = await creditScoreService.getLatest(userId);
      console.log(`✅ [useCreditScoreLatest] Resultado:`, result);
      return result;
    },
    enabled:   !!userId && userId > 0,
    retry:     false,
    staleTime: 30 * 1000, // 30 segundos
  });
}

export function useCreditScoreHistory(
  userId: number,
  page  = 1,
  limit = 10,
) {
  console.log(`🔍 [useCreditScoreHistory] userId=${userId}, page=${page}, limit=${limit}`);

  return useQuery({
    queryKey:  [QUERY_KEY, 'history', userId, page, limit],
    queryFn:   async () => {
      console.log(`📡 [useCreditScoreHistory] Ejecutando query`);
      const result = await creditScoreService.getHistory(userId, page, limit);
      console.log(`✅ [useCreditScoreHistory] Resultado: ${result.data.length} registros`);
      return result;
    },
    enabled:   !!userId && userId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useEvaluateCreditScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: number;
      data:   CreateCreditScoreInput;
    }) => {
      console.log(`📡 [useEvaluateCreditScore] Evaluando para userId=${userId}`, data);
      const result = await creditScoreService.evaluate(userId, data);
      console.log(`✅ [useEvaluateCreditScore] Resultado:`, result);
      return result;
    },
    onSuccess: (score) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(
        `Score crediticio registrado: ${score.score} pts — ${score.riskLabel || score.riskLevel}`,
      );
    },
    onError: (error: any) => {
      console.error('❌ [useEvaluateCreditScore] Error:', error);
      const msg =
        error?.response?.data?.message ?? 'Error al registrar evaluación';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
