// VINYL PWA — Service Worker
const CACHE_NAME = 'vinyl-v1';

// App shell files to cache on install
const SHELL = [
  './index.html',
  './manifest.webmanifest',
  './icon-192.svg',
  './icon-512.svg',
  // External resources (cached on first fetch)
  'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap',
];

// ── Install: cache the app shell ──────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for shell, network-first for everything else ───────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and browser-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // For local files (blob: URLs from File System Access) — don't intercept
  if (url.protocol === 'blob:') return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        // Cache successful responses for shell resources
        if (response.ok && (
          request.url.includes('jsmediatags') ||
          request.url.includes('fonts.googleapis') ||
          request.url.includes('fonts.gstatic')
        )) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback — return the cached index
        if (request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── Media Session message relay ───────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
