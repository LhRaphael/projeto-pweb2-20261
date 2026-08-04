import { Link } from 'react-router-dom';
import { useGoals } from '../../hooks/useGoals';
import { useCategories } from '../../hooks/useCategories';
import { formatCurrency } from '../../utils/formatters';
import './GoalsListPage.css';

/**
 * RF05 — Página de listagem de metas financeiras.
 * Reaproveita o hook useGoals para exibir as metas carregadas em Redux
 * e permitir edição/exclusão diretamente na tela.
 */
export function GoalsListPage() {
  const { goals, loading, error, deleteGoal } = useGoals();
  const { categories } = useCategories();

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) {
      return 'Sem categoria';
    }

    const category = categories.find((item) => item.id === categoryId);
    return category?.name ?? 'Categoria desconhecida';
  };

  return (
    <div className="goals-list-container">
      <h1>Metas</h1>

      <Link to="/goals/new">Nova meta</Link>

      {loading && <p>Carregando...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && goals.length === 0 && (
        <p>Nenhuma meta cadastrada ainda.</p>
      )}

      {goals.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor alvo</th>
              <th>Data de início</th>
              <th>Prazo</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id}>
                <td>{goal.name}</td>
                <td>{formatCurrency(goal.targetAmount)}</td>
                <td>{goal.startDate}</td>
                <td>{goal.deadline}</td>
                <td>{getCategoryName(goal.categoryId)}</td>
                <td>
                  <Link to={`/goals/${goal.id}/edit`}>Editar</Link>
                  <button onClick={() => deleteGoal(goal.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}