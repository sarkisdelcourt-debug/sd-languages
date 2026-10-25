import { matchPairsMistakes } from "@shared/learning";

/** Retour ciblé d'un exercice « associer » : seules les paires fausses sont détaillées (pas toute la solution). */
export function MatchPairsFeedback({ submitted, expected }: { submitted: string; expected: string }) {
  const mistakes = matchPairsMistakes(submitted, expected);
  if (mistakes.length === 0) return null;
  return (
    <ul className="match-mistakes" aria-label="Paires à corriger">
      {mistakes.map((mistake) => (
        <li key={mistake.target}>
          <strong lang="und">{mistake.target}</strong>
          <span>{mistake.given ? `vous avez associé « ${mistake.given} » — ` : ""}attendu : <b>{mistake.expected}</b></span>
        </li>
      ))}
    </ul>
  );
}
