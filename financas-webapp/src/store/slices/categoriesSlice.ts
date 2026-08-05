import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';
import { extractApiErrorMessage } from '../../utils/apiError';
import type { CategoryResponse } from '../../types/category.types';
import type { RootState } from '../store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface CategoriesState {
  items: CategoryResponse[];
  status: RequestStatus;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
};

/**
 * RF02 — thunk para carregar as categorias disponíveis na API.
 */
export const fetchCategories = createAsyncThunk<CategoryResponse[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getAll();
    } catch (error) {
      return rejectWithValue(extractApiErrorMessage(error, 'Não foi possível carregar as categorias.'));
    }
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryResponse[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Erro ao carregar categorias.';
      });
  },
});

export default categoriesSlice.reducer;

// Selectors
export const selectCategories = (state: RootState): CategoryResponse[] => state.categories.items;
export const selectCategoriesStatus = (state: RootState): RequestStatus => state.categories.status;
export const selectCategoriesError = (state: RootState): string | null => state.categories.error;
