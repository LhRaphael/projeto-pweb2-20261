import type { AuthenticatedUser } from '../types/auth.types';

const TOKEN_KEY = 'financas:token';
const USER_KEY = 'financas:user';

// Serviço de armazenamento local (localStorage) para sessão do usuário.
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
