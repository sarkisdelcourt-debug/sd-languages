import path from "node:path";
import { createApp } from "./app.js";
import { JsonStore } from "./data/json-store.js";

const port = Number(process.env.PORT ?? 8787);
const dataFile = path.resolve(process.env.SD_LANGUAGES_DATA_FILE ?? path.join(process.cwd(), "data", "sd-languages.json"));
const app = createApp(new JsonStore(dataFile));

app.listen(port, "127.0.0.1", () => {
  console.log(`SD Languages est disponible sur http://localhost:${port}`);
  console.log(`Données locales : ${dataFile}`);
});
