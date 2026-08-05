import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import transactionsReducer from './slices/transactionsSlice';
import goalsReducer from './slices/goalsSlice';
import spendingLimitsReducer from './slices/spendingLimitsSlice';

/**
 * Store global da aplicação. Cada slice corresponde a um domínio,
 * seguindo o princípio de responsabilidade única:
 * - auth: sessão do usuário (usuário autenticado + status da requisição)
 * - categories: lista de categorias disponíveis
 * - transactions: página atual de transações + filtros/paginação
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
    goals: goalsReducer,
    spendingLimits: spendingLimitsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
