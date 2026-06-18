import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions, selectTransactionsStatus, selectTransactionsError } from '../store/slices/transactionsSlice';
import { selectMonthlySummary, selectRecentTransactions } from '../store/selectors/transactionsSelectors';
import { firstDayOfCurrentMonth, lastDayOfCurrentMonth } from '../utils/dateUtils';

/**
 * Tamanho de página usado para carregar as transações do mês corrente.
 *
 * Observação: a API só expõe paginação simples (sem um endpoint de
 * agregação), então o Dashboard carrega até este número de transações
 * do mês via fetchTransactions (mesmo thunk usado pela listagem) e
 * deriva os totais por selector — sem slice próprio, como pede o RF03.
 * Para um volume muito maior de transações por mês, o ideal seria a API
 * expor um endpoint de resumo/agregação.
 */
const MONTHLY_FETCH_SIZE = 200;

/**
 * RF03 — Carrega as transações do mês corrente (reaproveitando o
 * transactionsSlice) e expõe o resumo financeiro (saldo, receitas,
 * despesas) e as 5 transações mais recentes, via selectors derivados.
 */
export function useDashboardSummary() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectTransactionsStatus);
  const error = useAppSelector(selectTransactionsError);
  const summary = useAppSelector(selectMonthlySummary);
  const recent = useAppSelector(selectRecentTransactions);

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

  return {
    summary,
    recent,
    loading: status === 'loading',
    error,
  };
}
