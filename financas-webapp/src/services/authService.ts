import { authApi } from '../api/authApi';
import { storageService } from './storageService';
import type { AuthenticatedUser, LoginRequest, RegisterRequest } from '../types/auth.types';

/**
 * Camada de serviço (facade): orquestra a chamada à API de autenticação
 * com a persistência da sessão local. É essa camada que o authSlice do
 * Redux consome — nunca diretamente o api/authApi.
 */
export const authService = {
  register: async (data: RegisterRequest): Promise<AuthenticatedUser> => {
    const response = await authApi.register(data);
    const user: AuthenticatedUser = {
      id: response.id,
      username: response.username,
      name: response.name,
    };
    storageService.saveSession(response.token, user);
    return user;
  },

  login: async (data: LoginRequest): Promise<AuthenticatedUser> => {
    const response = await authApi.login(data);
    const user: AuthenticatedUser = {
      id: response.id,
      username: response.username,
      name: response.name,
    };
    storageService.saveSession(response.token, user);
    return user;
  },

  logout: (): void => {
    storageService.clearSession();
  },

  getCurrentUser: (): AuthenticatedUser | null => storageService.getUser(),

  isAuthenticated: (): boolean => storageService.getToken() !== null,
};