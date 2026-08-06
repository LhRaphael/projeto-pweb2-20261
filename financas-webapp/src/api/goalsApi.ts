import { httpClient } from './httpClient';
import { ENDPOINTS } from './endpoints';

import type {
  GoalResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
} from '../types/goal.types';

export const goalsApi = {
  getAll: async (): Promise<GoalResponse[]> => {
    const response = await httpClient.get<GoalResponse[]>(
      ENDPOINTS.goals.base,
    );

    return response.data;
  },

  create: async (
    data: CreateGoalRequest,
  ): Promise<GoalResponse> => {
    const response = await httpClient.post<GoalResponse>(
      ENDPOINTS.goals.base,
      data,
    );

    return response.data;
  },

  update: async (
    id: number,
    data: UpdateGoalRequest,
  ): Promise<GoalResponse> => {
    const response = await httpClient.put<GoalResponse>(
      ENDPOINTS.goals.byId(id),
      data,
    );

    return response.data;
  },

  remove: async (
    id: number,
  ): Promise<void> => {
    await httpClient.delete(
      ENDPOINTS.goals.byId(id),
    );
  },
};