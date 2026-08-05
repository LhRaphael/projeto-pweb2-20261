import { useLocation } from 'react-router-dom';
import { MicrofrontendFrame } from './MicrofrontendFrame';

/**
 * Ponto de integração do microfrontend de Metas (RF05) no host.
 * O host só sabe que existe um módulo em `/src/microfrontends/goals/index.html`
 * — toda a implementação (páginas, store, rotas internas) vive isolada
 * nesse bundle, em `src/microfrontends/goals/main.tsx`.
 *
 * Como o host usa a rota coringa `/goals/*`, repassamos o pathname atual
 * (`/goals`, `/goals/new`, `/goals/123/edit`...) via query string para
 * que o módulo abra na tela correta em vez de sempre cair na listagem.
 */
export function GoalsMicrofrontend() {
  const location = useLocation();
  const src = `/src/microfrontends/goals/index.html?path=${encodeURIComponent(location.pathname)}`;

  return <MicrofrontendFrame src={src} label="Metas" />;
}
