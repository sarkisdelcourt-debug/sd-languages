import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EXERCISES } from "../src/curriculum.js";
import { PHRASES } from "../src/content/phrase-drills.js";

/**
 * Règle d'or : un identifiant publié ne change jamais (la progression, les erreurs et l'historique s'y accrochent).
 * Le fichier ids.snapshot.json garde la liste connue ; ajouter est permis, retirer ou renommer fait échouer ce test.
 * Pour accepter volontairement un ajout : UPDATE_IDS=1 npx vitest run packages/shared/test/ids-stability.test.ts
 */
const FILE = join(process.cwd(), "packages", "shared", "test", "ids.snapshot.json");
const current = () => ({
  exercises: EXERCISES.map((exercise) => exercise.id).sort(),
  phrases: Object.fromEntries(Object.entries(PHRASES).map(([language, items]) => [language, items.map((item) => item.id).sort()]))
});

describe("stabilité des identifiants publiés", () => {
  it("aucun identifiant d'exercice ou de phrase publié ne disparaît", () => {
    if (!existsSync(FILE) || process.env.UPDATE_IDS) {
      writeFileSync(FILE, JSON.stringify(current()));
      return;
    }
    const known = JSON.parse(readFileSync(FILE, "utf8")) as ReturnType<typeof current>;
    const now = current();
    const exercises = new Set(now.exercises);
    expect(known.exercises.filter((id) => !exercises.has(id))).toEqual([]);
    for (const [language, ids] of Object.entries(known.phrases)) {
      const present = new Set((now.phrases as Record<string, string[]>)[language] ?? []);
      expect((ids as string[]).filter((id) => !present.has(id))).toEqual([]);
    }
  });
});
