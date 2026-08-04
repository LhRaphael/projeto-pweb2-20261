import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { extractApiErrorMessage } from '../../utils/apiError';
import type { AuthenticatedUser, LoginRequest, RegisterRequest } from '../../types/auth.types';
import type { RootState } from '../store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface AuthState {
  user: AuthenticatedUser | null;
  status: RequestStatus;
  error: string | null;
  /** Indica se já tentamos restaurar a sessão a partir do armazenamento local. */
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  initialized: false,
};

/**
 * RF01 — thunk de login. Delega ao authService (que já persiste a sessão
 * localmente em caso de sucesso) e devolve apenas o usuário autenticado.
 */
export const login = createAsyncThunk<AuthenticatedUser, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      return await authService.login(data);
    } catch (error) {
      return rejectWithValue(extractApiErrorMessage(error, 'Usuário ou senha inválidos.'));
    }
  },
);

/**
 * RF01 — thunk de cadastro. Mesmo fluxo do login, mas via authService.register.
 */
export const register = createAsyncThunk<AuthenticatedUser, RegisterRequest, { rejectValue: string }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(error, 'Não foi possível criar a conta. Verifique os dados informados.'),
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Restaura a sessão (se existir) ao iniciar a aplicação, lendo o
     * usuário previamente persistido pelo storageService via authService.
     */
    restoreSession(state) {
      state.user = authService.getCurrentUser();
      state.initialized = true;
    },
    logout(state) {
      authService.logout();
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthenticatedUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Erro ao autenticar.';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthenticatedUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Erro ao criar conta.';
      });
  },
});

export const { restoreSession, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuthUser = (state: RootState): AuthenticatedUser | null => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.user !== null;
export const selectAuthInitialized = (state: RootState): boolean => state.auth.initialized;
export const selectAuthLoading = (state: RootState): boolean => state.auth.status === 'loading';
export const selectAuthError = (state: RootState): string | null => state.auth.error;