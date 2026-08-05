import { goalsApi } from '../api/goalsApi';

import type {
  GoalResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
} from '../types/goal.types';

/**
 * Camada de serviço para metas financeiras.
 * Centraliza o acesso às operações de metas,
 * mesmo que atualmente apenas delegue para a API.
 */
export const goalService = {
  list: async (): Promise<GoalResponse[]> => {
    return goalsApi.getAll();
  },

  create: async (
    data: CreateGoalRequest,
  ): Promise<GoalResponse> => {
    return goalsApi.create(data);
  },

  update: async (
    id: number,
    data: UpdateGoalRequest,
  ): Promise<GoalResponse> => {
    return goalsApi.update(id, data);
  },

  remove: async (
    id: number,
  ): Promise<void> => {
    return goalsApi.remove(id);
  },
};
