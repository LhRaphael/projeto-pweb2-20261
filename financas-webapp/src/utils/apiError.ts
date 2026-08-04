import { AxiosError } from 'axios';

/**
 * Extrai uma mensagem de erro amigável a partir de um erro do Axios,
 * priorizando a mensagem enviada pela API quando disponível e recorrendo
 * a uma mensagem padrão (fallback) em qualquer outro caso.
 */
export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
    if (apiMessage) return apiMessage;
  }
  return fallback;
}