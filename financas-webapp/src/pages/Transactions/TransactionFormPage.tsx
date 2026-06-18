import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useAppDispatch } from '../../store/hooks';
import { createTransaction, updateTransaction } from '../../store/slices/transactionsSlice';
import { transactionService } from '../../services/transactionService';
import { today } from '../../utils/dateUtils';
import { validators } from '../../utils/validators';
import type { TransactionRequest, TransactionType } from '../../types/transaction.types';
import './TransactionFormPage.css';

const EMPTY_FORM: TransactionRequest = {
  amount: 0,
  type: 'EXPENSE',
  categoryId: 0,
  date: today(),
  description: '',
  tag: '',
};

/**
 * Validação explícita dos campos obrigatórios (RF02), independente da
 * validação nativa do HTML — garante que o formulário não seja
 * submetido com valor inválido, categoria não selecionada ou data vazia.
 */
function validateForm(form: TransactionRequest): string | null {
  if (!validators.isPositiveNumber(form.amount)) {
    return 'Informe um valor maior que zero.';
  }
  if (form.categoryId === 0) {
    return 'Selecione uma categoria.';
  }
  if (!validators.isValidDate(form.date)) {
    return 'Informe uma data válida.';
  }
  return null;
}

export function TransactionFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useCategories();

  const isEditing = id !== undefined;
  const [form, setForm] = useState<TransactionRequest>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Carrega a transação a ser editada. Trata-se de uma leitura pontual,
  // por isso não passa pelo transactionsSlice (que guarda apenas a
  // página atual da listagem) — apenas pelo service.
  useEffect(() => {
    if (!isEditing) return;

    transactionService
      .getById(Number(id))
      .then((transaction) => {
        setForm({
          amount: transaction.amount,
          type: transaction.type,
          categoryId: transaction.categoryId,
          date: transaction.date,
          description: transaction.description,
          tag: transaction.tag,
        });
      })
      .catch(() => setError('Não foi possível carregar a transação.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const updateField = <K extends keyof TransactionRequest>(
    field: K,
    value: TransactionRequest[K],
  ): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        await dispatch(updateTransaction({ id: Number(id), data: form })).unwrap();
      } else {
        await dispatch(createTransaction(form)).unwrap();
      }
      navigate('/transactions');
    } catch {
      setError('Não foi possível salvar a transação. Verifique os dados informados.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="transaction-form-container">
      <form onSubmit={handleSubmit}>
        <h1>{isEditing ? 'Editar transação' : 'Nova transação'}</h1>

        <label htmlFor="amount">Valor</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={(e) => updateField('amount', Number(e.target.value))}
          required
        />

        <label htmlFor="type">Tipo</label>
        <select
          id="type"
          value={form.type}
          onChange={(e) => updateField('type', e.target.value as TransactionType)}
        >
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>

        <label htmlFor="categoryId">Categoria</label>
        <select
          id="categoryId"
          value={form.categoryId}
          onChange={(e) => updateField('categoryId', Number(e.target.value))}
          required
        >
          <option value={0} disabled>
            Selecione...
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="date">Data</label>
        <input
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => updateField('date', e.target.value)}
          required
        />

        <label htmlFor="description">Descrição</label>
        <input
          id="description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />

        <label htmlFor="tag">Tag</label>
        <input id="tag" value={form.tag} onChange={(e) => updateField('tag', e.target.value)} />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
