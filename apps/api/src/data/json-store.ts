import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { LearnerState } from "../../../../packages/shared/src/types.js";
import { createInitialState } from "../../../../packages/engine/src/initial-state.js";
import { migrateState, type StateStore } from "../../../../packages/engine/src/state.js";

export class JsonStore implements StateStore {
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  async read(): Promise<LearnerState> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return migrateState(JSON.parse(raw) as Partial<LearnerState>);
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
}
