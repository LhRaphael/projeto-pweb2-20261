/**
 * Converte uma data para o formato esperado pela API (yyyy-MM-dd),
 * usando os componentes locais da data (evita o bug clássico de
 * `toISOString()`, que converte para UTC e pode voltar um dia).
 */
export function toApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna a data atual já no formato yyyy-MM-dd, útil como valor padrão
 * em formulários de nova transação.
 */
export function today(): string {
  return toApiDate(new Date());
}

/**
 * Primeiro dia do mês corrente, no formato yyyy-MM-dd.
 * Usado para filtrar as transações do mês atual (Dashboard).
 */
export function firstDayOfCurrentMonth(): string {
  const now = new Date();
  return toApiDate(new Date(now.getFullYear(), now.getMonth(), 1));
}

/**
 * Último dia do mês corrente, no formato yyyy-MM-dd.
 */
export function lastDayOfCurrentMonth(): string {
  const now = new Date();
  return toApiDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
}

/**
 * Verifica se uma data no formato yyyy-MM-dd pertence ao mesmo
 * ano/mês de uma data de referência (padrão: hoje).
 */
export function isSameMonth(isoDate: string, reference: Date = new Date()): boolean {
  const [year, month] = isoDate.split('-').map(Number);
  return year === reference.getFullYear() && month === reference.getMonth() + 1;
}