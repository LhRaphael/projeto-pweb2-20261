import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthenticatedUser, LoginRequest, RegisterRequest } from '../types/auth.types';

export interface AuthContextValue {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provedor de estado de autenticação. Mantém o usuário atual em memória
 * (sincronizado com o storageService) e expõe as ações de login/registro/
 * logout para o restante da aplicação via Context API.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao montar a aplicação, recupera uma sessão já existente (refresh da página).
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest): Promise<void> => {
    const authenticatedUser = await authService.login(data);
    setUser(authenticatedUser);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    const authenticatedUser = await authService.register(data);
    setUser(authenticatedUser);
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
