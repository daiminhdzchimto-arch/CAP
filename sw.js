const CACHE_VERSION = "cap-pwa-v3-2026-04-02";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./version.json",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./robots.txt",
  "./sitemap.xml",
  "./sitemap-index.xml",
  "./assets/models/phong-hoc-phong-phu.glb",
  "./assets/images/duty-calendar.svg",
  "./assets/images/competition-trophy.svg",
  "./assets/images/classroom-board.svg",
  "./assets/images/teacher-desk.svg",
  "./assets/images/student-team.svg",
  "./assets/images/shuffle-seats.svg",
  "./assets/images/classroom-door.svg",
  "./assets/images/bac-ho-portrait.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((oldKey) => caches.delete(oldKey)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (!isSameOrigin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request)),
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put("./index.html", cloned);
          });
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(event.request)) ||
            (await caches.match("./index.html"))
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200)
            return networkResponse;
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    }),
  );
});
