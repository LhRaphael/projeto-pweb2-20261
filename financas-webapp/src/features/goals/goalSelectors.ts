export const selectGoalProgress = (state: any, goalId: string): number => {
  const goals = state.goals?.items || [];
  const transactions = state.transactions?.items || [];

  const goal = goals.find((g: any) => g.id === goalId);
  if (!goal || !goal.targetAmount || goal.targetAmount <= 0) {
    return 0;
  }

  // Soma todas as transações de receita
  const totalIncome = transactions
    .filter((t: any) => t.type === 'INCOME')
    .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  const progress = (totalIncome / goal.targetAmount) * 100;

  // Garante limite máximo de 100% e mínimo de 0%
  return Math.min(100, Math.max(0, progress));
};
