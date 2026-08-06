import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from '../../store/store';
import { ThemeProvider } from '../../context/ThemeContext';
import { SpendingLimitsPage } from '../../pages/SpendingLimits/SpendingLimitsPage';
import '../../index.css';

/**
 * Entry point independente do microfrontend de Limites de Gastos (RF07).
 * Ver comentário equivalente em `src/microfrontends/goals/main.tsx` —
 * mesma lógica: bundle separado, próprio store, próprio tema, montado
 * pelo host via `<iframe>` em `SpendingLimitsMicrofrontend.tsx`.
 */
const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/spending-limits']}>
            <Routes>
              <Route path="/spending-limits" element={<SpendingLimitsPage />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  );
}