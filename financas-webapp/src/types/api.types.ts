/**
 * Estrutura genérica de uma página retornada pela API
 * (equivalente ao Page<T> do Spring Data).
 */
export interface Page<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  content: T[];
}

/**
 * Formato padrão de erro retornado pela API.
 * Útil para tipar erros tratados nos serviços, quando necessário.
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
}