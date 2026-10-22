// Sélection assistée des exercices de leçons : `npx tsx scripts/pick-lessons.ts de|es`
// Affiche, pour chaque leçon, 6 exercices proposés (niveau exact, compétences et mots-clés, formats variés,
// jamais deux fois le même exercice). Un humain relit puis recopie dans de/es-lessons.ts.
import { EXERCISES } from "../packages/shared/src/curriculum.js";
import { GUIDED_LESSONS } from "../packages/shared/src/lessons.js";
import type { Exercise } from "../packages/shared/src/types.js";

type Config = Record<string, { skills: string[]; keywords: string[]; topics?: string[] }>;
const CONFIGS: Record<string, Config> = JSON.parse(await (await import("node:fs/promises")).readFile(new URL(`./lesson-config-${process.argv[2]}.json`, import.meta.url), "utf8"));

const language = process.argv[2] as "de" | "es";
const text = (item: Exercise) => [item.id, item.prompt, item.answer, item.focus, ...(item.pairs ?? []).flatMap((p) => [p.target, p.native]), ...(item.choices ?? [])].join(" ").toLocaleLowerCase();
const used = new Set<string>();
const lessons = GUIDED_LESSONS.filter((lesson) => lesson.language === language).sort((a, b) => a.sequence - b.sequence);
for (const lesson of lessons) {
  const config = CONFIGS[lesson.id];
  if (!config) { console.log(`# ${lesson.id}: pas de configuration`); continue; }
  const pool = EXERCISES.filter((item) => item.language === language && item.level === lesson.level && !used.has(item.id) && item.type !== "listening" || (item.language === language && item.level === lesson.level && item.type === "listening" && !used.has(item.id)));
  const score = (item: Exercise) =>
    (item.skillTags ?? []).filter((tag) => config.skills.includes(tag)).length * 4
    + config.keywords.filter((keyword) => text(item).includes(keyword.toLowerCase())).length * 3
    + (config.topics?.includes(item.topic ?? "") ? 1 : 0)
    + (item.id.includes("-hw-") || item.id.startsWith(`${language}-a`) || item.id.startsWith(`${language}-b`) ? 0.5 : 0);
  const chosen: Exercise[] = [];
  while (chosen.length < 6) {
    const types = new Map<string, number>();
    for (const item of chosen) types.set(item.type, (types.get(item.type) ?? 0) + 1);
    const best = pool.filter((item) => !chosen.includes(item) && !used.has(item.id) && score(item) > 0 && (types.get(item.type) ?? 0) < 2)
      .sort((a, b) => (score(b) - (types.get(b.type) ?? 0) * 2) - (score(a) - (types.get(a.type) ?? 0) * 2) || a.id.localeCompare(b.id))[0];
    if (!best) break;
    chosen.push(best);
  }
  for (const item of chosen) used.add(item.id);
  console.log(`\n${lesson.sequence}. ${lesson.id} ${lesson.level} « ${lesson.title} » (${chosen.length}/6)`);
  for (const item of chosen) console.log(`   "${item.id}", // ${item.type} · ${(item.type === "word-bank" || item.type === "listening" ? item.answer : item.prompt).slice(0, 70)}`);
}
