import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { transactionService } from '../../services/transactionService';
import { extractApiErrorMessage } from '../../utils/apiError';
import type {
  TransactionFilters,
  TransactionRequest,
  TransactionResponse,
} from '../../types/transaction.types';
import type { RootState } from '../store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface PageMeta {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface TransactionsState {
  /** Apenas os itens da página atualmente carregada — nunca a lista completa. */
  items: TransactionResponse[];
  filters: TransactionFilters;
  pageMeta: PageMeta;
  status: RequestStatus;
  error: string | null;
}

const DEFAULT_FILTERS: TransactionFilters = {
  page: 0,
  size: 10,
  sort: 'date,desc',
};

const initialState: TransactionsState = {
  items: [],
  filters: DEFAULT_FILTERS,
  pageMeta: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
  status: 'idle',
  error: null,
};

/**
 * RF02 — thunk de listagem. Aceita os filtros/paginação suportados pela
 * API e armazena no estado apenas o conteúdo da página retornada.
 *
 * Também é reaproveitado pelo Dashboard (RF03) para carregar as
 * transações do mês corrente, sem precisar de um slice próprio: basta
 * chamar este thunk com `startDate`/`endDate` do mês atual.
 */
export const fetchTransactions = createAsyncThunk<
  Awaited<ReturnType<typeof transactionService.list>>,
  TransactionFilters,
  { rejectValue: string }
>('transactions/fetchTransactions', async (filters, { rejectWithValue }) => {
  try {
    return await transactionService.list(filters);
  } catch (error) {
    return rejectWithValue(extractApiErrorMessage(error, 'Não foi possível carregar as transações.'));
  }
});

/**
 * RF02 — thunk de criação. Em caso de sucesso, a transação criada é
 * inserida imediatamente no estado (sem esperar um novo fetch), o que
 * mantém o Dashboard (RF03) sincronizado em tempo real.
 */
export const createTransaction = createAsyncThunk<
  TransactionResponse,
  TransactionRequest,
  { rejectValue: string }
>('transactions/createTransaction', async (data, { rejectWithValue }) => {
  try {
    return await transactionService.create(data);
  } catch (error) {
    return rejectWithValue(
      extractApiErrorMessage(error, 'Não foi possível salvar a transação. Verifique os dados informados.'),
    );
  }
});

export const updateTransaction = createAsyncThunk<
  TransactionResponse,
  { id: number; data: TransactionRequest },
  { rejectValue: string }
>('transactions/updateTransaction', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await transactionService.update(id, data);
  } catch (error) {
    return rejectWithValue(
      extractApiErrorMessage(error, 'Não foi possível atualizar a transação. Verifique os dados informados.'),
    );
  }
});

export const removeTransaction = createAsyncThunk<number, number, { rejectValue: string }>(
  'transactions/removeTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await transactionService.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(extractApiErrorMessage(error, 'Não foi possível excluir a transação.'));
    }
  },
);

/** Mantém a lista ordenada da mais recente para a mais antiga. */
function sortByDateDesc(items: TransactionResponse[]): TransactionResponse[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<TransactionFilters>) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.content;
        state.pageMeta = {
          number: action.payload.number,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Erro ao carregar transações.';
      })
      .addCase(createTransaction.fulfilled, (state, action: PayloadAction<TransactionResponse>) => {
        state.items = sortByDateDesc([action.payload, ...state.items]);
        state.pageMeta.totalElements += 1;
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<TransactionResponse>) => {
        state.items = sortByDateDesc(
          state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
        );
      })
      .addCase(removeTransaction.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.pageMeta.totalElements = Math.max(0, state.pageMeta.totalElements - 1);
      });
  },
});

export const { setFilters } = transactionsSlice.actions;
export default transactionsSlice.reducer;

// Selectors básicos (ver store/selectors/transactionsSelectors.ts para os derivados do Dashboard)
export const selectTransactionItems = (state: RootState): TransactionResponse[] => state.transactions.items;
export const selectTransactionFilters = (state: RootState): TransactionFilters => state.transactions.filters;
export const selectTransactionPageMeta = (state: RootState): PageMeta => state.transactions.pageMeta;
export const selectTransactionsStatus = (state: RootState): RequestStatus => state.transactions.status;
export const selectTransactionsError = (state: RootState): string | null => state.transactions.error;
