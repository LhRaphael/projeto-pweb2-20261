import { categoriesApi } from '../api/categoriesApi';
import type { CategoryResponse } from '../types/category.types';

/**
 * Hoje é apenas um repasse para a camada api/
 */
export const categoryService = {
  getAll: async (): Promise<CategoryResponse[]> => {
    return categoriesApi.getAll();
  },
};
