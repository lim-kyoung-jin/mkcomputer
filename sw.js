
const CACHE_NAME = "mkcomputer-v3";

const FILES = [
  "/mkcomputer/",
  "/mkcomputer/index.html",
  "/mkcomputer/styles.css",
  "/mkcomputer/app.js",
  "/mkcomputer/manifest.webmanifest",
  "/mkcomputer/mk-icon-192.png",
  "/mkcomputer/mk-icon-512.png"
];

// 앱 설치 시 기본 파일 저장
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// 이전 버전 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key.startsWith("mkcomputer-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 인터넷 우선, 연결 실패 시 캐시 사용
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();

        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            return cache.put(request, copy);
          })
        );
      }
      return response;
    }).catch(async () => {
      return (await caches.match(request)) ||
        Response.error();
    })
  );
});
