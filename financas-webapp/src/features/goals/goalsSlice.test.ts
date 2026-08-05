import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { configureStore } from '@reduxjs/toolkit';
import goalsReducer, { fetchGoals, createGoal } from './goalsSlice';

const API_URL = 'http://localhost:8080';

// Mock das rotas da API com MSW
const handlers = [
  http.get(`${API_URL}/goals`, () => {
    return HttpResponse.json([
      { id: '1', name: 'Comprar Carro', targetAmount: 30000, targetDate: '2026-12-31' },
    ]);
  }),
  http.post(`${API_URL}/goals`, async ({ request }) => {
    const newGoal = (await request.json()) as any;
    return HttpResponse.json({ id: '2', ...newGoal }, { status: 201 });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('goalsSlice', () => {
  it('deve retornar o estado inicial', () => {
    const initialState = goalsReducer(undefined, { type: 'unknown' });
    expect(initialState).toEqual({
      items: [],
      loading: false,
      error: null,
    });
  });

  it('deve buscar metas com sucesso via thunk fetchGoals (MSW)', async () => {
    const store = configureStore({ reducer: { goals: goalsReducer } });

    await store.dispatch(fetchGoals());

    const state = store.getState().goals;
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Comprar Carro');
  });

  it('deve criar uma nova meta via thunk createGoal (MSW)', async () => {
    const store = configureStore({ reducer: { goals: goalsReducer } });
    const payload = { name: 'Viagem', targetAmount: 5000, targetDate: '2027-01-01' };

    await store.dispatch(createGoal(payload));

    const state = store.getState().goals;
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ id: '2', ...payload });
  });
});
