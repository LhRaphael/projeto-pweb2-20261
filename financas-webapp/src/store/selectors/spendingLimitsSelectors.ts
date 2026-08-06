import { createSelector } from '@reduxjs/toolkit';
import { selectSpendingLimits } from '../slices/spendingLimitsSlice';
import { selectCurrentMonthTransactions } from './transactionsSelectors';
import type { TransactionResponse } from '../../types/transaction.types';

export interface SpendingStatus {
  categoryId: number;
  categoryName: string;
  limitAmount: number;
  spent: number;
  percentUsed: number;
}

/**
 * RF06 — Cruza os limites de gastos cadastrados (spendingLimitsSlice) com
 * as despesas do mês corrente já carregadas no transactionsSlice
 * (mesmo mecanismo usado pelo Dashboard/RF03) e retorna, para cada
 * limite, quanto já foi gasto na categoria e o percentual do limite
 * consumido. Não existe slice próprio para este cálculo: tudo é
 * derivado a partir de spendingLimits + transactions.
 */
export const selectSpendingStatus = createSelector(
  [selectSpendingLimits, selectCurrentMonthTransactions],
  (limits, monthTransactions): SpendingStatus[] => {
    const spentByCategory = monthTransactions.reduce<Record<number, number>>(
      (acc, transaction: TransactionResponse) => {
        if (transaction.type === 'EXPENSE') {
          acc[transaction.categoryId] =
            (acc[transaction.categoryId] ?? 0) + transaction.amount;
        }
        return acc;
      },
      {},
    );

    return limits.map((limit) => {
      const spent = spentByCategory[limit.categoryId] ?? 0;
      const percentUsed =
        limit.limitAmount > 0 ? (spent / limit.limitAmount) * 100 : 0;

      return {
        categoryId: limit.categoryId,
        categoryName: limit.categoryName,
        limitAmount: limit.limitAmount,
        spent,
        percentUsed,
      };
    });
  },
);