export interface SpendingLimitAlertPayload {
  categoryName: string;
  spent: number;
  limitAmount: number;
  percentUsed: number;
}

export interface SpendingLimitAlert {
  level: 'warning' | 'danger';
  message: string;
}

export function buildSpendingLimitAlert(payload: SpendingLimitAlertPayload): SpendingLimitAlert | null {
  if (payload.percentUsed >= 100) {
    return {
      level: 'danger',
      message: `A categoria ${payload.categoryName} ultrapassou o limite mensal.`,
    };
  }

  if (payload.percentUsed >= 80) {
    return {
      level: 'warning',
      message: `A categoria ${payload.categoryName} atingiu ${payload.percentUsed.toFixed(0)}% do limite mensal.`,
    };
  }

  return null;
}
