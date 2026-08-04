import { spendingLimitsApi } from '../api/spendingLimitsApi';

import type {
  SpendingLimitResponse,
  CreateSpendingLimitRequest,
} from '../types/spendingLimit.types';

/**
 * Camada de serviço para limites de gastos (RF06).
 * Centraliza o acesso às operações de limites,
 * mesmo que atualmente apenas delegue para a API.
 */
export const spendingLimitService = {
  list: async (): Promise<SpendingLimitResponse[]> => {
    return spendingLimitsApi.getAll();
  },

  create: async (
    data: CreateSpendingLimitRequest,
  ): Promise<SpendingLimitResponse> => {
    return spendingLimitsApi.create(data);
  },

  remove: async (
    id: number,
  ): Promise<void> => {
    return spendingLimitsApi.remove(id);
  },
};
