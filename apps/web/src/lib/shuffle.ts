/**
 * Mélange stable (mulberry32) : le même exercice garde le même ordre d'un affichage à l'autre. On
 * évite un ordre qui commencerait comme la liste d'origine, où la réponse se lirait d'elle-même.
 */
export function stableShuffle<T>(items: T[], seed: string): T[] {
  const hash = [...seed].reduce((value, character) => Math.imul(value ^ character.charCodeAt(0), 2_654_435_761) >>> 0, 1_779_033_703);
  for (let round = 0; round < 8; round += 1) {
    let state = (hash + round * 0x9e3779b9) >>> 0;
    const next = () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
      mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
    };
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(next() * (index + 1));
      [shuffled[index], shuffled[swap]] = [shuffled[swap]!, shuffled[index]!];
    }
    if (items.length < 3 || shuffled.slice(0, 2).some((item, index) => item !== items[index])) return shuffled;
  }
  return [...items].reverse();
}
