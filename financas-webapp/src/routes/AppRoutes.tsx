import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { TransactionsListPage } from '../pages/Transactions/TransactionsListPage';
import { TransactionFormPage } from '../pages/Transactions/TransactionFormPage';
import { GoalsListPage } from '../pages/Goals/GoalsListPage';
import { GoalFormPage } from '../pages/Goals/GoalFormPage';

/**
 * Definição centralizada de rotas. Rotas privadas ficam agrupadas sob
 * o elemento ProtectedRoute, que cuida do redirecionamento para /login
 * quando não há sessão autenticada.
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsListPage />} />
          <Route path="/transactions/new" element={<TransactionFormPage />} />
          <Route path="/transactions/:id/edit" element={<TransactionFormPage />} />
          <Route path="/goals" element={<GoalsListPage />} />
          <Route path="/goals/new" element={<GoalFormPage />} />
          <Route path="/goals/:id/edit" element={<GoalFormPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
