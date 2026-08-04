export interface SpendingLimitResponse {
  id: number;
  limitAmount: number;
  categoryId: number;
  categoryName: string;
}

export interface CreateSpendingLimitRequest {
  limitAmount: number;
  categoryId: number;
}
