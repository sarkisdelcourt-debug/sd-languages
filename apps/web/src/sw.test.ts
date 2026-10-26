import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

/**
 * Le service worker est exécuté tel quel dans un bac à sable avec de faux caches et un faux réseau (audit du 26/10/2026) :
 * installation interrompue, plages audio. Ce n'est pas Safari, mais ça fixe les scénarios qui avaient été simulés à la main.
 */
const SOURCE = readFileSync(join(process.cwd(), "apps", "web", "public", "sw.js"), "utf8");
const ORIGIN = "https://example.test/app/";

function createWorker(network: (url: string) => Response | undefined) {
  const listeners: Record<string, (event: unknown) => void> = {};
  const store = new Map<string, Map<string, Response>>();
  const cacheOf = (name: string) => {
    if (!store.has(name)) store.set(name, new Map());
    const entries = store.get(name)!;
    const key = (request: Request | string) => (typeof request === "string" ? request : request.url);
    return {
      async match(request: Request | string) { return entries.get(key(request))?.clone(); },
      async put(request: Request | string, response: Response) { entries.set(key(request), response); },
      async add(request: Request | string) {
        const response = network(key(request));
        if (!response || !response.ok) throw new TypeError(`indisponible : ${key(request)}`);
        entries.set(key(request), response);
      }
    };
  };
  const caches = {
    open: async (name: string) => cacheOf(name),
    keys: async () => [...store.keys()],
    delete: async (name: string) => store.delete(name),
    match: async (request: Request | string) => { for (const name of store.keys()) { const hit = await cacheOf(name).match(request); if (hit) return hit; } return undefined; }
  };
  const fetchImpl = async (request: Request | string) => {
    const response = network(typeof request === "string" ? request : request.url);
    if (!response) throw new TypeError("réseau coupé");
    return response.clone();
  };
  runInNewContext(SOURCE, {
    self: { registration: { scope: ORIGIN }, addEventListener: (name: string, handler: (event: unknown) => void) => { listeners[name] = handler; }, skipWaiting() {}, clients: { claim() {} }, location: { origin: "https://example.test" } },
    caches, fetch: fetchImpl, Response, Request, URL, URLSearchParams, Promise
  });
  const waitUntil = (promises: Promise<unknown>[]) => (promise: Promise<unknown>) => { promises.push(promise); };
  return {
    store,
    async install() {
      const pending: Promise<unknown>[] = [];
      listeners.install!({ waitUntil: waitUntil(pending) });
      await Promise.all(pending);
    },
    async fetchEvent(request: Request) {
      let answer: Promise<Response> | undefined;
      const pending: Promise<unknown>[] = [];
      listeners.fetch!({ request, respondWith: (promise: Promise<Response>) => { answer = promise; }, waitUntil: waitUntil(pending) });
      const response = answer ? await answer : undefined;
      await Promise.allSettled(pending);
      return response;
    }
  };
}

const PAGE_HTML = '<!doctype html><script type="module" src="/app/assets/index-abc.js"></script><link rel="stylesheet" href="/app/assets/index-abc.css">';
const okNetwork = (url: string): Response | undefined => {
  if (url === ORIGIN) return new Response(PAGE_HTML, { headers: { "content-type": "text/html" } });
  if (url.endsWith("/assets/index-abc.js")) return new Response("console.log(1)");
  if (url.endsWith("/assets/index-abc.css")) return new Response("body{}");
  if (url.endsWith(".mp3")) return new Response(new Uint8Array(Array.from({ length: 1000 }, (_, index) => index % 256)), { headers: { "content-type": "audio/mpeg" } });
  return new Response("x");
};

describe("service worker", () => {
  it("met en cache la page avec ses scripts et ses styles à l'installation", async () => {
    const worker = createWorker(okNetwork);
    await worker.install();
    const shell = [...worker.store.keys()].find((name) => name.includes("shell"))!;
    const keys = [...worker.store.get(shell)!.keys()];
    expect(keys).toContain(ORIGIN);
    expect(keys.some((key) => key.endsWith("index-abc.js"))).toBe(true);
    expect(keys.some((key) => key.endsWith("index-abc.css"))).toBe(true);
  });

  it("n'enregistre JAMAIS la page si un script manque (pas d'écran blanc hors ligne après une mise à jour interrompue)", async () => {
    const worker = createWorker((url) => (url.endsWith("index-abc.js") ? undefined : okNetwork(url)));
    await expect(worker.install()).rejects.toBeTruthy();
    const shell = [...worker.store.keys()].find((name) => name.includes("shell"));
    expect(shell ? [...worker.store.get(shell)!.keys()] : []).not.toContain(ORIGIN);
  });

  it("répond aux requêtes par plages (Range) sur les enregistrements : 206 et le bon morceau", async () => {
    const worker = createWorker(okNetwork);
    await worker.install();
    const response = await worker.fetchEvent(new Request(`${ORIGIN}audio/en/abc.mp3`, { headers: { range: "bytes=100-199" } }));
    expect(response?.status).toBe(206);
    expect(response?.headers.get("content-range")).toBe("bytes 100-199/1000");
    const bytes = new Uint8Array(await response!.arrayBuffer());
    expect(bytes.length).toBe(100);
    expect(bytes[0]).toBe(100);
  });
});
