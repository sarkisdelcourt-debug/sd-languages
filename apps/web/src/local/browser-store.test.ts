import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createInitialState } from "@engine/initial-state";
import { createEngine } from "@engine/router";
import { BrowserStore } from "./browser-store";

function makeStore(factory = new IDBFactory(), now = () => new Date("2026-10-21T20:00:00.000Z")) {
  return new BrowserStore({ factory, channel: false, now });
}

describe("stockage de l'appareil (IndexedDB)", () => {
  it("garde la progression après fermeture puis réouverture de l'application", async () => {
    const factory = new IDBFactory();
    const first = makeStore(factory);
    const engine = createEngine(first);
    const answered = await engine.handle("POST", "/api/practice/es-a1-mcq-gender/answer", { answer: "La", attemptId: "idb-attempt-001" });
    expect(answered.status).toBe(200);
    first.close();

    const reopened = makeStore(factory);
    const state = await reopened.read();
    expect(state.progress.es.completedExercises).toBe(1);
    expect(state.sync?.changesSinceCheckpoint).toBe(1);
  });

  it("ne compte pas une lecture ou un refus comme une activité", async () => {
    const store = makeStore();
    const engine = createEngine(store);
    await engine.handle("GET", "/api/dashboard");
    const refused = await engine.handle("POST", "/api/lessons/es/continue");
    expect(refused.status).toBe(409);
    expect((await store.read()).sync).toBeUndefined();
  });

  it("sérialise deux écritures simultanées sans en perdre une", async () => {
    const store = makeStore();
    await Promise.all(Array.from({ length: 8 }, (_, index) => store.update((state) => {
      state.progress.de.xp += index + 1;
    })));
    expect((await store.read()).progress.de.xp).toBe(36);
  });

  it("garde une copie par jour et une copie avant chaque remplacement, dix au plus", async () => {
    let day = 1;
    const store = makeStore(new IDBFactory(), () => new Date(`2026-11-${String(day).padStart(2, "0")}T20:00:00.000Z`));
    await store.update((state) => { state.progress.en.xp = 10; });
    expect(await store.listBackups()).toHaveLength(0); // appareil vierge : rien à sauvegarder

    await store.update((state) => { state.progress.en.xp = 20; });
    await store.update((state) => { state.progress.en.xp = 30; });
    expect((await store.listBackups()).map((backup) => backup.reason)).toEqual(["daily"]);

    const replacement = createInitialState();
    replacement.progress.en.xp = 99;
    await store.replace(replacement, "before-import");
    const backups = await store.listBackups();
    expect(backups[0]).toMatchObject({ reason: "before-import", summary: { totalXp: 30 } });
    expect((await store.getBackup(backups[0]!.id))?.progress.en.xp).toBe(30);

    for (day = 2; day <= 14; day += 1) await store.update((state) => { state.progress.en.xp += 1; });
    expect(await store.listBackups()).toHaveLength(10);
  });

  it("efface tout l'appareil, sauvegardes comprises", async () => {
    const factory = new IDBFactory();
    const store = makeStore(factory);
    await store.update((state) => { state.progress.en.xp = 10; });
    await store.replace(createInitialState(), "before-import");
    await store.erase();

    const reopened = makeStore(factory);
    expect((await reopened.read()).progress.en.xp).toBe(0);
    expect(await reopened.listBackups()).toEqual([]);
  });
});
