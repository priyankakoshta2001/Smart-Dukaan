/* Smart Dukaan service worker — network-first with cache fallback. */
const CACHE = "smartdukaan-shell-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Purge older shell caches so a new deploy never serves stale CSS/JS.
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        event.waitUntil(
          caches.open(CACHE).then((cache) => cache.put(request, copy).catch(() => undefined)),
        );
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
