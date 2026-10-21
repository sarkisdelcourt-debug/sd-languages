import { describe, expect, it } from "vitest";
import { EXERCISES } from "@shared/curriculum";
import { stableShuffle } from "./shuffle";

describe("mélange des étiquettes", () => {
  it("donne toujours le même ordre pour un même exercice, sans perdre ni dupliquer de mot", () => {
    const tiles = ["Me", "llamo", "Ana", "y", "soy", "de", "Madrid", "estoy", "es"];
    const first = stableShuffle(tiles, "es-a1-l1-wordbank-origin");
    expect(stableShuffle(tiles, "es-a1-l1-wordbank-origin")).toEqual(first);
    expect([...first].sort()).toEqual([...tiles].sort());
  });

  it("ne laisse jamais la phrase commencer dans l'ordre de la réponse", () => {
    for (const exercise of EXERCISES.filter((item) => item.type === "word-bank" || item.type === "match-pairs")) {
      const items = exercise.tiles ?? exercise.pairs!.map((pair) => pair.native);
      const shuffled = stableShuffle(items, exercise.id);
      expect(shuffled.slice(0, 2), exercise.id).not.toEqual(items.slice(0, 2));
    }
  });
});
