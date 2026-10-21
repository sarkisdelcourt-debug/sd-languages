// Inventaire : `npx tsx scripts/lesson-dump.ts en`
import { EXERCISES } from "../packages/shared/src/curriculum.js";
import { GUIDED_LESSONS } from "../packages/shared/src/lessons.js";

const language = process.argv[2] ?? "en";
for (const lesson of GUIDED_LESSONS.filter((item) => item.language === language).sort((a, b) => a.sequence - b.sequence)) {
  console.log(`${lesson.sequence}. ${lesson.id} r${lesson.revision} ${lesson.level} « ${lesson.title} » — ${lesson.focus} | goals ${lesson.goalAffinity.join(",")} | scenario ${lesson.scenarioId}`);
  console.log(`   objectif : ${lesson.objective}`);
  for (const id of lesson.exerciseIds) {
    const exercise = EXERCISES.find((item) => item.id === id);
    console.log(`   - ${id} [${exercise?.type}] ${exercise?.prompt}`);
  }
}
