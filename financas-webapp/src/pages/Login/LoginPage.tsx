import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch {
      setError('Usuário ou senha inválidos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Entrar</h1>

        <label htmlFor="username">Usuário</label>
        <input
          id="username"
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
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="register-redirect">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}
