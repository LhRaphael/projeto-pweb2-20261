import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import type { Page } from '../types/api.types';
import type { TransactionFilters, TransactionResponse } from '../types/transaction.types';

const DEFAULT_FILTERS: TransactionFilters = {
  page: 0,
  size: 10,
};

interface UseTransactionsResult {
  page: Page<TransactionResponse> | null;
  filters: TransactionFilters;
  loading: boolean;
  error: string | null;
  setFilters: (filters: TransactionFilters) => void;
  refresh: () => void;
  removeTransaction: (id: number) => Promise<void>;
}

/**
 * Encapsula listagem, filtros, paginação e exclusão de transações.
 * Componentes de página apenas leem o estado e disparam ações, sem
 * conhecer detalhes de chamadas HTTP.
 */
export function useTransactions(
  initialFilters: TransactionFilters = DEFAULT_FILTERS,
): UseTransactionsResult {
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const [page, setPage] = useState<Page<TransactionResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    setError(null);
    transactionService
      .list(filters)
      .then(setPage)
      .catch(() => setError('Não foi possível carregar as transações.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const removeTransaction = async (id: number): Promise<void> => {
    await transactionService.remove(id);
    fetchTransactions();
  };

  return {
    page,
    filters,
    loading,
    error,
    setFilters,
    refresh: fetchTransactions,
    removeTransaction,
  };
}
