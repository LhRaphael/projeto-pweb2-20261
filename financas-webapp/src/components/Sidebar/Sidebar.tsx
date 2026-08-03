import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  open,
  onClose,
}: SidebarProps) {

  const { logout } = useAuth();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <button
        className="sidebar-close"
        onClick={onClose}
      >
        ✕
      </button>

      <h2 className="sidebar-title">Finanças</h2>

      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to="/transactions" className="sidebar-link">
          Transações
        </NavLink>

        <NavLink to="/transactions/new" className="sidebar-link">
          Nova Transação
        </NavLink>

        <NavLink to="/goals" className="sidebar-link">
          Metas
        </NavLink>

        <NavLink to="/goals/new" className="sidebar-link">
          Nova Meta
        </NavLink>

        <button className="sidebar-link sidebar-logout" onClick={logout}>
          Sair
        </button>
      </nav>
    </aside>
  );
}