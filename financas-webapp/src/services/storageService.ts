import type { AuthenticatedUser } from '../types/auth.types';

const TOKEN_KEY = 'financas:token';
const USER_KEY = 'financas:user';

/**
 * Abstrai o mecanismo de persistência da sessão (atualmente localStorage).
 * Caso seja necessário trocar para sessionStorage, cookies, etc., basta
 * alterar este arquivo — o restante da aplicação não conhece o detalhe
 * de implementação.
 */
export const storageService = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  getUser: (): AuthenticatedUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthenticatedUser;
    } catch {
      return null;
    }
  },

  saveSession: (token: string, user: AuthenticatedUser): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
