
const CACHE_NAME = "mkcomputer-v1";

const FILES = [
  "/mkcomputer/",
  "/mkcomputer/index.html",
  "/mkcomputer/styles.css",
  "/mkcomputer/app.js",
  "/mkcomputer/manifest.webmanifest",
  "/mkcomputer/mk-icon-192.png",
  "/mkcomputer/mk-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
