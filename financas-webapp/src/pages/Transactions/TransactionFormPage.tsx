import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { transactionService } from '../../services/transactionService';
import { today } from '../../utils/dateUtils';
import type { TransactionRequest, TransactionType } from '../../types/transaction.types';

const EMPTY_FORM: TransactionRequest = {
  amount: 0,
  type: 'EXPENSE',
  categoryId: 0,
  date: today(),
  description: '',
  tag: '',
};

export function TransactionFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategories();

  const isEditing = id !== undefined;
  const [form, setForm] = useState<TransactionRequest>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    setError(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        await transactionService.update(Number(id), form);
      } else {
        await transactionService.create(form);
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
    <form onSubmit={handleSubmit}>
      <h1>{isEditing ? 'Editar transação' : 'Nova transação'}</h1>

      <label htmlFor="amount">Valor</label>
      <input
        id="amount"
        type="number"
        step="0.01"
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
  );
}
