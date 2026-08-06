import { httpClient } from './httpClient';
import { ENDPOINTS } from './endpoints';
import type { CategoryResponse } from '../types/category.types';

/**
 * Camada de acesso a dados (repository) para categorias.
 */
export const categoriesApi = {
  getAll: async (): Promise<CategoryResponse[]> => {
    const response = await httpClient.get<CategoryResponse[]>(ENDPOINTS.categories);
    return response.data;
  },
};