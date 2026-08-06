import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { goalService } from '../../services/goalService';
import { extractApiErrorMessage } from '../../utils/apiError';

import type {
  GoalResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
} from '../../types/goal.types';

import type { RootState } from '../store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface GoalsState {
  items: GoalResponse[];
  status: RequestStatus;
  error: string | null;
}

const initialState: GoalsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchGoals = createAsyncThunk<
  GoalResponse[],
  void,
  { rejectValue: string }
>(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      return await goalService.list();
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(
          error,
          'Não foi possível carregar as metas.',
        ),
      );
    }
  },
);

export const createGoal = createAsyncThunk<
  GoalResponse,
  CreateGoalRequest,
  { rejectValue: string }
>(
  'goals/createGoal',
  async (data, { rejectWithValue }) => {
    try {
      return await goalService.create(data);
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(
          error,
          'Não foi possível criar a meta.',
        ),
      );
    }
  },
);

export const updateGoal = createAsyncThunk<
  GoalResponse,
  { id: number; data: UpdateGoalRequest },
  { rejectValue: string }
>(
  'goals/updateGoal',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await goalService.update(id, data);
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(
          error,
          'Não foi possível atualizar a meta.',
        ),
      );
    }
  },
);

export const deleteGoal = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'goals/deleteGoal',
  async (id, { rejectWithValue }) => {
    try {
      await goalService.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(
          error,
          'Não foi possível excluir a meta.',
        ),
      );
    }
  },
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ?? 'Erro ao carregar metas.';
      })

      .addCase(createGoal.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (goal) => goal.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (goal) => goal.id !== action.payload,
        );
      });
  },
});

export default goalsSlice.reducer;

export const selectGoals = (
  state: RootState,
): GoalResponse[] => state.goals.items;

export const selectGoalsStatus = (
  state: RootState,
): RequestStatus => state.goals.status;

export const selectGoalsError = (
  state: RootState,
): string | null => state.goals.error;