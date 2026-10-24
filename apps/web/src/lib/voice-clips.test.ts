import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EXERCISES } from "../../../../packages/shared/src/curriculum.js";

const AUDIO = join(process.cwd(), "apps", "web", "public", "audio");
const manifest = JSON.parse(readFileSync(join(AUDIO, "manifest.json"), "utf8")) as {
  voices: Record<string, string>; clips: Record<string, Record<string, string>>; slow: Record<string, string[]>;
};

describe("voix intégrées (enregistrements Piper)", () => {
  it("fournit des enregistrements pour les trois langues, avec crédit de la voix", () => {
    for (const language of ["en", "de", "es"]) {
      expect(Object.keys(manifest.clips[language]!).length, language).toBeGreaterThan(300);
      expect(manifest.voices[language], language).toMatch(/Piper/);
    }
    expect(manifest.voices.en).toMatch(/CC BY 4\.0/);
  });
  it("a un fichier pour chaque entrée du manifeste, normale et lente", () => {
    const missing: string[] = [];
    for (const [language, clips] of Object.entries(manifest.clips)) {
      for (const id of new Set(Object.values(clips))) if (!existsSync(join(AUDIO, language, `${id}.mp3`))) missing.push(`${language}/${id}`);
      for (const id of manifest.slow[language]!) if (!existsSync(join(AUDIO, language, `${id}-s.mp3`))) missing.push(`${language}/${id}-s`);
    }
    expect(missing).toEqual([]);
  });
  it("couvre chaque dictée (exercice d'écoute) de chaque langue", () => {
    const absent = EXERCISES.filter((exercise) => exercise.audioText && !manifest.clips[exercise.language]![exercise.audioText]).map((exercise) => exercise.id);
    expect(absent).toEqual([]);
  });
});
