import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { storageService } from '../services/storageService';

/**
 * Instância única (singleton) do cliente HTTP utilizada por toda a
 * aplicação. Centralizar a criação aqui garante configuração consistente
 * de baseURL, headers e interceptors em todas as chamadas à API.
 */
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de requisição: injeta o token JWT (quando existir) em
 * todas as chamadas, sem que cada arquivo de api/ precise se preocupar
 * com autenticação.
 */
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de resposta: trata de forma centralizada o caso de token
 * expirado/inválido (401), limpando a sessão local. A navegação para a
 * tela de login é responsabilidade do PrivateRoute, que reage à ausência
 * de sessão autenticada.
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storageService.clearSession();
    }
    return Promise.reject(error);
  },
);
