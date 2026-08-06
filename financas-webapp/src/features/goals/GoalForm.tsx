import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGoal } from './goalsSlice';

export default function GoalForm() {
  const dispatch = useDispatch<any>();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) return;

    dispatch(
      createGoal({
        name,
        targetAmount: Number(targetAmount),
        targetDate,
        category: category || undefined,
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h2>Cadastrar Nova Meta</h2>

      <div>
        <label htmlFor="goal-name">Nome</label>
        <input
          id="goal-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="goal-amount">Valor</label>
        <input
          id="goal-amount"
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="goal-date">Data</label>
        <input
          id="goal-date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="goal-category">Categoria (Opcional)</label>
        <input
          id="goal-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <button type="submit">Salvar Meta</button>
    </form>
  );
}