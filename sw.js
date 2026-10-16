const CACHE_NAME = 'sarita-photo-shell-v7';
const APP_SHELL = ['./', './index.html', './style.css', './script.js', './manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('sarita-photo-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first means published updates appear promptly; cached copies keep
  // the website usable if the visitor is temporarily offline.
  event.respondWith((async () => {
    const isNavigation = request.mode === 'navigate';
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (isNavigation) {
        const fallback = await caches.match('./index.html');
        if (fallback) return fallback;
      }
      return new Response('You are offline. Please reconnect and try again.', {
        status: 503,
        statusText: 'Offline',
        headers: {'Content-Type': 'text/plain; charset=utf-8'}
      });
    }
  })());
});
