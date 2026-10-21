import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createEngine } from "../../../packages/engine/src/router.js";
import type { StateStore } from "../../../packages/engine/src/state.js";

/**
 * Adaptateur HTTP du moteur. Depuis le passage au téléphone, l'interface exécute le moteur dans le
 * navigateur ; ce serveur ne sert plus que le build sur le PC, les tests de parité et la reprise
 * de l'ancien fichier `data/sd-languages.json` via `/api/export`.
 */
export function createApp(store: StateStore) {
  const app = express();
  const engine = createEngine(store);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));

  app.use("/api", async (request, response) => {
    const result = await engine.handle(request.method, request.originalUrl, request.body);
    if (request.path === "/export" && result.status === 200) {
      response.setHeader("Content-Disposition", `attachment; filename=sd-languages-export-${new Date().toISOString().slice(0, 10)}.json`);
    }
    response.status(result.status).json(result.body);
  });

  if (process.env.NODE_ENV === "production") {
    const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
    const webDirectory = path.resolve(currentDirectory, "../../web/dist");
    if (existsSync(webDirectory)) {
      app.use(express.static(webDirectory));
      app.use((request, response, next) => {
        // Un fichier absent (icône, script) doit rester un 404, jamais la page : sinon le cache hors
        // ligne garderait du HTML à la place d'une image.
        if (request.method !== "GET" || path.extname(request.path)) return next();
        return response.sendFile(path.join(webDirectory, "index.html"));
      });
    }
  }

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(error);
    response.status(500).json({ error: "Erreur locale inattendue." });
  });

  return app;
}
