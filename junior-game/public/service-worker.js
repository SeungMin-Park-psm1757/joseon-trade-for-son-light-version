const CACHE_NAME = 'junior-game-pwa-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/jeongwoo/jeongwoo.png',
  './assets/fairy/fairy-default.png',
  './assets/fairy/fairy-happy.png',
  './assets/events/book.svg'
];

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="84" fill="#dff5cf"/>
  <circle cx="256" cy="220" r="96" fill="#ffe777"/>
  <path d="M132 348c72-64 176-64 248 0" fill="none" stroke="#2f7d5d" stroke-width="34" stroke-linecap="round"/>
  <text x="256" y="432" text-anchor="middle" font-family="sans-serif" font-size="46" font-weight="800" fill="#20351f">다시 눌러볼까?</text>
</svg>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./offline.html')))
    );
    return;
  }

  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => new Response(FALLBACK_SVG, { headers: { 'Content-Type': 'image/svg+xml' } })))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
