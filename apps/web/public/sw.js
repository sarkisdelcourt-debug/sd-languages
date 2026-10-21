// Depuis le mode téléphone, le moteur et la progression vivent dans l'appareil (IndexedDB).
// Le service worker ne garde donc que l'application elle-même : page, scripts, styles, icônes.
// Les appels /api restants (reprise de l'ancien fichier du PC) passent toujours par le réseau.
const CACHE_PREFIX = "sd-languages-";
const SHELL_CACHE = `${CACHE_PREFIX}shell-v6`;
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon.svg", "/icons/apple-touch-icon.png", "/icons/icon-192.png", "/icons/icon-512.png"];

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  const response = await fetch("/", { cache: "no-store" });
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
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

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
  const isPage = response.headers.get("content-type")?.includes("text/html");
  if (response.ok && !isPage) (await caches.open(SHELL_CACHE)).put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.startsWith("/api/")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(navigationResponse(event.request));
    return;
  }
  event.respondWith(assetResponse(event.request));
});
