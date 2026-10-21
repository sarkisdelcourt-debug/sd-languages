import { LANGUAGES } from "@shared/catalog";
import { contentCoverage } from "@shared/curriculum";
import type { LanguageCode } from "@shared/types";

/** Bandeau d'honnêteté : une langue qui compte moins de 50 exercices est annoncée comme en construction. */
export function ContentNotice({ language }: { language: LanguageCode }) {
  const coverage = contentCoverage(language);
  if (!coverage.inConstruction) return null;
  return (
    <p className="content-notice" role="note">
      <strong>{LANGUAGES[language].name} : {coverage.exercises} exercices pour l'instant, en construction.</strong> Les leçons réemploient cette petite banque ; l'anglais est la langue la plus complète.
    </p>
  );
}
