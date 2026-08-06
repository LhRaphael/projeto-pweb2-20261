import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { TransactionsListPage } from '../pages/Transactions/TransactionsListPage';
import { TransactionFormPage } from '../pages/Transactions/TransactionFormPage';
import { GoalsMicrofrontend } from '../microfrontends/GoalsMicrofrontend';
import { SpendingLimitsMicrofrontend } from '../microfrontends/SpendingLimitsMicrofrontend';

/**
 * Definição centralizada de rotas. Rotas privadas ficam agrupadas sob
 * o elemento ProtectedRoute, que cuida do redirecionamento para /login
 * quando não há sessão autenticada.
 *
 * RF07 — Metas (/goals/*) e Limites de Gastos (/spending-limits) não são
 * mais renderizadas diretamente pelo host: cada uma é um microfrontend
 * isolado (bundle Vite próprio, ver `vite.config.ts`), composto em
 * runtime via <iframe> (`GoalsMicrofrontend` / `SpendingLimitsMicrofrontend`).
 * A navegação interna entre listagem/criação/edição de metas acontece
 * dentro do próprio módulo (MemoryRouter em `microfrontends/goals/main.tsx`),
 * por isso a rota do host usa um wildcard (`/goals/*`).
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
          <Route path="/goals/*" element={<GoalsMicrofrontend />} />
          <Route path="/spending-limits" element={<SpendingLimitsMicrofrontend />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}