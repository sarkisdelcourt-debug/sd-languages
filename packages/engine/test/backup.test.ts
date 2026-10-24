import { describe, expect, it } from "vitest";
import type { LearnerState } from "../../shared/src/types.js";
import {
  BackupFormatError,
  adoptBackup,
  applyExportCheckpoint,
  assessImport,
  createBackup,
  isPristine,
  noteChange,
  parseBackupFile,
  summarizeState,
  syncRevision
} from "../src/backup.js";
import { createInitialState } from "../src/initial-state.js";
import { createDashboard } from "../src/modules/progress.js";

/** Simule une activité réelle sur un appareil : des XP et un changement compté. */
function practise(state: LearnerState, xp = 10) {
  state.progress.es.xp += xp;
  state.progress.es.completedExercises += 1;
  noteChange(state, new Date("2026-10-20T21:30:00.000Z"));
}

/** Envoi depuis un appareil : renvoie l'état de l'appareil après envoi et le fichier transmis. */
function send(state: LearnerState, device: string, checkpointId: string) {
  const file = createBackup(state, device, checkpointId, new Date("2026-10-20T22:00:00.000Z"));
  return { device: file.state, text: JSON.stringify(file) };
}

function receive(text: string) {
  return adoptBackup(parseBackupFile(text).state, "fallback-checkpoint");
}

describe("relais par fichier entre le PC et l'iPhone", () => {
  it("laisse un iPhone neuf reprendre la progression du PC sans avertissement", () => {
    const pc = createInitialState();
    practise(pc);
    const { text } = send(pc, "PC", "relais-1");
    const iphone = createInitialState();
    expect(isPristine(iphone)).toBe(true);
    expect(assessImport(iphone, parseBackupFile(text).state).verdict).toBe("safe");
  });

  it("enchaîne PC → iPhone → PC sans avertissement quand chacun attend son tour", () => {
    let pc = createInitialState();
    practise(pc);
    const first = send(pc, "PC", "relais-1");
    pc = first.device;
    let iphone = receive(first.text);

    // Lundi soir : deux leçons d'espagnol sur l'iPhone, puis envoi.
    practise(iphone);
    practise(iphone);
    const second = send(iphone, "iPhone", "relais-2");
    iphone = second.device;

    // Mardi midi : le PC n'a rien fait depuis son envoi, il reprend sans risque.
    const assessment = assessImport(pc, parseBackupFile(second.text).state);
    expect(assessment.verdict).toBe("safe");
    expect(assessment.reasons).toEqual([]);
    pc = receive(second.text);
    expect(pc.progress.es.xp).toBe(30);
    expect(pc.sync?.changesSinceCheckpoint).toBe(0);
  });

  it("prévient avant d'écraser une leçon faite sur le PC pendant que l'iPhone travaillait", () => {
    let pc = createInitialState();
    practise(pc);
    const first = send(pc, "PC", "relais-1");
    pc = first.device;
    const iphone = receive(first.text);

    practise(iphone);
    const fromIphone = send(iphone, "iPhone", "relais-2");
    practise(pc); // mardi midi : une leçon d'anglais faite sur le PC sans avoir repris le fichier

    const assessment = assessImport(pc, parseBackupFile(fromIphone.text).state);
    expect(assessment.verdict).toBe("warning");
    expect(assessment.reasons[0]).toContain("1 changement depuis le dernier relais");
  });

  it("prévient quand on reprend un fichier plus ancien que l'appareil", () => {
    const pc = createInitialState();
    practise(pc);
    const old = send(pc, "PC", "relais-1");
    let iphone = receive(old.text);
    practise(iphone);
    iphone = send(iphone, "iPhone", "relais-2").device;

    const assessment = assessImport(iphone, parseBackupFile(old.text).state);
    expect(assessment.verdict).toBe("warning");
    expect(assessment.reasons.join(" ")).toContain("plus ancien");
  });

  it("reconnaît un fichier déjà repris", () => {
    const pc = createInitialState();
    practise(pc);
    const { text } = send(pc, "PC", "relais-1");
    const iphone = receive(text);
    expect(assessImport(iphone, parseBackupFile(text).state).verdict).toBe("identical");
  });

  it("prévient quand l'appareil a une progression jamais envoyée", () => {
    const pc = createInitialState();
    practise(pc);
    const iphone = createInitialState();
    practise(iphone);
    const fromPc = send(pc, "PC", "relais-1");
    expect(assessImport(iphone, parseBackupFile(fromPc.text).state).reasons[0]).toContain("jamais été envoyée");
  });
});

describe("lecture des fichiers de sauvegarde", () => {
  it("accepte l'ancienne exportation brute du serveur PC et la migre", () => {
    const legacy = createInitialState() as Partial<LearnerState>;
    delete legacy.pronunciationProgress;
    legacy.progress!.en.xp = 47;
    const parsed = parseBackupFile(JSON.stringify(legacy));
    expect(parsed.state.progress.en.xp).toBe(47);
    expect(parsed.state.pronunciationProgress).toEqual({});
    expect(parsed.device).toBeUndefined();
  });

  it("refuse les fichiers qui ne sont pas des profils SD Languages", () => {
    expect(() => parseBackupFile("pas du json")).toThrow(BackupFormatError);
    expect(() => parseBackupFile(JSON.stringify({ hello: "world" }))).toThrow("ne contient pas de progression");
    expect(() => parseBackupFile(JSON.stringify({ format: "autre-appli", state: {} }))).toThrow(BackupFormatError);
    expect(() => parseBackupFile(JSON.stringify({ progress: { en: { xp: "beaucoup" } } }))).toThrow("illisible");
    expect(() => parseBackupFile(JSON.stringify({ progress: {}, mistakes: "aucune" }))).toThrow("abîmée");
    expect(() => parseBackupFile(JSON.stringify({ progress: {}, version: 99 }))).toThrow("plus récente");
    expect(() => parseBackupFile(JSON.stringify({ format: "sd-languages-backup", formatVersion: 9, state: {} }))).toThrow("plus récente");
  });

  it("résume la progression pour l'aperçu avant reprise", () => {
    const state = createInitialState();
    practise(state, 25);
    const summary = summarizeState(state);
    expect(summary.languages.es).toMatchObject({ xp: 25, completedExercises: 1, completedLessons: 0, activeLesson: false });
    expect(summary.totalXp).toBe(25);
    expect(summary.lastActivityAt).toBe("2026-10-20T21:30:00.000Z");
  });
});

describe("import strict : chaque élément est vérifié avant tout remplacement (LANG-01)", () => {
  const card = (over: Record<string, unknown> = {}) => ({
    id: "c1", sourceExerciseId: "e1", language: "en", prompt: "p", answer: "a", focus: "f",
    nextReviewAt: "2026-10-21T10:00:00.000Z", intervalDays: 1, easeFactor: 2.5, repetitions: 0, lapses: 0, ...over
  });
  const parse = (patch: Record<string, unknown>) => parseBackupFile(JSON.stringify({ ...createInitialState(), ...patch }));

  it("refuse un tableau qui contient autre chose que des objets (cas reproduit : reviewCards:[null])", () => {
    expect(() => parse({ reviewCards: [null] })).toThrow(BackupFormatError);
    expect(() => parse({ reviewCards: [null] })).toThrow(/carte de révision n°1/);
    expect(() => parse({ mistakes: [42] })).toThrow(/erreur enregistrée n°1/);
    expect(() => parse({ lessonSessions: ["x"] })).toThrow(/séance de leçon n°1/);
    expect(() => parse({ processedAttemptIds: [1] })).toThrow(/identifiant de tentative n°1/);
  });

  it("dit quel élément est abîmé et pourquoi", () => {
    expect(() => parse({ reviewCards: [card(), card({ id: "c2", language: "fr" })] })).toThrow(/carte de révision n°2.*langue/);
    expect(() => parse({ reviewCards: [card({ nextReviewAt: 5 })] })).toThrow(/carte de révision n°1.*nextReviewAt/);
    expect(() => parse({ reviewCards: [card({ intervalDays: "deux" })] })).toThrow(/intervalDays/);
    expect(() => parse({ reviewCards: [{ language: "en" }] })).toThrow(/identifiant/);
    expect(() => parse({ lessonSessions: [{ id: "s", lessonId: "l", language: "en", status: "perdue", attempts: [] }] })).toThrow(/séance de leçon n°1.*statut/);
  });

  it("refuse les identifiants en double et les relations cassées", () => {
    expect(() => parse({ reviewCards: [card(), card()] })).toThrow(/carte de révision.*en double/);
    expect(() => parse({ conversations: { en: {} } })).toThrow(/conversation « en »/);
    expect(() => parse({ settings: { en: "x" } })).toThrow(/réglages « en »/);
    expect(() => parse({ lessonProgress: [] })).toThrow(/progression des leçons/);
    expect(() => parse({ sync: { checkpointHistory: [1], changesSinceCheckpoint: 0 } })).toThrow(/relais/);
    expect(() => parse({ sync: { checkpointHistory: [], changesSinceCheckpoint: "3" } })).toThrow(/relais/);
  });

  it("accepte un fichier réel et les anciens profils sans les champs récents", () => {
    const parsed = parse({ reviewCards: [card()], mistakes: [] });
    expect(parsed.state.reviewCards).toHaveLength(1);
    expect(createDashboard(parsed.state).totalCards).toBe(1);
    const old = { progress: { en: { language: "en", xp: 5, completedExercises: 1, correctAnswers: 1, currentStreak: 1 } }, reviewCards: [{ id: "x", language: "es" }] };
    expect(parseBackupFile(JSON.stringify(old)).state.reviewCards).toHaveLength(1);
  });

  it("tout fichier accepté peut ensuite être affiché sans erreur", () => {
    const odd: Record<string, unknown>[] = [{}, { reviewCards: [] }, { reviewCards: [{ id: "x", language: "de" }] }, { mistakes: [{ id: "m", language: "es" }] }, { conversations: {} }, { settings: {} }];
    for (const patch of odd) {
      let state;
      try { state = parse(patch).state; } catch (error) { expect(error).toBeInstanceOf(BackupFormatError); continue; }
      expect(() => { createDashboard(state); summarizeState(state); isPristine(state); }).not.toThrow();
    }
  });
});

describe("point de relais posé à l'envoi (LANG-02)", () => {
  const now = new Date("2026-10-21T10:00:00.000Z");

  it("pose le point après une activité préalable quand rien n'a changé pendant l'envoi (cas reproduit)", () => {
    const state = createInitialState();
    practise(state); // changesSinceCheckpoint = 1 avant l'envoi
    const revision = syncRevision(state);
    const backup = createBackup(state, "PC", "relais-1", now);
    const next = applyExportCheckpoint(state, backup, revision);
    expect(next.sync?.checkpointId).toBe("relais-1");
    expect(next.sync?.changesSinceCheckpoint).toBe(0);
    expect(next.progress.es.xp).toBe(state.progress.es.xp);
  });

  it("pose le point aussi sans activité préalable", () => {
    const state = createInitialState();
    const next = applyExportCheckpoint(state, createBackup(state, "PC", "relais-1", now), syncRevision(state));
    expect(next.sync?.checkpointId).toBe("relais-1");
  });

  it("ne pose pas le point si l'apprenant a travaillé pendant l'envoi, et garde son travail", () => {
    const state = createInitialState();
    practise(state);
    const revision = syncRevision(state);
    const backup = createBackup(state, "PC", "relais-1", now);
    const duringShare = structuredClone(state);
    practise(duringShare, 7); // une leçon terminée pendant la feuille de partage
    const next = applyExportCheckpoint(duringShare, backup, revision);
    expect(next).toEqual(duringShare);
    expect(next.sync?.checkpointId).toBeUndefined();
    expect(next.sync?.changesSinceCheckpoint).toBe(2);
    expect(next.progress.es.xp).toBe(17);
  });

  it("l'état courant n'est jamais modifié en place", () => {
    const state = createInitialState();
    practise(state);
    const before = JSON.stringify(state);
    applyExportCheckpoint(state, createBackup(state, "PC", "relais-1", now), syncRevision(state));
    expect(JSON.stringify(state)).toBe(before);
  });
});

describe("import strict : séances et conversations (audit du 24/10/2026)", () => {
  const file = (patch: Record<string, unknown>) => JSON.stringify({ format: "sd-languages-backup", formatVersion: 1, exportedAt: "2026-10-24T10:00:00.000Z", device: "test", state: { ...createInitialState(), ...patch } });
  it("refuse une séance sans liste de tentatives ou sans leçon", () => {
    expect(() => parseBackupFile(file({ lessonSessions: [{ id: "s", language: "en", status: "active" }] }))).toThrow(BackupFormatError);
    expect(() => parseBackupFile(file({ lessonSessions: [{ id: "s", language: "en", status: "active", attempts: [] }] }))).toThrow(BackupFormatError);
  });
  it("refuse des messages de conversation qui ne sont pas des objets", () => {
    const state = createInitialState();
    expect(() => parseBackupFile(file({ conversations: { ...state.conversations, en: { ...state.conversations.en, messages: [null] } } }))).toThrow(BackupFormatError);
  });
});
