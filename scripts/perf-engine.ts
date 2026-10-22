// Mesure du coût de démarrage du catalogue (hors réseau) : `npx tsx scripts/perf-engine.ts`
const start = performance.now();
const { EXERCISES } = await import("../packages/shared/src/curriculum.js");
const loaded = performance.now();
const { GUIDED_LESSONS } = await import("../packages/shared/src/lessons.js");
const { createEngine } = await import("../packages/engine/src/router.js");
const { createInitialState } = await import("../packages/engine/src/initial-state.js");
const state = createInitialState();
const engine = createEngine({ read: async () => structuredClone(state), update: async (mutation) => mutation(state) });
const t0 = performance.now();
for (const path of ["/api/dashboard", "/api/practice/en", "/api/practice-topics/en", "/api/lessons/en", "/api/plan/en", "/api/skills/en"]) {
  const a = performance.now();
  await engine.handle("GET", path);
  console.log(path.padEnd(26), (performance.now() - a).toFixed(1), "ms");
}
console.log(`catalogue : ${EXERCISES.length} exercices, ${GUIDED_LESSONS.length} leçons, chargé en ${(loaded - start).toFixed(0)} ms`);
console.log(`routes : ${(performance.now() - t0).toFixed(0)} ms au total`);
