import { describe, expect, it } from 'vitest';
import { buildSpendingLimitAlert } from './spendingLimitAlerts';

describe('buildSpendingLimitAlert', () => {
  it('retorna alerta de aviso para uso igual a 80%', () => {
    expect(
      buildSpendingLimitAlert({
        categoryName: 'Alimentação',
        spent: 80,
        limitAmount: 100,
        percentUsed: 80,
      }),
    ).toEqual({
      level: 'warning',
      message: 'A categoria Alimentação atingiu 80% do limite mensal.',
    });
  });

  it('retorna alerta de perigo para uso acima de 100%', () => {
    expect(
      buildSpendingLimitAlert({
        categoryName: 'Transporte',
        spent: 120,
        limitAmount: 100,
        percentUsed: 120,
      }),
    ).toEqual({
      level: 'danger',
      message: 'A categoria Transporte ultrapassou o limite mensal.',
    });
  });
});