import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchGoals,
  createGoal as createGoalThunk,
  updateGoal as updateGoalThunk,
  deleteGoal as deleteGoalThunk,
  selectGoals,
  selectGoalsStatus,
  selectGoalsError,
} from '../store/slices/goalsSlice';
import type {
  CreateGoalRequest,
  UpdateGoalRequest,
} from '../types/goal.types';

/**
 * RF05 — Encapsula a leitura, criação, atualização e exclusão de metas
 * a partir do goalsSlice, isolando os componentes de página da lógica
 * de Redux e da camada de serviço.
 */
export function useGoals() {
  const dispatch = useAppDispatch();
  const goals = useAppSelector(selectGoals);
  const status = useAppSelector(selectGoalsStatus);
  const error = useAppSelector(selectGoalsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGoals());
    }
  }, [status, dispatch]);

  const refresh = useCallback((): void => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const createGoal = useCallback(
    async (data: CreateGoalRequest): Promise<void> => {
      await dispatch(createGoalThunk(data)).unwrap();
    },
    [dispatch],
  );

  const updateGoal = useCallback(
    async (
      id: number,
      data: UpdateGoalRequest,
    ): Promise<void> => {
      await dispatch(updateGoalThunk({ id, data })).unwrap();
    },
    [dispatch],
  );

  const deleteGoal = useCallback(
    async (id: number): Promise<void> => {
      await dispatch(deleteGoalThunk(id)).unwrap();
    },
    [dispatch],
  );

  return {
    goals,
    loading: status === 'loading' || status === 'idle',
    error,
    refresh,
    createGoal,
    updateGoal,
    deleteGoal,
  };
}
