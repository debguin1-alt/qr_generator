const CACHE = 'qrgen-v1';

const ASSETS = [
  '/qr_generator/',
  '/qr_generator/index.html',
  '/qr_generator/manifest.json',
  '/qr_generator/icons/icon-48.png',
  '/qr_generator/icons/icon-192.png',
  '/qr_generator/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap'
];

// Install — cache all core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, fall back to network
self.addEventListener('fetch', e => {
  // Skip Firebase API calls — always go to network
  if (e.request.url.includes('firestore.googleapis.com') ||
      e.request.url.includes('firebase')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        // Cache fresh responses for same-origin assets
        if (response.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('/qr_generator/index.html'))
  );
});
