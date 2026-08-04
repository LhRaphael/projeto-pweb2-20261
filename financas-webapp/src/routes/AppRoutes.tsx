import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { TransactionsListPage } from '../pages/Transactions/TransactionsListPage';
import { TransactionFormPage } from '../pages/Transactions/TransactionFormPage';
import { GoalsListPage } from '../pages/Goals/GoalsListPage';
import { GoalFormPage } from '../pages/Goals/GoalFormPage';
import { SpendingLimitsPage } from '../pages/SpendingLimits/SpendingLimitsPage';

const MICROFRONTEND_BASE_URL = {
  goals: '/src/microfrontends/goals/index.html',
  spendingLimits: '/src/microfrontends/spending-limits/index.html',
};

/**
 * Definição centralizada de rotas. Rotas privadas ficam agrupadas sob
 * o elemento ProtectedRoute, que cuida do redirecionamento para /login
 * quando não há sessão autenticada.
 */
function mountMicrofrontends(): void {
  const mountFromUrl = (name: keyof typeof MICROFRONTEND_BASE_URL, container: HTMLElement | null) => {
    if (!container) {
      return;
    }

    const url = MICROFRONTEND_BASE_URL[name];
    container.dataset.microfrontend = name;
    container.dataset.source = url;
    container.innerHTML = `<p>Microfrontend carregado em ${url}</p>`;
  };

  mountFromUrl('goals', document.getElementById('mf-goals'));
  mountFromUrl('spendingLimits', document.getElementById('mf-spending-limits'));
}

export function AppRoutes() {
  mountMicrofrontends();

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
          <Route path="/spending-limits" element={<SpendingLimitsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}