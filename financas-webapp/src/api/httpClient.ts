import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { storageService } from '../services/storageService';

// Configuração do cliente HTTP (axios) para comunicação com a API REST
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição: adiciona o token de autenticação (se existir) no header Authorization de todas as requisições
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: detecta respostas 401 Unauthorized e limpa a sessão local, forçando o usuário a se autenticar novamente
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storageService.clearSession();
    }
    return Promise.reject(error);
  },
);
