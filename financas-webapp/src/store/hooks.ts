import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * Versões tipadas de useDispatch/useSelector, evitando a necessidade
 * de anotar os tipos manualmente em cada componente que acessa a store.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
