import React from 'react';
import { useSelector } from 'react-redux';
import { selectGoalProgress } from './goalSelectors';

interface GoalItemProps {
  goal: any;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const progress = useSelector((state) => selectGoalProgress(state, goal.id));

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem', borderRadius: '8px' }}>
      <h3>{goal.name}</h3>
      <p>Valor alvo: R$ {goal.targetAmount}</p>
      <p>Data limite: {goal.targetDate}</p>
      <div>
        <span>Progresso: {progress}%</span>
        <div style={{ backgroundColor: '#e0e0e0', borderRadius: '4px', height: '10px', overflow: 'hidden', marginTop: '4px' }}>
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: progress >= 100 ? '#4caf50' : '#2196f3',
              height: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function GoalsList() {
  const goals = useSelector((state: any) => state.goals?.items || []);
  const loading = useSelector((state: any) => state.goals?.loading || false);

  if (loading) return <div>Carregando metas...</div>;

  return (
    <div>
      <h2>Minhas Metas Financeiras</h2>
      {goals.length === 0 ? (
        <p>Nenhuma meta cadastrada.</p>
      ) : (
        goals.map((goal: any) => <GoalItem key={goal.id || goal.name} goal={goal} />)
      )}
    </div>
  );
}
