// Simule GitHub Pages : sert apps/web/dist sous /sd-languages/ (404 ailleurs, comme Pages).
// Usage : npm run build:pages puis node scripts/serve-pages.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../apps/web/dist");
const port = process.env.PORT ?? "8796";
const prefix = "/sd-languages/";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

createServer(async (request, response) => {
  const url = new URL(request.url, "http://local");
  if (!url.pathname.startsWith(prefix)) return response.writeHead(404).end("404");
  let relative = decodeURIComponent(url.pathname.slice(prefix.length)) || "index.html";
  const file = path.join(root, relative);
  if (!file.startsWith(path.resolve(root))) return response.writeHead(403).end();
  try {
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html" }).end("<h1>404</h1>");
  }
}).listen(Number(port), "127.0.0.1", () => console.log(`http://localhost:${port}${prefix}`));
