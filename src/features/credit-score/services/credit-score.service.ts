/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import type {
  CreditScore,
  PaginatedCreditScores,
  CreateCreditScoreInput,
} from '../types/credit-score.types';

function unwrapPaginated(body: any): any {
  console.log('📦 [unwrapPaginated] Input:', body);
  let current = body;
  while (current && typeof current === 'object') {
    // Si ya tiene estructura paginada
    if (Array.isArray(current?.data) && current?.meta) {
      console.log('✅ [unwrapPaginated] Encontrada estructura paginada');
      return current;
    }
    // Si hay capa data
    if ('data' in current && typeof current.data === 'object') {
      console.log('🔄 [unwrapPaginated] Desenvolviendo capa data');
      current = current.data;
      continue;
    }
    break;
  }
  // Si current es un array directo
  if (Array.isArray(current)) {
    console.log('✅ [unwrapPaginated] Es un array directo, creando estructura paginada');
    return {
      data: current,
      meta: { total: current.length, page: 1, limit: current.length, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    };
  }
  console.log('⚠️ [unwrapPaginated] Formato no reconocido, retornando current');
  return current;
}

function unwrapSingle(body: any): any {
  console.log('📦 [unwrapSingle] Input:', body);
  let current = body;
  while (current && typeof current === 'object' && 'data' in current) {
    console.log('🔄 [unwrapSingle] Desenvolviendo capa data');
    current = current.data;
  }
  console.log('✅ [unwrapSingle] Resultado:', current);
  return current;
}

export const creditScoreService = {
  // Obtener el último credit score
  async getLatest(userId: number): Promise<CreditScore | null> {
    console.log(`🔍 [creditScoreService] getLatest userId=${userId}`);
    try {
      const res = await apiClient.get(`/users/${userId}/credit-score`);
      console.log(`📡 [creditScoreService] Respuesta status: ${res.status}, data:`, res.data);
      const data = unwrapSingle(res.data);
      console.log(`✅ [creditScoreService] Credit score obtenido:`, data);
      return data;
    } catch (error: any) {
      console.error(`❌ [creditScoreService] Error: status=${error?.response?.status}, message=${error?.message}`);
      if (error?.response?.status === 404) {
        console.warn(`⚠️ No se encontró credit score para userId=${userId}`);
        return null;
      }
      throw error;
    }
  },

  // Obtener historial de credit scores
  async getHistory(
    userId: number,
    page  = 1,
    limit = 10,
  ): Promise<PaginatedCreditScores> {
    console.log(`🔍 [creditScoreService] getHistory userId=${userId}, page=${page}, limit=${limit}`);
    try {
      const res = await apiClient.get(`/users/${userId}/credit-score/history`);
      console.log(`📡 [creditScoreService] Respuesta status: ${res.status}, data:`, res.data);

      const result = unwrapPaginated(res.data);

      const paginatedResult: PaginatedCreditScores = {
        data: Array.isArray(result?.data) ? result.data : [],
        meta: result?.meta ?? {
          total: 0,
          page: 1,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
      };

      console.log(`✅ [creditScoreService] Historial obtenido: ${paginatedResult.data.length} registros`);
      return paginatedResult;
    } catch (error) {
      console.error(`❌ [creditScoreService] Error fetching history:`, error);
      return {
        data: [],
        meta: { total: 0, page: 1, limit, totalPages: 0, hasNextPage: false, hasPrevPage: false },
      };
    }
  },

  // Crear/evaluar credit score
  async evaluate(
    userId: number,
    data: CreateCreditScoreInput,
  ): Promise<CreditScore> {
    console.log(`🔍 [creditScoreService] evaluate userId=${userId}, data=`, data);
    try {
      const res = await apiClient.post(`/users/${userId}/credit-score`, data);
      console.log(`📡 [creditScoreService] Respuesta status: ${res.status}, data:`, res.data);
      const result = unwrapSingle(res.data);
      console.log(`✅ [creditScoreService] Credit score creado:`, result);
      return result;
    } catch (error) {
      console.error(`❌ [creditScoreService] Error en evaluate:`, error);
      throw error;
    }
  },
};
