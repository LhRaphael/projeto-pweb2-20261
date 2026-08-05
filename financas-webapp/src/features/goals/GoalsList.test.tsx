// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import goalsReducer from './goalsSlice';
import GoalsList from './GoalsList';
import transactionsReducer from '../../store/slices/transactionsSlice';

// 1. Configura o servidor do MSW para capturar a requisição POST
const server = setupServer(
  http.post('http://localhost:8080/goals', async ({ request }) => {
    const body = (await request.clone().json()) as any;
    return HttpResponse.json({ id: '123', ...body }, { status: 201 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


const renderWithStore = (initialGoals: any[]) => {
  const store = configureStore({
    reducer: {
      goals: goalsReducer,
      transactions: transactionsReducer,
    },
    preloadedState: {
      goals: { items: initialGoals, loading: false, error: null },
      transactions: {
        items: [],
        filters: { page: 0, size: 10, sort: 'date,desc' },
        pageMeta: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
        status: 'idle' as const, // <-- Adicionado "as const" aqui!
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <GoalsList />
    </Provider>
  );
};

describe('GoalsList Component', () => {
  it('deve renderizar a listagem de metas fornecidas por fixture', () => {
    const fixtureGoals = [
      { id: '1', name: 'Comprar Laptop', targetAmount: 5000, targetDate: '2026-12-31' },
      { id: '2', name: 'Viagem de Férias', targetAmount: 3000, targetDate: '2027-06-30' },
    ];

    renderWithStore(fixtureGoals);

    expect(screen.getByText('Comprar Laptop')).toBeInTheDocument();
    expect(screen.getByText('Viagem de Férias')).toBeInTheDocument();
  });
});
