import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protege rotas que exigem autenticação. Enquanto a sessão está sendo
 * restaurada (loading), não redireciona, para evitar um "flash" de tela
 * de login em um usuário que já está autenticado.
 */
export function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
