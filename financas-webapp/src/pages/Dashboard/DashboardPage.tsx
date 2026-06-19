import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import { formatCurrency } from '../../utils/formatters';
import './DashboardPage.css';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { summary, recent, loading, error } = useDashboardSummary();

  return (
    <div className="dashboard-container">
      {/* Barra superior de navegação e contexto do usuário */}
      <header className="dashboard-header">
        <h1>Olá, {user?.name}</h1>
        <div className="header-actions">
          <nav>
            <Link to="/transactions" className="nav-link">Ver transações</Link>
          </nav>
          <button onClick={logout} className="logout-button">Sair</button>
        </div>
      </header>

      <main className="dashboard-content">
        {loading && <p className="status-message">Carregando resumo do mês...</p>}
        {error && <p role="alert" className="status-message">{error}</p>}

        {!loading && !error && (
          <>
            {/* Seção dos blocos de Saldo, Receitas e Despesas */}
            <section className="dashboard-section">
              <h2>Resumo do mês</h2>
              <dl className="summary-grid">
                <div className="summary-card card-balance">
                  <dt>Saldo</dt>
                  <dd>{formatCurrency(summary.balance)}</dd>
                </div>

                <div className="summary-card card-income">
                  <dt>Receitas</dt>
                  <dd>{formatCurrency(summary.income)}</dd>
                </div>

                <div className="summary-card card-expense">
                  <dt>Despesas</dt>
                  <dd>{formatCurrency(summary.expense)}</dd>
                </div>
              </dl>
            </section>

            {/* Seção da lista de transações recentes */}
            <section className="dashboard-section">
              <h2>Transações recentes</h2>
              {recent.length === 0 ? (
                <p className="status-message">Nenhuma transação registrada ainda.</p>
              ) : (
                <ul className="transactions-list">
                  {recent.map((transaction) => {
                    const isIncome = transaction.type?.toUpperCase() === 'RECEITA' || transaction.type?.toUpperCase() === 'INCOME';

                    return (
                      <li key={transaction.id} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-main">{transaction.categoryName}</span>
                          <span className="transaction-meta">{transaction.date} • {transaction.type}</span>
                        </div>
                        <span className={`transaction-amount ${isIncome ? 'amount-receita' : 'amount-despesa'}`}>
                          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}