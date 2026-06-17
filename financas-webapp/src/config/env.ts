/**
 * Configurações de ambiente da aplicação.
 * Centraliza o acesso a variáveis de ambiente para evitar
 * espalhar `import.meta.env` por todo o código.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
} as const;
