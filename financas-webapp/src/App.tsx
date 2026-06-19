import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch } from './store/hooks';
import { restoreSession } from './store/slices/authSlice';
import { AppRoutes } from './routes/AppRoutes';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './index.css';

/**
 * Restaura a sessão (token + usuário) persistida localmente, se houver,
 * antes de liberar a navegação. Precisa estar dentro do <Provider> para
 * ter acesso à store via hooks.
 */
function SessionBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <AppRoutes />;
}

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle-fab"
      onClick={toggleTheme}
      aria-label={`Mudar para tema ${isDark ? 'claro' : 'escuro'}`}
      aria-pressed={isDark}
    >
      <span className="theme-toggle-fab__knob">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SessionBootstrap />
        <ThemeToggleButton />
      </ThemeProvider>
    </Provider>
  );
}