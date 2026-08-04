import { http, HttpResponse } from 'msw';
import { env } from '../config/env';

/**
 * Handlers padrão do MSW para o servidor de testes. Usam a mesma
 * baseURL configurada em src/config/env.ts (a mesma usada pelo
 * httpClient/axios), para que qualquer teste que não sobrescreva um
 * handler específico (via server.use(...)) já tenha uma resposta
 * padrão em vez de falhar por "unhandled request".
 */
export const handlers = [
  http.get(`${env.apiBaseUrl}/goals`, () => {
    return HttpResponse.json([]);
  }),

  http.get(`${env.apiBaseUrl}/spending-limits`, () => {
    return HttpResponse.json([]);
  }),
];
