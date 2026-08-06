import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { spendingLimitService } from '../../services/spendingLimitService';
import { extractApiErrorMessage } from '../../utils/apiError';

import type {
  SpendingLimitResponse,
  CreateSpendingLimitRequest,
} from '../../types/spendingLimit.types';

import type { RootState } from '../store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface SpendingLimitsState {
  items: SpendingLimitResponse[];
  status: RequestStatus;
  error: string | null;
}

const initialState: SpendingLimitsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchSpendingLimits = createAsyncThunk<
  SpendingLimitResponse[],
  void,
  { rejectValue: string }
>(
  'spendingLimits/fetchSpendingLimits',
  async (_, { rejectWithValue }) => {
    try {
      return await spendingLimitService.list();
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(
          error,
          'Não foi possível carregar os limites de gastos.',
        ),
      );
    }
  },
);

export const createSpendingLimit = createAsyncThunk<
  SpendingLimitResponse,
  CreateSpendingLimitRequest,
  { rejectValue: string }
>(
  'spendingLimits/createSpendingLimit',
  async (data, { rejectWithValue }) => {
    try {
      return await spendingLimitService.create(data);
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(
          error,
          'Não foi possível criar o limite de gastos.',
        ),
      );
    }
  },
);

export const deleteSpendingLimit = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'spendingLimits/deleteSpendingLimit',
  async (id, { rejectWithValue }) => {
    try {
      await spendingLimitService.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(
          error,
          'Não foi possível excluir o limite de gastos.',
        ),
      );
    }
  },
);

const spendingLimitsSlice = createSlice({
  name: 'spendingLimits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpendingLimits.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSpendingLimits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSpendingLimits.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? 'Erro ao carregar limites de gastos.';
      })

      .addCase(createSpendingLimit.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(deleteSpendingLimit.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (limit) => limit.id !== action.payload,
        );
      });
  },
});

export default spendingLimitsSlice.reducer;

export const selectSpendingLimits = (
  state: RootState,
): SpendingLimitResponse[] => state.spendingLimits.items;

export const selectSpendingLimitsStatus = (
  state: RootState,
): RequestStatus => state.spendingLimits.status;

export const selectSpendingLimitsError = (
  state: RootState,
): string | null => state.spendingLimits.error;