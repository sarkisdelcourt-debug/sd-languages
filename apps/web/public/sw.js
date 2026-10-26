// Depuis le mode téléphone, le moteur et la progression vivent dans l'appareil (IndexedDB).
// Le service worker ne garde donc que l'application elle-même : page, scripts, styles, icônes.
// Toutes les adresses sont relatives à sa portée : « / » sur le PC, « /sd-languages/ » sur GitHub Pages.
// Les appels /api restants (reprise de l'ancien fichier du PC) passent toujours par le réseau.
const CACHE_PREFIX = "sd-languages-";
const SHELL_CACHE = `${CACHE_PREFIX}shell-v10`;
// Les voix (enregistrements) vivent dans leur propre cache : elles ne sont pas effacées à chaque mise à jour de l'application.
const AUDIO_CACHE = `${CACHE_PREFIX}audio-v1`;
const SCOPE = new URL(self.registration.scope);
const at = (relative) => new URL(relative, SCOPE).href;
const PAGE = at("./");
const SHELL = ["manifest.webmanifest", "icons/icon.svg", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"].map(at);

/** Adresses des scripts et feuilles de style que la page référence. */
const assetsOf = (html) => [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map((match) => new URL(match[1], PAGE).href);

/**
 * La page n'est mise en cache QU'APRÈS ses scripts et ses styles (audit du 26/10/2026) : une mise à jour interrompue ne peut plus
 * laisser une page en cache qui réclame un script absent (écran blanc hors ligne). Si un script manque, l'installation échoue :
 * l'ancienne version, complète, reste en place.
 */
async function cacheCompletePage(cache, response) {
  const html = await response.clone().text();
  await Promise.all(assetsOf(html).map((url) => cache.add(url)));
  await cache.put(PAGE, response);
}

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  const response = await fetch(PAGE, { cache: "no-store" });
  if (!response.ok) throw new Error("Le shell de l'application n'est pas disponible.");
  await cacheCompletePage(cache, response);
  await Promise.allSettled(SHELL.map((url) => cache.add(url)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== AUDIO_CACHE).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

async function navigationResponse(request, event) {
  try {
    const response = await fetch(request);
    // Réseau d'abord ; la page n'est gardée qu'avec tous ses scripts (voir cacheCompletePage). Un échec laisse l'ancienne page.
    if (response.ok) event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cacheCompletePage(cache, response.clone())).catch(() => undefined));
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

// Voix : cache d'abord. Safari demande les fichiers audio par plages (Range) : on répond en 206 depuis le fichier complet en cache.
async function audioResponse(request) {
  const cache = await caches.open(AUDIO_CACHE);
  let full = await cache.match(request.url);
  if (!full) {
    full = await fetch(request.url);
    if (!full.ok) return full;
    await cache.put(request.url, full.clone());
  }
  const range = request.headers.get("range");
  if (!range) return full;
  const buffer = await full.arrayBuffer();
  const match = /bytes=(\d*)-(\d*)/.exec(range);
  const start = match && match[1] ? Number(match[1]) : 0;
  const end = match && match[2] ? Math.min(Number(match[2]), buffer.byteLength - 1) : buffer.byteLength - 1;
  if (start > end || start >= buffer.byteLength) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${buffer.byteLength}` } });
  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    headers: { "Content-Type": "audio/mpeg", "Content-Range": `bytes ${start}-${end}/${buffer.byteLength}`, "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes" }
  });
}

async function manifestResponse(request) {
  const cache = await caches.open(AUDIO_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request.url, response.clone());
    return response;
  } catch {
    return (await cache.match(request.url)) ?? Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;
  if (!requestUrl.href.startsWith(SCOPE.href) || requestUrl.pathname.includes("/api/")) return;
  if (requestUrl.href === at("audio/manifest.json")) {
    event.respondWith(manifestResponse(event.request));
    return;
  }
  if (requestUrl.href.startsWith(at("audio/")) && requestUrl.pathname.endsWith(".mp3")) {
    event.respondWith(audioResponse(event.request));
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(navigationResponse(event.request, event));
    return;
  }
  event.respondWith(assetResponse(event.request));
});
