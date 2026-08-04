/**
 * Validações simples e reutilizáveis para formulários. Mantidas
 * independentes de qualquer biblioteca de formulário específica.
 */
export const validators = {
  isRequired: (value: string): boolean => value.trim().length > 0,

  isPositiveNumber: (value: number): boolean => Number.isFinite(value) && value > 0,

  isValidDate: (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value),
};