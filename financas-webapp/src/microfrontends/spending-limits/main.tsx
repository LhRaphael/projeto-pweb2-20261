import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from '../../store/store';
import { SpendingLimitsPage } from '../../pages/SpendingLimits/SpendingLimitsPage';

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <MemoryRouter initialEntries={['/spending-limits']}>
          <Routes>
            <Route path="/spending-limits" element={<SpendingLimitsPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </React.StrictMode>,
  );
}
