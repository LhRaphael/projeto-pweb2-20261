import { categoriesApi } from '../api/categoriesApi';
import type { CategoryResponse } from '../types/category.types';

/**
 * Hoje é apenas um repasse para a camada api/, mas existir como serviço
 * próprio permite adicionar cache, ordenação ou outras regras de negócio
 * no futuro sem alterar quem consome este módulo (hooks/componentes).
 */
export const categoryService = {
  getAll: async (): Promise<CategoryResponse[]> => {
    return categoriesApi.getAll();
  },
};
