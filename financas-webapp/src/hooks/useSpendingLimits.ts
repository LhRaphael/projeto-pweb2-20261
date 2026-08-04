import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchSpendingLimits,
  createSpendingLimit as createSpendingLimitThunk,
  deleteSpendingLimit as deleteSpendingLimitThunk,
  selectSpendingLimits,
  selectSpendingLimitsStatus,
  selectSpendingLimitsError,
} from '../store/slices/spendingLimitsSlice';
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { selectSpendingStatus } from '../store/selectors/spendingLimitsSelectors';
import type { SpendingStatus } from '../store/selectors/spendingLimitsSelectors';
import { firstDayOfCurrentMonth, lastDayOfCurrentMonth } from '../utils/dateUtils';
import type { CreateSpendingLimitRequest } from '../types/spendingLimit.types';

/**
 * Mesmo tamanho de página usado pelo Dashboard (useDashboardSummary):
 * carrega as transações do mês corrente para permitir o cálculo do
 * selector selectSpendingStatus (limites x gastos), sem slice próprio.
 */
const MONTHLY_FETCH_SIZE = 200;

/**
 * RF06 — Encapsula a leitura, criação e exclusão de limites de gastos
 * a partir do spendingLimitsSlice, e garante que as transações do mês
 * corrente estejam carregadas no transactionsSlice para que o selector
 * selectSpendingStatus possa cruzar limites x gastos.
 */
export function useSpendingLimits() {
  const dispatch = useAppDispatch();
  const limits = useAppSelector(selectSpendingLimits);
  const status = useAppSelector(selectSpendingLimitsStatus);
  const error = useAppSelector(selectSpendingLimitsError);
  const spendingStatus: SpendingStatus[] = useAppSelector(selectSpendingStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSpendingLimits());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        startDate: firstDayOfCurrentMonth(),
        endDate: lastDayOfCurrentMonth(),
        page: 0,
        size: MONTHLY_FETCH_SIZE,
        sort: 'date,desc',
      }),
    );
  }, [dispatch]);

  const createSpendingLimit = useCallback(
    async (data: CreateSpendingLimitRequest): Promise<void> => {
      await dispatch(createSpendingLimitThunk(data)).unwrap();
    },
    [dispatch],
  );

  const deleteSpendingLimit = useCallback(
    async (id: number): Promise<void> => {
      await dispatch(deleteSpendingLimitThunk(id)).unwrap();
    },
    [dispatch],
  );

  return {
    limits,
    spendingStatus,
    loading: status === 'loading' || status === 'idle',
    error,
    createSpendingLimit,
    deleteSpendingLimit,
  };
}
