/**
 * Formata um número como moeda brasileira (R$).
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
