import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

if ('serviceWorker' in navigator) {
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
