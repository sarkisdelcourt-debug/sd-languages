// Inventaire compact de la banque : `npx tsx scripts/bank-dump.ts en <topic|all>`
import { EXERCISES } from "../packages/shared/src/curriculum.js";

const [language = "en", topic = "all"] = process.argv.slice(2);
for (const exercise of EXERCISES.filter((item) => item.language === language && (topic === "all" || item.topic === topic))) {
  if (exercise.type === "listening") continue;
  const text = exercise.type === "word-bank" || exercise.type === "listening" ? exercise.answer : exercise.prompt;
  console.log(`${exercise.id} ${exercise.level} ${exercise.type} | ${exercise.focus} | ${text.slice(0, 90)}`);
}
