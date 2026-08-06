import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  login as loginThunk,
  register as registerThunk,
  logout as logoutAction,
  selectAuthUser,
  selectAuthInitialized,
  selectAuthLoading,
  selectAuthError,
} from '../store/slices/authSlice';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

/**
 * Hook de acesso à autenticação. Encapsula os thunks `login`/`register`
 * (RF01) e os selectors do authSlice, mantendo os componentes de página
 * desacoplados de detalhes do Redux.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const initialized = useAppSelector(selectAuthInitialized);
  const requestLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(
    async (data: LoginRequest): Promise<void> => {
      await dispatch(loginThunk(data)).unwrap();
    },
    [dispatch],
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<void> => {
      await dispatch(registerThunk(data)).unwrap();
    },
    [dispatch],
  );

  const logout = useCallback((): void => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    isAuthenticated: user !== null,
    // Enquanto a sessão local não foi restaurada, tratamos como "carregando"
    // para o ProtectedRoute não redirecionar precocemente para /login.
    loading: !initialized || requestLoading,
    error,
    login,
    register,
    logout,
  };
}