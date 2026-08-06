import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGoals } from '../../hooks/useGoals';
import { useCategories } from '../../hooks/useCategories';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTransactions, selectTransactionItems } from '../../store/slices/transactionsSlice';
import { calculateGoalProgress } from '../../store/selectors/goalSelectors';
import { formatCurrency } from '../../utils/formatters';
import './GoalsListPage.css';

/** Verde / amarelo (>= 80%) / azul-completo quando a meta é atingida. */
function progressModifier(percent: number): string {
  if (percent >= 100) {
    return 'goal-progress-bar--complete';
  }

  if (percent >= 80) {
    return 'goal-progress-bar--warning';
  }

  return 'goal-progress-bar--ok';
}

/**
 * RF05 — Página de listagem de metas financeiras.
 * Reaproveita o hook useGoals para exibir as metas carregadas em Redux
 * e permitir edição/exclusão diretamente na tela. O progresso de cada
 * meta é derivado (via calculateGoalProgress/selectGoalProgress) a
 * partir das receitas do transactionsSlice, carregadas aqui sem filtro
 * de data — cada meta tem seu próprio período (startDate–deadline).
 */
export function GoalsListPage() {
  const { goals, loading, error, deleteGoal } = useGoals();
  const { categories } = useCategories();

  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactionItems);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        type: 'INCOME',
        page: 0,
        size: 500,
        sort: 'date,desc',
      }),
    );
  }, [dispatch]);

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
              <th>Progresso</th>
              <th>Data de início</th>
              <th>Prazo</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => {
              const percent = calculateGoalProgress(goal, transactions);

              return (
                <tr key={goal.id}>
                  <td>{goal.name}</td>
                  <td>{formatCurrency(goal.targetAmount)}</td>
                  <td>
                    <div className="goal-progress-cell">
                      <div
                        className="goal-progress-track"
                        role="progressbar"
                        aria-valuenow={Math.round(percent)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progresso da meta ${goal.name}`}
                      >
                        <div
                          className={`goal-progress-bar ${progressModifier(percent)}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="goal-progress-label">{percent.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td>{goal.startDate}</td>
                  <td>{goal.deadline}</td>
                  <td>{getCategoryName(goal.categoryId)}</td>
                  <td>
                    <Link to={`/goals/${goal.id}/edit`}>Editar</Link>
                    <button onClick={() => deleteGoal(goal.id)}>Excluir</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
