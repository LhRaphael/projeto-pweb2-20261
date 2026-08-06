import { useState, type FormEvent } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useSpendingLimits } from '../../hooks/useSpendingLimits';
import { formatCurrency } from '../../utils/formatters';
import { validators } from '../../utils/validators';
import './SpendingLimitsPage.css';

import type { CreateSpendingLimitRequest } from '../../types/spendingLimit.types';

const EMPTY_FORM: CreateSpendingLimitRequest = {
  limitAmount: 0,
  categoryId: 0,
};

/**
 * Validação mínima do formulário de limites: categoria obrigatória e
 * valor-limite positivo.
 */
function validateForm(form: CreateSpendingLimitRequest): string | null {
  if (!form.categoryId) {
    return 'Selecione uma categoria.';
  }

  if (!validators.isPositiveNumber(form.limitAmount)) {
    return 'Informe um valor de limite maior que zero.';
  }

  return null;
}

/** Verde / amarelo (>= 80%) / vermelho (>= 100%), conforme o RF06. */
function progressModifier(percentUsed: number): string {
  if (percentUsed >= 100) {
    return 'limit-progress-bar--danger';
  }

  if (percentUsed >= 80) {
    return 'limit-progress-bar--warning';
  }

  return 'limit-progress-bar--ok';
}

/**
 * RF06 — Tela única de gerenciamento de limites de gastos: cadastro de
 * um limite mensal por categoria e acompanhamento do progresso de
 * gastos vs. limite (verde / amarelo >= 80% / vermelho >= 100%), via o
 * selector derivado selectSpendingStatus (useSpendingLimits).
 */
export function SpendingLimitsPage() {
  const { categories } = useCategories();
  const {
    limits,
    spendingStatus,
    loading,
    error,
    createSpendingLimit,
    deleteSpendingLimit,
  } = useSpendingLimits();

  const [form, setForm] = useState<CreateSpendingLimitRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const updateField = <K extends keyof CreateSpendingLimitRequest>(
    field: K,
    value: CreateSpendingLimitRequest[K],
  ): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const getStatus = (categoryId: number) =>
    spendingStatus.find((status) => status.categoryId === categoryId);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const validationError = validateForm(form);
    if (validationError) {
      setPageError(validationError);
      return;
    }

    setPageError(null);
    setSubmitting(true);

    try {
      await createSpendingLimit(form);
      setForm(EMPTY_FORM);
    } catch {
      setPageError(
        'Não foi possível salvar o limite. Verifique se já não existe um limite para esta categoria.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="spending-limits-container">
      <h1>Limites de Gastos</h1>

      <form className="spending-limit-form" onSubmit={handleSubmit}>
        <label htmlFor="categoryId">Categoria</label>
        <select
          id="categoryId"
          value={form.categoryId || ''}
          onChange={(event) =>
            updateField(
              'categoryId',
              event.target.value ? Number(event.target.value) : 0,
            )
          }
          required
        >
          <option value="">Selecione...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="limitAmount">Valor-limite (mensal)</label>
        <input
          id="limitAmount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.limitAmount || ''}
          onChange={(event) =>
            updateField('limitAmount', Number(event.target.value))
          }
          required
        />

        {(error || pageError) && <p role="alert">{error ?? pageError}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Adicionar limite'}
        </button>
      </form>

      {loading && <p>Carregando...</p>}

      {!loading && limits.length === 0 && (
        <p>Nenhum limite cadastrado ainda.</p>
      )}

      {limits.length > 0 && (
        <ul className="spending-limits-list">
          {limits.map((limit) => {
            const status = getStatus(limit.categoryId);
            const percentUsed = status?.percentUsed ?? 0;
            const spent = status?.spent ?? 0;

            return (
              <li key={limit.id} className="spending-limit-item">
                <div className="spending-limit-item-header">
                  <span className="spending-limit-category">
                    {limit.categoryName}
                  </span>
                  <button onClick={() => deleteSpendingLimit(limit.id)}>
                    Excluir
                  </button>
                </div>

                <div className="limit-progress-track">
                  <div
                    className={`limit-progress-bar ${progressModifier(percentUsed)}`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>

                <div className="spending-limit-item-footer">
                  <span>
                    {formatCurrency(spent)} de {formatCurrency(limit.limitAmount)}
                  </span>
                  <span>{percentUsed.toFixed(0)}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}