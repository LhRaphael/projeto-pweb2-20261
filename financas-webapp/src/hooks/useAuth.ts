import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';

// Hook personalizado para acessar o contexto de autenticação
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
