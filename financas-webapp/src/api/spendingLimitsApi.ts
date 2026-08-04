import { httpClient } from './httpClient';
import { ENDPOINTS } from './endpoints';

import type {
  SpendingLimitResponse,
  CreateSpendingLimitRequest,
} from '../types/spendingLimit.types';

export const spendingLimitsApi = {
  getAll: async (): Promise<SpendingLimitResponse[]> => {
    const response = await httpClient.get<SpendingLimitResponse[]>(
      ENDPOINTS.spendingLimits.base,
    );

    return response.data;
  },

  create: async (
    data: CreateSpendingLimitRequest,
  ): Promise<SpendingLimitResponse> => {
    const response = await httpClient.post<SpendingLimitResponse>(
      ENDPOINTS.spendingLimits.base,
      data,
    );

    return response.data;
  },

  remove: async (
    id: number,
  ): Promise<void> => {
    await httpClient.delete(
      ENDPOINTS.spendingLimits.byId(id),
    );
  },
};
