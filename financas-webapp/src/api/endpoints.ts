/**
 * Centraliza as rotas da API. Evita strings "mágicas" espalhadas
 * pelos arquivos de acesso a dados (api/*).
 */
export const ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
  },
  categories: '/categories',
  transactions: {
    base: '/transactions',
    byId: (id: number) => `/transactions/${id}`,
  },
} as const;
