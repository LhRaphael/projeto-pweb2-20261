import { httpClient } from './httpClient';
import { ENDPOINTS } from './endpoints';
import type { Page } from '../types/api.types';
import type {
  TransactionFilters,
  TransactionRequest,
  TransactionResponse,
} from '../types/transaction.types';

/**
 * Camada de acesso a dados (repository) para transações.
 * Cada função corresponde diretamente a um endpoint da API,
 * sem nenhuma regra de negócio adicional.
 */
export const transactionsApi = {
  create: async (data: TransactionRequest): Promise<TransactionResponse> => {
    const response = await httpClient.post<TransactionResponse>(ENDPOINTS.transactions.base, data);
    return response.data;
  },

  getAll: async (filters: TransactionFilters): Promise<Page<TransactionResponse>> => {
    const response = await httpClient.get<Page<TransactionResponse>>(ENDPOINTS.transactions.base, {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<TransactionResponse> => {
    const response = await httpClient.get<TransactionResponse>(ENDPOINTS.transactions.byId(id));
    return response.data;
  },

  update: async (id: number, data: TransactionRequest): Promise<TransactionResponse> => {
    const response = await httpClient.put<TransactionResponse>(ENDPOINTS.transactions.byId(id), data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await httpClient.delete(ENDPOINTS.transactions.byId(id));
  },
};