import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useGoals } from '../../hooks/useGoals';
import { today } from '../../utils/dateUtils';
import { validators } from '../../utils/validators';
import './GoalFormPage.css';

import type {
  CreateGoalRequest,
  UpdateGoalRequest,
} from '../../types/goal.types';

const EMPTY_FORM: CreateGoalRequest = {
  name: '',
  targetAmount: 0,
  startDate: today(),
  deadline: today(),
  categoryId: undefined,
};

/**
 * Validação mínima do formulário de metas.
 * Garante que o nome seja informado, o valor alvo seja positivo
 * e a data de prazo tenha um formato válido.
 */
function validateForm(form: CreateGoalRequest): string | null {
  if (!form.name.trim()) {
    return 'Informe o nome da meta.';
  }

  if (!validators.isPositiveNumber(form.targetAmount)) {
    return 'Informe um valor alvo maior que zero.';
  }

  if (!validators.isValidDate(form.deadline)) {
    return 'Informe uma data de prazo válida.';
  }

  return null;
}

export function GoalFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { goals, createGoal, updateGoal, loading, error } = useGoals();

  const isEditing = id !== undefined;
  const [form, setForm] = useState<CreateGoalRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const selectedGoal = goals.find((goal) => goal.id === Number(id));

    if (!selectedGoal) {
      setPageError('Meta não encontrada.');
      return;
    }

    setForm({
      name: selectedGoal.name,
      targetAmount: selectedGoal.targetAmount,
      startDate: selectedGoal.startDate,
      deadline: selectedGoal.deadline,
      categoryId: selectedGoal.categoryId ?? undefined,
    });
  }, [goals, id, isEditing]);

  const updateField = <K extends keyof CreateGoalRequest>(
    field: K,
    value: CreateGoalRequest[K],
  ): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

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
      if (isEditing) {
        await updateGoal(Number(id), form as UpdateGoalRequest);
      } else {
        await createGoal(form);
      }

      navigate('/goals');
    } catch {
      setPageError('Não foi possível salvar a meta. Verifique os dados informados.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEditing) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="goal-form-container">
      <form onSubmit={handleSubmit}>
        <h1>{isEditing ? 'Editar meta' : 'Nova meta'}</h1>

        <label htmlFor="name">Nome</label>
        <input
          id="name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          required
        />

        <label htmlFor="targetAmount">Valor alvo</label>
        <input
          id="targetAmount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.targetAmount}
          onChange={(event) =>
            updateField('targetAmount', Number(event.target.value))
          }
          required
        />

        <label htmlFor="startDate">Data de início</label>
        <input
          id="startDate"
          type="date"
          value={form.startDate ?? today()}
          onChange={(event) => updateField('startDate', event.target.value)}
        />

        <label htmlFor="deadline">Prazo</label>
        <input
          id="deadline"
          type="date"
          value={form.deadline}
          onChange={(event) => updateField('deadline', event.target.value)}
          required
        />

        <label htmlFor="categoryId">Categoria</label>
        <select
          id="categoryId"
          value={form.categoryId ?? ''}
          onChange={(event) =>
            updateField('categoryId', event.target.value ? Number(event.target.value) : undefined)
          }
        >
          <option value="">Selecione...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {(error || pageError) && <p role="alert">{error ?? pageError}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}