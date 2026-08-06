import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // Só registra o Service Worker em produção. Em desenvolvimento ele
  // faria cache-first de todo GET same-origin — inclusive os módulos
  // que o Vite serve/recompila a cada mudança — e o navegador passaria
  // a servir código desatualizado para sempre, mascarando qualquer
  // correção feita no código-fonte.
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/sw.ts').catch(() => {
      // Falha silenciosa para não quebrar a experiência em ambientes sem suporte.
    });
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root não encontrado em index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);