export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  name: string;
}

/**
 * Representa o usuário autenticado mantido em memória/armazenamento local.
 * Não inclui o token, que é tratado separadamente pelo storageService.
 */
export interface AuthenticatedUser {
  id: number;
  username: string;
  name: string;
}
