import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Goal {
  id?: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  category?: string;
}

export interface GoalsState {
  items: Goal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchGoals = createAsyncThunk<Goal[]>(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/goals');
      if (!response.ok) throw new Error('Erro ao buscar metas');
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Erro ao carregar metas');
    }
  }
);

export const createGoal = createAsyncThunk<Goal, Omit<Goal, 'id'>>(
  'goals/createGoal',
  async (newGoal, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });
      if (!response.ok) throw new Error('Erro ao criar meta');
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Erro ao criar meta');
    }
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchGoals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createGoal
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default goalsSlice.reducer;