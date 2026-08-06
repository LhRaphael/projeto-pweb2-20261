import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from '../../store/store';
import { ThemeProvider } from '../../context/ThemeContext';
import { GoalsListPage } from '../../pages/Goals/GoalsListPage';
import { GoalFormPage } from '../../pages/Goals/GoalFormPage';
import '../../index.css';

/**
 * Entry point independente do microfrontend de Metas (RF07).
 *
 * Este arquivo é compilado como um bundle separado (ver `vite.config.ts`,
 * entrada `goalsMf`) e servido em seu próprio `index.html`. É montado
 * pelo host (`financas-webapp`) dentro de um `<iframe>` — ver
 * `src/microfrontends/GoalsMicrofrontend.tsx` — mas também funciona
 * sozinho, acessando `/src/microfrontends/goals/index.html` direto.
 *
 * Por isso ele monta sua própria `Provider store={store}` e seu próprio
 * `ThemeProvider`/`index.css`: como roda em um documento HTML separado
 * (o do iframe), não herda nada do host — precisa ser autossuficiente.
 * O token de autenticação é lido do `localStorage`, que é compartilhado
 * entre host e iframe por serem a mesma origem.
 */
const container = document.getElementById('root');

/**
 * O host (`GoalsMicrofrontend.tsx`) repassa o pathname que o usuário
 * pediu (ex.: `/goals/new`) via `?path=`, já que este módulo roda em
 * um documento/iframe separado e não compartilha a URL do host.
 */
function getInitialPath(): string {
  const params = new URLSearchParams(window.location.search);
  const path = params.get('path');
  return path && path.startsWith('/goals') ? path : '/goals';
}

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[getInitialPath()]}>
            <Routes>
              <Route path="/goals" element={<GoalsListPage />} />
              <Route path="/goals/new" element={<GoalFormPage />} />
              <Route path="/goals/:id/edit" element={<GoalFormPage />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  );
}