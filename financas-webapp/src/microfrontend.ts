import { createElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export function registerMicrofrontend(name: string, render: (container: HTMLElement) => ReactNode): void {
  const container = document.getElementById(`mf-${name}`);
  if (!container) {
    return;
  }

  let root: Root | null = null;
  const mount = (element: HTMLElement) => {
    root = createRoot(element);
    root.render(createElement(() => render(element)));
  };

  container.dataset.microfrontend = name;
  mount(container);

  const unmount = () => {
    root?.unmount();
  };

  window.addEventListener('beforeunload', unmount, { once: true });
}
