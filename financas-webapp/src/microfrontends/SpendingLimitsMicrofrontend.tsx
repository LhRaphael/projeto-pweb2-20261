import { MicrofrontendFrame } from './MicrofrontendFrame';

/**
 * Ponto de integração do microfrontend de Limites de Gastos (RF06) no host.
 * Implementação isolada em `src/microfrontends/spending-limits/main.tsx`.
 */
export function SpendingLimitsMicrofrontend() {
  return (
    <MicrofrontendFrame src="/src/microfrontends/spending-limits/index.html" label="Limites de Gastos" />
  );
}