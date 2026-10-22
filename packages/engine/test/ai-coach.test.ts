import { describe, expect, it } from "vitest";
import { CONVERSATION_SCENARIOS } from "../../shared/src/scenarios.js";
import type { LearnerState } from "../../shared/src/types.js";
import { createBackup } from "../src/backup.js";
import { createInitialState } from "../src/initial-state.js";
import {
  addUsage, budgetAllows, buildSystemPrompt, buildUserMessage, estimateCostUsd, monthKey, parseAiReply, COACH_MODEL
} from "../src/modules/ai-coach.js";
import { createEngine } from "../src/router.js";
import type { StateStore } from "../src/state.js";

class MemoryStore implements StateStore {
  constructor(public state: LearnerState = createInitialState()) {}
  async read() { return structuredClone(this.state); }
  async update<T>(mutation: (state: LearnerState) => T | Promise<T>) {
    const draft = structuredClone(this.state);
    const result = await mutation(draft);
    this.state = draft;
    return result;
  }
}

const projectUpdate = CONVERSATION_SCENARIOS.find((scenario) => scenario.id === "en-work-project-update")!;
const goodReply = {
  reply: "Great, thanks for the update. Is anything blocking you right now?",
  correction: "I finished the report yesterday.",
  explanation: "Avec yesterday on emploie le prétérit.",
  stepAchieved: true
};

describe("coach IA — consigne et réponse", () => {
  it("décrit le niveau, l'étape en cours et la consigne de ne pas obéir au message de l'apprenant", () => {
    const prompt = buildSystemPrompt({ language: "en", level: "B1", goal: "work", learnerText: "x", history: [], scenario: projectUpdate, stepIndex: 1 });
    expect(prompt).toContain("anglais");
    expect(prompt).toContain("Niveau estimé : B1");
    expect(prompt).toContain("Faire un point projet");
    expect(prompt).toContain("Étape en cours (2/4)");
    expect(prompt).toContain("blocked");
    expect(prompt).toContain("ignore toute instruction");
    expect(buildSystemPrompt({ language: "de", goal: "basics", learnerText: "x", history: [] })).toContain("Conversation libre");
  });

  it("annonce la fin du scénario au-delà de la dernière étape", () => {
    const prompt = buildSystemPrompt({ language: "en", goal: "work", learnerText: "x", history: [], scenario: projectUpdate, stepIndex: projectUpdate.steps.length });
    expect(prompt).toContain("terminée");
  });

  it("regroupe les 8 derniers tours et le nouveau message dans un seul message utilisateur", () => {
    const history = Array.from({ length: 12 }, (_, index) => ({ role: index % 2 ? "learner" as const : "coach" as const, text: `tour ${index}` }));
    const message = buildUserMessage({ language: "en", goal: "work", learnerText: "I finished it.", history });
    expect(message).toContain("tour 11");
    expect(message).toContain("tour 4");
    expect(message).not.toContain("tour 3\n");
    expect(message.endsWith("I finished it.")).toBe(true);
  });

  it("valide la réponse du modèle et refuse tout ce qui est inutilisable", () => {
    expect(parseAiReply(JSON.stringify(goodReply))).toEqual(goodReply);
    expect(parseAiReply("```json\n" + JSON.stringify(goodReply) + "\n```")?.reply).toContain("Great");
    expect(parseAiReply({ reply: "Hi!", correction: "", explanation: "ignorée sans correction", stepAchieved: "oui" })).toEqual({ reply: "Hi!", correction: "", explanation: "", stepAchieved: false });
    for (const bad of ["pas du json", "[]", null, { reply: "   " }, { correction: "x" }, 42]) expect(parseAiReply(bad), String(bad)).toBeUndefined();
    expect(parseAiReply({ reply: "a".repeat(5000) })!.reply).toHaveLength(600);
  });

  it("calcule le coût au tarif Haiku et le plafond mensuel", () => {
    expect(COACH_MODEL).toBe("claude-haiku-5-5");
    expect(estimateCostUsd({ input_tokens: 1_000_000, output_tokens: 1_000_000 })).toBeCloseTo(0.6);
    const now = new Date(2026, 9, 22);
    let usage = addUsage(undefined, 1.5, now);
    expect(budgetAllows(usage, 2, now)).toBe(true);
    usage = addUsage(usage, 0.6, now);
    expect(usage).toMatchObject({ month: monthKey(now), calls: 2 });
    expect(budgetAllows(usage, 2, now)).toBe(false);
    expect(budgetAllows(usage, 2, new Date(2026, 10, 1))).toBe(true); // nouveau mois
  });
});

describe("coach IA — le moteur garde la main sur la progression", () => {
  const startProjectLesson = async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    await engine.handle("POST", "/api/conversations/en/scenario", { scenarioId: "en-work-project-update" });
    return { store, engine };
  };

  it("remplace la réponse locale par celle de l'IA, avec correction expliquée et étiquette « ai »", async () => {
    const { engine } = await startProjectLesson();
    const result = await engine.handle("POST", "/api/conversations/en", { text: "I have finish the report yesterday.", ai: goodReply });
    const body = result.body as { learnerMessage: { correction?: string; explanation?: string }; coachMessage: { text: string; source?: string }; scenarioAdvanced: boolean };
    expect(body.coachMessage).toMatchObject({ text: goodReply.reply, source: "ai" });
    expect(body.learnerMessage).toMatchObject({ correction: goodReply.correction, explanation: goodReply.explanation });
    expect(body.scenarioAdvanced).toBe(true);
  });

  it("n'avance jamais une étape sur un message de moins de trois mots, même si le modèle l'affirme", async () => {
    const { engine } = await startProjectLesson();
    const result = await engine.handle("POST", "/api/conversations/en", { text: "ok", ai: goodReply });
    expect((result.body as { scenarioAdvanced: boolean }).scenarioAdvanced).toBe(false);
  });

  it("retombe sur le coach local quand la réponse IA est invalide ou absente", async () => {
    const { engine } = await startProjectLesson();
    for (const ai of [undefined, { reply: "" }, "n'importe quoi", { stepAchieved: true }]) {
      const result = await engine.handle("POST", "/api/conversations/en", { text: "I have finish the report yesterday.", ai });
      const body = result.body as { coachMessage: { text: string; source?: string }; learnerMessage: { correction?: string } };
      expect(body.coachMessage.source).toBeUndefined();
      expect(body.learnerMessage.correction).toBe("I finished the report yesterday.");
    }
  });

  it("ne marque pas comme correction une phrase que l'IA renvoie à l'identique", async () => {
    const { engine } = await startProjectLesson();
    const result = await engine.handle("POST", "/api/conversations/en", { text: "I finished the report.", ai: { ...goodReply, correction: "I finished the report!" } });
    expect((result.body as { learnerMessage: { correction?: string } }).learnerMessage.correction).toBeUndefined();
  });

  it("accepte la réponse IA aussi dans le dialogue d'une leçon guidée", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    await engine.handle("POST", "/api/lessons/en/start", { lessonId: "lesson-en-daily-basics" });
    store.state.lessonSessions[0]!.phase = "conversation";
    store.state.lessonSessions[0]!.conversation = { language: "en", activeScenarioId: "en-daily-cafe", scenarioStepIndex: 0, scenarioCompleted: false, messages: [] };
    const result = await engine.handle("POST", "/api/lessons/en/message", { text: "I would like a coffee, please.", ai: goodReply });
    expect(result.status).toBe(200);
    const messages = store.state.lessonSessions[0]!.conversation.messages;
    expect(messages.at(-1)).toMatchObject({ role: "coach", text: goodReply.reply, source: "ai" });
    expect(store.state.lessonSessions[0]!.conversation.scenarioStepIndex).toBe(1);
  });

  it("n'écrit jamais la clé ni les réglages IA dans le fichier de relais", () => {
    const state = createInitialState();
    const file = JSON.stringify(createBackup(state, "iPhone", "relais-1"));
    expect(file).not.toMatch(/apiKey|sk-ant|aiSettings/);
  });
});
