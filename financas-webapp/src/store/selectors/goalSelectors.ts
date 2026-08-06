import { createSelector } from '@reduxjs/toolkit';
import { selectGoals } from '../slices/goalsSlice';
import { selectTransactionItems } from '../slices/transactionsSlice';
import type { GoalResponse } from '../../types/goal.types';
import type { TransactionResponse } from '../../types/transaction.types';

/**
 * RF05 — Soma as receitas (INCOME) registradas dentro do período da
 * meta (startDate–deadline, inclusive) e, quando a meta tem categoria
 * definida, restritas a essa categoria. O percentual é limitado a
 * 100% — uma meta "atingida" não ultrapassa isso na exibição.
 */
export function calculateGoalProgress(
  goal: GoalResponse,
  transactions: TransactionResponse[],
): number {
  if (goal.targetAmount <= 0) {
    return 0;
  }

  const relevantIncome = transactions
    .filter((transaction) => transaction.type === 'INCOME')
    .filter(
      (transaction) =>
        transaction.date >= goal.startDate && transaction.date <= goal.deadline,
    )
    .filter(
      (transaction) =>
        goal.categoryId === null || transaction.categoryId === goal.categoryId,
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const percent = (relevantIncome / goal.targetAmount) * 100;

  return Math.min(Math.max(percent, 0), 100);
}

/**
 * RF05 — Selector derivado que calcula o percentual atingido de uma
 * meta específica, cruzando o goalsSlice com o transactionsSlice, sem
 * slice próprio para o progresso. Como selectors do Redux Toolkit não
 * são parametrizados nativamente, `selectGoalProgress(goalId)` retorna
 * uma nova instância memoizada por chamada.
 */
export const selectGoalProgress = (goalId: number) =>
  createSelector([selectGoals, selectTransactionItems], (goals, transactions): number => {
    const goal = goals.find((item) => item.id === goalId);

    if (!goal) {
      return 0;
    }

    return calculateGoalProgress(goal, transactions);
  });
