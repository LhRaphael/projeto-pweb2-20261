import { describe, it, expect } from 'vitest';
import { selectGoalProgress } from './goalSelectors';

describe('selectGoalProgress', () => {
  const goalId = 'goal-1';

  it('Cenário 1: deve retornar 0% quando não houver receitas acumuladas', () => {
    const mockState = {
      goals: {
        items: [{ id: goalId, name: 'Reserva de Emergência', targetAmount: 1000, targetDate: '2026-12-31' }],
      },
      transactions: {
        items: [], // Sem transações/receitas
      },
    };

    const progress = selectGoalProgress(mockState as any, goalId);
    expect(progress).toBe(0);
  });

  it('Cenário 2: deve calcular o progresso parcial corretamente', () => {
    const mockState = {
      goals: {
        items: [{ id: goalId, name: 'Reserva de Emergência', targetAmount: 1000, targetDate: '2026-12-31' }],
      },
      transactions: {
        items: [
          { id: 't1', type: 'INCOME', amount: 500 }, // 500 / 1000 = 50%
        ],
      },
    };

    const progress = selectGoalProgress(mockState as any, goalId);
    expect(progress).toBe(50);
  });

  it('Cenário 3: deve indicar 100% quando a meta for atingida ou ultrapassada', () => {
    const mockState = {
      goals: {
        items: [{ id: goalId, name: 'Reserva de Emergência', targetAmount: 1000, targetDate: '2026-12-31' }],
      },
      transactions: {
        items: [
          { id: 't1', type: 'INCOME', amount: 1200 }, // 1200 / 1000 >= 100%
        ],
      },
    };

    const progress = selectGoalProgress(mockState as any, goalId);
    expect(progress).toBe(100);
  });
});