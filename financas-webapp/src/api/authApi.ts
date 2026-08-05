import { httpClient } from './httpClient';
import { ENDPOINTS } from './endpoints';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';

/**
 * Camada de acesso a dados (repository) para autenticação.
 * Responsável apenas por falar com a API, sem nenhuma regra de negócio.
 */
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>(ENDPOINTS.auth.register, data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>(ENDPOINTS.auth.login, data);
    return response.data;
  },
};
