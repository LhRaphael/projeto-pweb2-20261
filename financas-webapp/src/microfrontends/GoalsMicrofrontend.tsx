import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { GoalsListPage } from '../pages/Goals/GoalsListPage';
import { store } from '../store/store';

export function GoalsMicrofrontend() {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <GoalsListPage />
      </MemoryRouter>
    </Provider>
  );
}
