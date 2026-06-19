import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedLayout } from '../components/ProtectedLayout/ProtectedLayout';

/**
 * RF01 — Bloqueia o acesso a rotas privadas enquanto o usuário não
 * estiver autenticado, redirecionando para `/login`. Enquanto a sessão
 * local ainda está sendo restaurada (loading), não redireciona, para
 * evitar um "flash" de tela de login em um usuário já autenticado.
 */
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}