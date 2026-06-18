import { Link } from 'react-router-dom';
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { formatCurrency } from '../../utils/formatters';
import type { TransactionType } from '../../types/transaction.types';

export function TransactionsListPage() {
  const { page, filters, setFilters, loading, error, removeTransaction } = useTransactions();
  const { categories } = useCategories();

  const handleTypeChange = (value: string): void => {
    setFilters({
      ...filters,
      page: 0,
      type: value === '' ? undefined : (value as TransactionType),
    });
  };

  const handleCategoryChange = (value: string): void => {
    setFilters({
      ...filters,
      page: 0,
      categoryId: value === '' ? undefined : Number(value),
    });
  };

  const goToPage = (nextPage: number): void => {
    setFilters({ ...filters, page: nextPage });
  };

  return (
    <div>
      <h1>Transações</h1>

      <Link to="/transactions/new">Nova transação</Link>

      <div>
        <label htmlFor="type-filter">Tipo</label>
        <select id="type-filter" onChange={(e) => handleTypeChange(e.target.value)}>
          <option value="">Todos</option>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>

        <label htmlFor="category-filter">Categoria</label>
        <select id="category-filter" onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p role="alert">{error}</p>}

      {page && (
        <>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {page.content.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.categoryName}</td>
                  <td>{transaction.type}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>
                    <Link to={`/transactions/${transaction.id}/edit`}>Editar</Link>
                    <button onClick={() => removeTransaction(transaction.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <button disabled={page.number === 0} onClick={() => goToPage(page.number - 1)}>
              Anterior
            </button>
            <span>
              Página {page.number + 1} de {Math.max(page.totalPages, 1)}
            </span>
            <button
              disabled={page.number + 1 >= page.totalPages}
              onClick={() => goToPage(page.number + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
