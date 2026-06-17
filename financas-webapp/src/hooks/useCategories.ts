import { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import type { CategoryResponse } from '../types/category.types';

interface UseCategoriesResult {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
}

/**
 * Encapsula o carregamento da lista de categorias, mantendo os
 * componentes de página livres de lógica de fetch/estado.
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    categoryService
      .getAll()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar as categorias.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}
