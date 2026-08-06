import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './RegisterPage.css';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register({ name, username, password });
      navigate('/');
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados informados.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1>Criar conta</h1>

        <label htmlFor="name">Nome</label>
        <input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />

        <label htmlFor="username">Email</label>
        <input
          id="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p role="alert" className="error-message">{error}</p>}

        <button type="submit" disabled={submitting} className="submit-button">
          {submitting ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="login-redirect">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}