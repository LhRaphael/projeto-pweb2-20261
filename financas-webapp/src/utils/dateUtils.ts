// Utilitários relacionados a manipulação de datas.
export function toApiDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
// Função utilitária para obter a data atual no formato da API.
export function today(): string {
  return toApiDate(new Date());
}
