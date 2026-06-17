import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Olá, {user?.name}</h1>
      <nav>
        <Link to="/transactions">Ver transações</Link>
      </nav>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
