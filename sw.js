// Keeps the calculator working offline.
// When you upload new files, change VERSION (e.g. geg-slope-v4) so phones get the update.
const VERSION = 'geg-slope-v3';
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./fonts/plex-mono-400.woff2",
  "./fonts/plex-mono-500.woff2",
  "./fonts/plex-sans-400.woff2",
  "./fonts/plex-sans-500.woff2",
  "./fonts/plex-sans-600.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // Page: use the internet when available so updates arrive; use the saved copy offline.
    e.respondWith(fetch(req)
      .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html').then(r => r || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
