/// <reference lib="webworker" />

/**
 * RF06 — Service Worker para cache do app shell e suporte offline.
 *
 * Registrado apenas em produção (ver main.tsx — `import.meta.env.PROD`).
 * A versão do cache muda a cada revisão relevante deste arquivo
 * (CACHE_NAME) para que `activate` limpe caches antigos automaticamente
 * quando uma nova versão é publicada — sem isso, uma resposta cacheada
 * indevidamente ficaria presa no navegador do usuário para sempre.
 *
 * Estratégia:
 * - Requisições de API (outra origem, ex. http://localhost:8080) e
 *   qualquer coisa fora deste mesmo site: NUNCA interceptadas — sempre
 *   vão direto para a rede. Cachear resposta de API seria servir dados
 *   desatualizados (saldo, transações, limites...) indefinidamente.
 * - Navegação (o HTML da página): network-first com fallback pro cache
 *   — tenta buscar a versão mais nova primeiro; só cai no cache se
 *   estiver offline.
 * - Assets estáticos com hash no nome (`/assets/*.js`, `/assets/*.css`
 *   gerados pelo `vite build` — o nome muda a cada build): cache-first,
 *   já que um asset com hash é imutável por definição.
 * - Qualquer outra requisição GET same-origin (ex.: módulos servidos
 *   pelo Vite em desenvolvimento): não intercepta, vai direto pra rede.
 */
const CACHE_NAME = 'financas-shell-v2';
const APP_SHELL = ['/', '/index.html', '/favicon.svg'];

const workerScope = self as unknown as ServiceWorkerGlobalScope;

workerScope.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  workerScope.skipWaiting();
});

workerScope.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => workerScope.clients.claim()),
  );
});

function isStaticHashedAsset(url: URL): boolean {
  return url.origin === self.location.origin && url.pathname.startsWith('/assets/');
}

workerScope.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);

  // Nunca intercepta chamadas de API (outra origem) nem requisições
  // que não sejam GET.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Assets com hash no nome: cache-first (são imutáveis).
  if (isStaticHashedAsset(url)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
      }),
    );
    return;
  }

  // Navegação (a própria página): network-first, com fallback pro
  // cache só quando estiver offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html').then((cached) => cached ?? Response.error())),
    );
    return;
  }

  // Qualquer outra requisição GET same-origin (módulos em
  // desenvolvimento, etc.): não intercepta, deixa ir direto pra rede.
});
