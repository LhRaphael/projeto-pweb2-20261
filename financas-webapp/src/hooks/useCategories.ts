import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCategories,
  selectCategories,
  selectCategoriesStatus,
  selectCategoriesError,
} from '../store/slices/categoriesSlice';

/**
 * RF02 — Garante que as categorias sejam carregadas (uma única vez) e
 * expõe o estado do categoriesSlice para os componentes de página.
 */
export function useCategories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const status = useAppSelector(selectCategoriesStatus);
  const error = useAppSelector(selectCategoriesError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return {
    categories,
    loading: status === 'loading' || status === 'idle',
    error,
  };
}