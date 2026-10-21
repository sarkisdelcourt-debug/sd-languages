import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { LearnerState } from "../../../../packages/shared/src/types.js";
import { createInitialState } from "./initial-state.js";

export class JsonStore {
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  async read(): Promise<LearnerState> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return this.migrate(JSON.parse(raw) as Partial<LearnerState>);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      const state = createInitialState();
      await this.write(state);
      return state;
    }
  }

  async update<T>(mutation: (state: LearnerState) => T | Promise<T>): Promise<T> {
    let result!: T;
    const operation = this.queue.then(async () => {
      const state = await this.read();
      result = await mutation(state);
      await this.write(state);
    });
    this.queue = operation.catch(() => undefined);
    await operation;
    return result;
  }

  private async write(state: LearnerState): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
    await rename(temporaryPath, this.filePath);
  }

  private migrate(value: Partial<LearnerState>): LearnerState {
    const sourceVersion = typeof value.version === "number" ? value.version : 1;
    if (sourceVersion > 5) throw new Error(`Version de données non prise en charge : ${sourceVersion}.`);
    const initial = createInitialState();
    const settings: LearnerState["settings"] = {
      en: { ...initial.settings.en, ...(value.settings?.en ?? {}) },
      de: { ...initial.settings.de, ...(value.settings?.de ?? {}) },
      es: { ...initial.settings.es, ...(value.settings?.es ?? {}) }
    };
    const lessonSessions = value.lessonSessions ?? [];
    const derivedLessonProgress: LearnerState["lessonProgress"] = { ...(value.lessonProgress ?? {}) };
    for (const session of lessonSessions) {
      if (session.status !== "completed" || !session.completedAt || !session.summary) continue;
      if (derivedLessonProgress[session.lessonId]) continue;
      const inferredOutcome = session.summary.outcome ?? (
        session.summary.incorrect === 0
        && session.summary.exact >= Math.ceil(session.summary.completedExercises * 2 / 3)
        && session.summary.conversationSteps >= Math.min(3, session.summary.conversationGoal)
          ? "mastered"
          : "needs-review"
      );
      derivedLessonProgress[session.lessonId] = {
        lessonId: session.lessonId,
        completions: 1,
        masteryCount: inferredOutcome === "mastered" ? 1 : 0,
        bestExact: session.summary.exact,
        lastCompletedAt: session.completedAt,
        lastOutcome: inferredOutcome
      };
    }
    const pronunciationAttempts = Array.isArray(value.pronunciationAttempts)
      ? value.pronunciationAttempts.filter((attempt) => (
          typeof attempt?.attemptId === "string"
          && typeof attempt?.promptId === "string"
          && (attempt?.language === "en" || attempt?.language === "de" || attempt?.language === "es")
          && typeof attempt?.score === "number"
          && typeof attempt?.createdAt === "string"
        )).slice(-100)
      : [];
    const pronunciationProgress: LearnerState["pronunciationProgress"] = {
      ...(value.pronunciationProgress ?? {})
    };
    for (const attempt of pronunciationAttempts) {
      const current = pronunciationProgress[attempt.promptId];
      if (current) continue;
      pronunciationProgress[attempt.promptId] = {
        promptId: attempt.promptId,
        attempts: 1,
        bestScore: attempt.score,
        lastScore: attempt.score,
        masteryCount: attempt.mastered ? 1 : 0,
        lastPracticedAt: attempt.createdAt
      };
    }
    return {
      ...initial,
      ...value,
      version: 5,
      progress: { ...initial.progress, ...(value.progress ?? {}) },
      conversations: { ...initial.conversations, ...(value.conversations ?? {}) },
      settings,
      mistakes: value.mistakes ?? [],
      reviewCards: value.reviewCards ?? [],
      processedAttemptIds: value.processedAttemptIds ?? [],
      lessonSessions,
      lessonProgress: derivedLessonProgress,
      pronunciationAttempts,
      pronunciationProgress
    };
  }
}
