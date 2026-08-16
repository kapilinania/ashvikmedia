// ==============================================================================
// ASHVIK MEDIA - CLIENT-SIDE ERROR RECOVERY & OFFLINE SERVICE WORKER (sw.js)
// Intercepts non-existent routes (404s) & offline states across all local/live environments
// ==============================================================================

const CACHE_NAME = 'ashvik-shield-v1';
const CORE_FALLBACKS = [
  '/',
  '/404.html',
  '/assets/css/style.css',
  '/assets/css/pages.css',
  '/assets/js/main.js',
  '/assets/images/logos/logo-light.png',
  '/assets/images/logos/favicon.png'
];

// Install Event: Pre-cache fallback error page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_FALLBACKS).catch((err) => {
        console.warn('[ServiceWorker] Pre-caching warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Intercept broken/missing navigation routes and serve 404.html
self.addEventListener('fetch', (event) => {
  // Only handle GET navigation requests (HTML pages)
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          // If server returns 404 or bad response
          if (!response || !response.ok || response.status === 404) {
            const cached404 = await caches.match('/404.html');
            if (cached404) return cached404;
            const fetched404 = await fetch('/404.html');
            return fetched404;
          }

          // In local dev servers like Live Server, a 404 is sometimes returned with status 404 or a 'Cannot GET' text
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('text/plain') || contentType.includes('text/html')) {
            const clone = response.clone();
            const text = await clone.text();
            if (text.startsWith('Cannot GET ') || text.includes('<pre>Cannot GET ')) {
              const cached404 = await caches.match('/404.html');
              if (cached404) return cached404;
              return fetch('/404.html');
            }
          }

          return response;
        })
        .catch(async () => {
          // Network failed / user is offline
          const cached404 = await caches.match('/404.html');
          if (cached404) return cached404;
          return fetch('/404.html?code=offline').catch(() => new Response('Offline', { status: 200 }));
        })
    );
  }
});
