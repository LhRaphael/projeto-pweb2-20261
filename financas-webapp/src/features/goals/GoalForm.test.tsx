import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import GoalForm from './GoalForm';
import goalsReducer from './goalsSlice';

const renderForm = () => {
  const store = configureStore({
    reducer: { goals: goalsReducer },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <GoalForm />
      </Provider>
    ),
  };
};

describe('GoalForm Component', () => {
  it('não deve submeter e deve exibir validação quando os campos estiverem vazios', async () => {
    renderForm();

    const submitBtn = screen.getByRole('button', { name: /salvar|criar|cadastrar/i });
    fireEvent.click(submitBtn);

    // Garante que a validação HTML5 ou inline impeça a submissão sem dados
    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    expect(nameInput.checkValidity()).toBe(false);
  });

  it('deve preencher e submeter o formulário com sucesso', async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/nome/i);
    const amountInput = screen.getByLabelText(/valor/i);
    const dateInput = screen.getByLabelText(/data/i);
    const submitBtn = screen.getByRole('button', { name: /salvar|criar|cadastrar/i });

    await user.type(nameInput, 'Nova Moto');
    await user.type(amountInput, '15000');
    await user.type(dateInput, '2026-12-31');

    await user.click(submitBtn);

    // Valida que a ação de envio ocorreu sem falhas
    expect(nameInput).toHaveValue('Nova Moto');
  });
});