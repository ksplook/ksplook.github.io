// NEXUS MEP LAB 2.0 · unified full-feature mobile app cache (2026-10-17)
// All engineering data stays in this browser. Publicly hosted code is inspectable.
const CACHE_NAME = 'nexus-personal-lab-2.0.0-unified-20261017';
const BASE = new URL('./', self.registration.scope);
const PRECACHE = [
  './',
  './index.html',
  './room-cfd/index.html',
  './manifest.webmanifest',
  './icon.svg',
  './docs/CFD-GUIDE.md',
  './docs/EQUIPMENT-SOURCES.md',
  './docs/MODULAR-UPGRADE.md',
  './docs/WORKFLOW.md'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) =>
        key.startsWith('nexus-personal-lab-') && key !== CACHE_NAME
      ).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.pathname.startsWith(BASE.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response.ok) throw new Error('Navigation unavailable');
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          // Ignore ?view=roomcfd so the room workspace loads offline too.
          return (await cache.match(request, { ignoreSearch: true })) ||
                 (await cache.match('./index.html')) ||
                 Response.error();
        })
    );
    return;
  }
  event.respondWith(
    caches.match(request, { ignoreSearch: true })
      .then((cached) => cached || fetch(request))
  );
});
