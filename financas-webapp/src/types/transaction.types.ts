export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionResponse {
  id: number;
  amount: number;
  type: TransactionType;
  categoryId: number;
  categoryName: string;
  date: string; // ano-mes-dia
  description: string;
  tag: string;
}

/**
 * Payload utilizado tanto na criação quanto na atualização de uma
 * transação (o corpo da requisição é igual em ambos os casos na API).
 */
export interface TransactionRequest {
  amount: number;
  type: TransactionType;
  categoryId: number;
  date: string; // ano-mes-dia
  description: string;
  tag: string;
}

/**
 * Filtros e parâmetros de paginação aceitos por GET /transactions.
 */
export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
  sort?: string;
}
