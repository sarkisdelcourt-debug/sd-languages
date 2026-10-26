import { normalizeAnswer } from "../learning.js";
import type { PhraseItem } from "./phrase-drills.js";

/**
 * Corrections de relecture des phrases du quotidien (26/10/2026). Un jeu de petites opérations par identifiant, appliquées au
 * chargement : les listes d'origine restent lisibles, et chaque correction dit ce qu'elle change et pourquoi (relecture
 * indépendante : sens contraire accepté, mot-clé trop étroit, formulation courante refusée…).
 */
export type KeyOp =
  | { swap: [string, string[]] } // remplace le mot partout par ces mots
  | { add: [string, string[]] } // ajoute ces mots au groupe qui contient le mot
  | { addGroup: string[] } // ajoute un concept à faire passer
  | { drop: string }; // retire le mot de tous les groupes

export interface PhraseFix {
  keys?: KeyOp[];
  frKeys?: KeyOp[];
  /** Remplace entièrement les groupes de mots-clés. */
  setKeys?: string[][];
  setFrKeys?: string[][];
  addTargets?: string[];
  dropTargets?: string[];
  addFrVariants?: string[];
  dropFrVariants?: string[];
  note?: string;
  level?: PhraseItem["level"];
}

const same = (left: string, right: string) => normalizeAnswer(left) === normalizeAnswer(right);

function applyOps(groups: string[][], ops: KeyOp[]): string[][] {
  let next = groups.map((group) => [...group]);
  for (const op of ops) {
    if ("swap" in op) {
      const [from, to] = op.swap;
      next = next.map((group) => group.flatMap((word) => (same(word, from) ? to : [word])));
    } else if ("add" in op) {
      const [match, extra] = op.add;
      next = next.map((group) => (group.some((word) => same(word, match)) ? [...group, ...extra.filter((word) => !group.some((existing) => same(existing, word)))] : group));
    } else if ("addGroup" in op) {
      next = [...next, op.addGroup];
    } else {
      // retire aussi les formes élidées ajoutées à la génération (l'rue, d'rue…)
      next = next.map((group) => group.filter((word) => !same(word, op.drop) && !same(word.replace(/^[a-z]+'/i, "").replace(/'s$/i, ""), op.drop) && !same(word.replace(/'s$/i, ""), op.drop))).filter((group) => group.length > 0);
    }
  }
  return next;
}

export function applyPhraseFixes(items: PhraseItem[], fixes: Record<string, PhraseFix>): PhraseItem[] {
  return items.map((item) => {
    const fix = fixes[item.id];
    if (!fix) return item;
    const targets = [...item.targets.filter((target) => !(fix.dropTargets ?? []).some((drop) => same(drop, target))), ...(fix.addTargets ?? []).filter((add) => !item.targets.some((target) => same(target, add)))];
    const frVariants = [...(item.frVariants ?? []).filter((variant) => !(fix.dropFrVariants ?? []).some((drop) => same(drop, variant))), ...(fix.addFrVariants ?? [])];
    const keys = fix.setKeys ?? (fix.keys ? applyOps(item.keys, fix.keys) : item.keys);
    const frKeys = fix.setFrKeys ?? (fix.frKeys ? applyOps(item.frKeys ?? [], fix.frKeys) : item.frKeys);
    return { ...item, targets, keys, ...(frKeys ? { frKeys } : {}), ...(frVariants.length ? { frVariants } : {}), ...(fix.note ? { note: fix.note } : {}), ...(fix.level ? { level: fix.level } : {}) };
  });
}
