export interface GoalResponse {
  id: number;
  name: string;
  targetAmount: number;
  startDate: string;
  deadline: string;
  categoryId: number | null;
  categoryName: string | null;
}

export interface CreateGoalRequest {
  name: string;
  targetAmount: number;
  deadline: string;
  startDate?: string;
  categoryId?: number;
}

export interface UpdateGoalRequest {
  name: string;
  targetAmount: number;
  deadline: string;
  startDate?: string;
  categoryId?: number;
}
