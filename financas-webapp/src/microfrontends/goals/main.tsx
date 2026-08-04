import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from '../../store/store';
import { GoalsListPage } from '../../pages/Goals/GoalsListPage';
import { GoalFormPage } from '../../pages/Goals/GoalFormPage';

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <MemoryRouter initialEntries={['/goals']}>
          <Routes>
            <Route path="/goals" element={<GoalsListPage />} />
            <Route path="/goals/new" element={<GoalFormPage />} />
            <Route path="/goals/:id/edit" element={<GoalFormPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </React.StrictMode>,
  );
}
