import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { SpendingLimitsPage } from '../pages/SpendingLimits/SpendingLimitsPage';
import { store } from '../store/store';

export function SpendingLimitsMicrofrontend() {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <SpendingLimitsPage />
      </MemoryRouter>
    </Provider>
  );
}
