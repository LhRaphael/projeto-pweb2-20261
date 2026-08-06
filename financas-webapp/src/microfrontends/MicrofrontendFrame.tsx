import { useState } from 'react';
import './MicrofrontendFrame.css';

interface MicrofrontendFrameProps {
  /** Caminho do index.html do microfrontend, ex: /src/microfrontends/goals/index.html */
  src: string;
  /** Usado em title/aria-label e na mensagem de carregamento. */
  label: string;
}

/**
 * Componente genérico que embute um microfrontend (bundle Vite separado,
 * ver `vite.config.ts`) via `<iframe>`. Essa é a "cola" entre o host e
 * cada módulo — sem Module Federation, a composição em runtime é feita
 * por iframe, que garante isolamento real de JS/CSS entre host e módulo
 * (cada um roda em seu próprio `document`, com seu próprio bundle e
 * store do Redux), atendendo ao requisito de arquitetura em microfrontends
 * do RF07.
 *
 * Autenticação: como iframe e host são a mesma origem, o token salvo no
 * `localStorage` (ver `storageService.ts`) já fica disponível para o
 * microfrontend sem nenhuma ponte adicional.
 */
export function MicrofrontendFrame({ src, label }: MicrofrontendFrameProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="mf-frame-container">
      {loading && <p className="mf-frame-loading">Carregando módulo de {label}…</p>}
      <iframe
        src={src}
        title={`Microfrontend de ${label}`}
        className="mf-frame-iframe"
        style={{ display: loading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}