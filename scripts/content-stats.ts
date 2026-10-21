// Statistiques du catalogue : `npx tsx scripts/content-stats.ts [en|de|es]`
import { EXERCISES } from "../packages/shared/src/curriculum.js";

const language = process.argv[2] ?? "en";
const exercises = EXERCISES.filter((exercise) => exercise.language === language);
const count = (key: "topic" | "type" | "level") => exercises.reduce<Record<string, number>>((totals, exercise) => {
  const value = exercise[key] ?? "(sans thème)";
  totals[value] = (totals[value] ?? 0) + 1;
  return totals;
}, {});

console.log(`Exercices ${language} : ${exercises.length}`);
console.log("Par thème :", count("topic"));
console.log("Par format :", count("type"));
console.log("Par niveau :", count("level"));
