import { useState, type ReactNode } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import './ProtectedLayout.css';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="protected-layout">
      <button
        className="menu-button"
        onClick={() => setMenuOpen(true)}
      >
        ☰
      </button>

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="protected-content">
        {children}
      </main>
    </div>
  );
}
