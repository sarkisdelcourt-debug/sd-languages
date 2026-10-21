// Depuis le mode téléphone, le moteur et la progression vivent dans l'appareil (IndexedDB).
// Le service worker ne garde donc que l'application elle-même : page, scripts, styles, icônes.
// Toutes les adresses sont relatives à sa portée : « / » sur le PC, « /sd-languages/ » sur GitHub Pages.
// Les appels /api restants (reprise de l'ancien fichier du PC) passent toujours par le réseau.
const CACHE_PREFIX = "sd-languages-";
const SHELL_CACHE = `${CACHE_PREFIX}shell-v7`;
const SCOPE = new URL(self.registration.scope);
const at = (relative) => new URL(relative, SCOPE).href;
const PAGE = at("./");
const SHELL = ["manifest.webmanifest", "icons/icon.svg", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"].map(at);

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  const response = await fetch(PAGE, { cache: "no-store" });
  if (!response.ok) throw new Error("Le shell de l'application n'est pas disponible.");
  const html = await response.clone().text();
  await cache.put(PAGE, response);
  const assets = [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map((match) => new URL(match[1], PAGE).href);
  await Promise.allSettled([...SHELL, ...assets].map((url) => cache.add(url)));
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
    if (response.ok) (await caches.open(SHELL_CACHE)).put(PAGE, response.clone());
    return response;
  } catch {
    return (await caches.match(PAGE)) ?? Response.error();
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
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;
  if (!requestUrl.href.startsWith(SCOPE.href) || requestUrl.pathname.includes("/api/")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(navigationResponse(event.request));
    return;
  }
  event.respondWith(assetResponse(event.request));
});
