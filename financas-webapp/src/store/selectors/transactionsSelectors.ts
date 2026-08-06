import { createSelector } from '@reduxjs/toolkit';
import { selectTransactionItems } from '../slices/transactionsSlice';
import { isSameMonth } from '../../utils/dateUtils';
import type { TransactionResponse } from '../../types/transaction.types';

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

/**
 * RF03 — Filtra, a partir da lista de transações já carregada no slice
 * `transactions`, apenas as que pertencem ao mês corrente. Não existe
 * slice próprio para o Dashboard: este selector deriva tudo a partir do
 * estado de `transactions` (populado via fetchTransactions com o filtro
 * de data do mês atual — ver hooks/useDashboardSummary).
 */
export const selectCurrentMonthTransactions = createSelector(
  [selectTransactionItems],
  (items): TransactionResponse[] => items.filter((transaction) => isSameMonth(transaction.date)),
);

/**
 * RF03 — Saldo, total de receitas e total de despesas do mês corrente,
 * recalculados automaticamente sempre que `transactions.items` mudar
 * (por exemplo, após a criação de uma nova transação).
 */
export const selectMonthlySummary = createSelector(
  [selectCurrentMonthTransactions],
  (monthTransactions): MonthlySummary => {
    const totals = monthTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'INCOME') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );

    return { ...totals, balance: totals.income - totals.expense };
  },
);

/**
 * RF03 — As 5 transações mais recentes, derivadas da mesma lista usada
 * no restante da aplicação.
 */
export const selectRecentTransactions = createSelector(
  [selectTransactionItems],
  (items): TransactionResponse[] =>
    [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
);