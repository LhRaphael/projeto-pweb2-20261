import { transactionsApi } from '../api/transactionsApi';
import type { Page } from '../types/api.types';
import type {
  TransactionFilters,
  TransactionRequest,
  TransactionResponse,
} from '../types/transaction.types';

// Camada de serviços para transações, intermediando a API e os componentes/hooks.
export const transactionService = {
  list: async (filters: TransactionFilters): Promise<Page<TransactionResponse>> => {
    return transactionsApi.getAll(filters);
  },

  getById: async (id: number): Promise<TransactionResponse> => {
    return transactionsApi.getById(id);
  },

  create: async (data: TransactionRequest): Promise<TransactionResponse> => {
    return transactionsApi.create(data);
  },

  update: async (id: number, data: TransactionRequest): Promise<TransactionResponse> => {
    return transactionsApi.update(id, data);
  },

  remove: async (id: number): Promise<void> => {
    return transactionsApi.remove(id);
  },
};
