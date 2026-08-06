import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = 'theme';

function readStoredTheme(): boolean {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === 'light') {
    return false;
  }

  // 'dark' ou ainda não definido (primeiro acesso) → tema escuro, o padrão.
  return true;
}

/**
 * O tema é persistido em `localStorage` e sincronizado via evento
 * `storage`. Isso é o que permite que o toggle feito no host
 * (App.tsx) alcance os microfrontends (RF07): cada um roda em seu
 * próprio `<iframe>`, com seu próprio `document`/`window` — não tem
 * como um estado em memória (React context) atravessar essa
 * fronteira sozinho.
 *
 * Como host e iframes são a mesma origem, todos compartilham o mesmo
 * `localStorage`, e o navegador já dispara `storage` automaticamente
 * em toda janela que NÃO foi a que fez a alteração — inclusive entre
 * uma página e um `<iframe>` embutido nela. Não precisa de
 * `postMessage` manual.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY || event.newValue === null) {
        return;
      }

      setIsDark(event.newValue === 'dark');
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((previous) => {
      const next = !previous;
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  return ctx;
}
