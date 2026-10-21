const CACHE_PREFIX = "sd-languages-";
const SHELL_CACHE = `${CACHE_PREFIX}shell-v4`;
const API_CACHE = `${CACHE_PREFIX}api-v4`;
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon.svg"];

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  const response = await fetch("/");
  if (!response.ok) throw new Error("Le shell de l'application n'est pas disponible.");
  const html = await response.clone().text();
  await cache.put("/", response);
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
  await Promise.allSettled([...SHELL.slice(1), ...assets].map((path) => cache.add(path)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== API_CACHE)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

async function withCacheMarker(response) {
  const headers = new Headers(response.headers);
  headers.set("X-SD-Data-Source", "cache");
  return new Response(await response.arrayBuffer(), {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function apiResponse(request) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(API_CACHE)).put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return withCacheMarker(cached);
    return new Response(JSON.stringify({ error: "Cette donnée n'a pas encore été préparée pour le mode hors ligne." }), {
      status: 503,
      headers: { "Content-Type": "application/json", "X-SD-Data-Source": "offline-miss" }
    });
  }
}

async function navigationResponse(request) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(SHELL_CACHE)).put("/", response.clone());
    return response;
  } catch {
    return (await caches.match("/")) ?? Response.error();
  }
}

async function assetResponse(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(SHELL_CACHE)).put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname === "/api/health" || requestUrl.pathname === "/api/export") {
    event.respondWith(fetch(event.request));
    return;
  }
  if (requestUrl.pathname.startsWith("/api/")) {
    event.respondWith(apiResponse(event.request));
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(navigationResponse(event.request));
    return;
  }
  event.respondWith(assetResponse(event.request));
});
