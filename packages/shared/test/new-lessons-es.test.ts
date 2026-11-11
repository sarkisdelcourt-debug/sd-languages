import { describe, expect, it } from "vitest";
import { keywordPresent } from "../../engine/src/modules/coach.js";
import { EXERCISES } from "../src/curriculum.js";
import { evaluateAnswer, normalizeAnswer } from "../src/learning.js";
import { GUIDED_LESSONS } from "../src/lessons.js";
import { CONVERSATION_SCENARIOS } from "../src/scenarios.js";

/** Cas issus de l'audit indépendant du 11/11/2026 sur les quatre leçons espagnoles complémentaires. */
const exercise = (id: string) => EXERCISES.find((candidate) => candidate.id === id)!;
const CASES: Record<string, { ok: string[]; bad: string[] }> = {
  "es-le-sante-tr-fievre-gorge": {
    ok: ["Tengo fiebre y me duele la garganta desde hace dos días.", "Hace dos días que tengo fiebre y me duele la garganta."],
    bad: ["Tengo fiebre y me duele la garganta desde dos días.", "Estoy fiebre y me duele la garganta desde hace dos días."]
  },
  "es-le-avis-tr-clim": {
    ok: ["Quisiera quejarme: el aire acondicionado no funciona.", "Me quiero quejar: el aire acondicionado no funciona."],
    bad: ["Quisiera quejarse: el aire acondicionado no funciona.", "Quiero quejar: el aire acondicionado no funciona."]
  },
  "es-le-chemin-tr-banque": {
    ok: ["El banco se encuentra al lado de la plaza."],
    bad: ["El banco está al lado del plaza.", "El banco es al lado de la plaza."]
  },
  "es-le-sante-gap-duelen": { ok: ["duelen"], bad: ["duele"] },
  "es-le-marche-tr-fraises": { ok: ["¿A cuánto están las fresas, por favor?"], bad: ["¿Cuánto cuesta las fresas, por favor?"] },
  "es-s-x-138-build": { ok: ["No hay problema, mañana le devolveremos el dinero."], bad: [] },
  "es-s-034-build": { ok: ["En el semáforo gire a la derecha."], bad: ["Gire a la izquierda en el semáforo."] }
};

describe("leçons espagnoles complémentaires : réponses", () => {
  for (const [id, { ok, bad }] of Object.entries(CASES)) {
    it(`${id} accepte les formulations justes et refuse les fautes`, () => {
      for (const answer of ok) expect(evaluateAnswer(exercise(id), answer).correct, answer).toBe(true);
      for (const answer of bad) expect(evaluateAnswer(exercise(id), answer).correct, answer).toBe(false);
    });
  }

  it("garde une explication correcte pour la prononciation de jersey", () => {
    expect(exercise("es-s-028-listen").explanation).toContain("jota");
  });

  it("n'emploie que des exercices existants, du niveau de la leçon", () => {
    for (const lesson of GUIDED_LESSONS.filter((candidate) => ["lesson-es-ask-the-way", "lesson-es-market-shopping", "lesson-es-doctor-pharmacy", "lesson-es-complain-and-opine"].includes(candidate.id))) {
      for (const id of lesson.exerciseIds) expect(exercise(id)?.level, `${lesson.id} → ${id}`).toBe(lesson.level);
    }
  });
});

describe("scénarios espagnols complémentaires : avance d'étape", () => {
  const advances = (scenarioId: string, stepIndex: number, text: string) => {
    const step = CONVERSATION_SCENARIOS.find((scenario) => scenario.id === scenarioId)!.steps[stepIndex]!;
    return step.keywords.some((keyword) => keywordPresent(normalizeAnswer(text), keyword));
  };
  const cases: Array<[string, number, string, boolean]> = [
    ["es-complain-politely", 0, "La habitación no está limpia.", true],
    ["es-complain-politely", 0, "Me gustaría reservar una mesa para cenar.", false],
    ["es-complain-politely", 1, "El aire acondicionado no funciona desde esta mañana.", true],
    ["es-complain-politely", 2, "Quiero que lo arreglen esta noche.", true],
    ["es-complain-politely", 3, "Sí, me parece una buena solución.", true],
    ["es-at-the-market", 0, "Una docena de huevos, por favor.", true],
    ["es-at-the-market", 1, "No, nada más, gracias.", true],
    ["es-at-the-market", 2, "Aquí tiene, seis euros.", true],
    ["es-at-the-market", 2, "No hay nada en la tele.", false],
    ["es-at-the-doctor", 0, "Me encuentro mal desde ayer.", true],
    ["es-at-the-doctor", 2, "Sí, a la penicilina.", true],
    ["es-at-the-doctor", 3, "¿Cuántas pastillas al día?", true],
    ["es-find-the-way", 0, "Estoy buscando la calle Mayor.", true],
    ["es-find-the-way", 0, "Voy a comer una paella esta noche.", false],
    ["es-find-the-way", 2, "¿Se puede ir andando?", true],
    ["es-find-the-way", 3, "Muy bien, se lo agradezco.", true]
  ];
  for (const [scenarioId, step, text, expected] of cases) {
    it(`${scenarioId} étape ${step + 1} : « ${text} » ${expected ? "avance" : "n'avance pas"}`, () => {
      expect(advances(scenarioId, step, text)).toBe(expected);
    });
  }
});
