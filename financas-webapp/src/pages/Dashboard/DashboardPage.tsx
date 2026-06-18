import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import { formatCurrency } from '../../utils/formatters';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { summary, recent, loading, error } = useDashboardSummary();

  return (
    <div>
      <h1>Olá, {user?.name}</h1>

      <nav>
        <Link to="/transactions">Ver transações</Link>
      </nav>

      {loading && <p>Carregando resumo do mês...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <section>
            <h2>Resumo do mês</h2>
            <dl>
              <dt>Saldo</dt>
              <dd>{formatCurrency(summary.balance)}</dd>

              <dt>Receitas</dt>
              <dd>{formatCurrency(summary.income)}</dd>

              <dt>Despesas</dt>
              <dd>{formatCurrency(summary.expense)}</dd>
            </dl>
          </section>

          <section>
            <h2>Transações recentes</h2>
            {recent.length === 0 ? (
              <p>Nenhuma transação registrada ainda.</p>
            ) : (
              <ul>
                {recent.map((transaction) => (
                  <li key={transaction.id}>
                    {transaction.date} — {transaction.type} — {formatCurrency(transaction.amount)} (
                    {transaction.categoryName})
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <button onClick={logout}>Sair</button>
    </div>
  );
}
