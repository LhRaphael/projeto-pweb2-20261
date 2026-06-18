import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch } from './store/hooks';
import { restoreSession } from './store/slices/authSlice';
import { AppRoutes } from './routes/AppRoutes';

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

export function App() {
  return (
    <Provider store={store}>
      <SessionBootstrap />
    </Provider>
  );
}
