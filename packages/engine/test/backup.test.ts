import { describe, expect, it } from "vitest";
import type { LearnerState } from "../../shared/src/types.js";
import {
  BackupFormatError,
  adoptBackup,
  assessImport,
  createBackup,
  isPristine,
  noteChange,
  parseBackupFile,
  summarizeState
} from "../src/backup.js";
import { createInitialState } from "../src/initial-state.js";

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
