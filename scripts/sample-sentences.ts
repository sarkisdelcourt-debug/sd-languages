// Relecture : `npx tsx scripts/sample-sentences.ts es 40` imprime des phrases-modèles (« -build »).
import { EXERCISES } from "../packages/shared/src/curriculum.js";

const [language = "es", count = "40"] = process.argv.slice(2);
const sentences = EXERCISES.filter((item) => item.language === language && item.id.endsWith("-build"));
const step = Math.max(1, Math.floor(sentences.length / Number(count)));
for (const item of sentences.filter((_, index) => index % step === 0)) {
  console.log(`${item.id} ${item.level} | ${item.answer} | ${item.prompt.replace(/^Construisez : /, "")}`);
}
