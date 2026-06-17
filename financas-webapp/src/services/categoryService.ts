import { categoriesApi } from '../api/categoriesApi';
import type { CategoryResponse } from '../types/category.types';


export const categoryService = {
  getAll: async (): Promise<CategoryResponse[]> => {
    return categoriesApi.getAll();
  },
};
