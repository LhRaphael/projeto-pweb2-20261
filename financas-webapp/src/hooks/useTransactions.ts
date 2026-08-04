import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTransactions,
  removeTransaction as removeTransactionThunk,
  setFilters as setFiltersAction,
  selectTransactionItems,
  selectTransactionFilters,
  selectTransactionPageMeta,
  selectTransactionsStatus,
  selectTransactionsError,
} from '../store/slices/transactionsSlice';
import type { TransactionFilters } from '../types/transaction.types';

/**
 * RF02 — Encapsula listagem, filtros, paginação e exclusão de transações
 * a partir do transactionsSlice. Refaz a busca automaticamente sempre
 * que os filtros mudam, mantendo no estado apenas a página atual.
 */
export function useTransactions() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectTransactionItems);
  const filters = useAppSelector(selectTransactionFilters);
  const pageMeta = useAppSelector(selectTransactionPageMeta);
  const status = useAppSelector(selectTransactionsStatus);
  const error = useAppSelector(selectTransactionsError);

  useEffect(() => {
    dispatch(fetchTransactions(filters));
  }, [filters, dispatch]);

  const setFilters = useCallback(
    (next: TransactionFilters): void => {
      dispatch(setFiltersAction(next));
    },
    [dispatch],
  );

  const refresh = useCallback((): void => {
    dispatch(fetchTransactions(filters));
  }, [dispatch, filters]);

  const removeTransaction = useCallback(
    async (id: number): Promise<void> => {
      await dispatch(removeTransactionThunk(id)).unwrap();
    },
    [dispatch],
  );

  return {
    // Mantém o mesmo formato de Page<TransactionResponse> usado pelas páginas.
    page: { content: items, ...pageMeta },
    filters,
    loading: status === 'loading',
    error,
    setFilters,
    refresh,
    removeTransaction,
  };
}