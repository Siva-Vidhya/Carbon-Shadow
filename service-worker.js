const CACHE_NAME = 'carbon-shadow-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/twin.html',
  '/camera.html',
  '/settings.html',
  '/styles.css',
  '/dashboard.css',
  '/twin.css',
  '/camera.css',
  '/settings.css',
  '/echo.css',
  '/app.js',
  '/dashboard.js',
  '/twin.js',
  '/camera.js',
  '/settings.js',
  '/echo.js',
  '/security-utils.js',
  '/constants.js',
  '/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
