import { useEffect, useRef, useState } from "react";
import type { LanguageCode, ReviewCard, ReviewRating } from "@shared/types";
import { api } from "../api";

const ratings: Array<{ value: ReviewRating; label: string; className: string }> = [
  { value: "again", label: "À revoir", className: "danger" },
  { value: "hard", label: "Difficile", className: "warning" },
  { value: "good", label: "Bien", className: "success" },
  { value: "easy", label: "Facile", className: "accent" }
];

export function ReviewView({ language, onProgress }: { language: LanguageCode; onProgress: () => void }) {
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  useEffect(() => {
    api.reviews(language).then(setCards).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, [language]);
  const card = cards[0];
  // Une tentative par carte affichée : un second clic renvoie le même identifiant, le moteur ne compte alors la
  // révision qu'une fois (LANG-04). Après une erreur, l'écran affiche l'alerte : il faut le quitter pour réessayer.
  const attempt = useRef<{ key: string; id: string } | undefined>(undefined);
  const busy = useRef(false);
  const rate = async (rating: ReviewRating) => {
    if (!card || busy.current) return;
    const key = `${card.id}:${card.repetitions}:${card.lapses}:${card.lastReviewedAt ?? ""}`;
    if (attempt.current?.key !== key) attempt.current = { key, id: `review-${crypto.randomUUID()}` };
    busy.current = true;
    try {
      await api.review(card.id, rating, attempt.current.id);
      setCards((current) => current.slice(1));
      setRevealed(false);
      onProgress();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      busy.current = false;
    }
  };
  if (loading) return <div className="loading-card">Préparation des cartes…</div>;
  if (error) return <div className="alert" role="alert">{error}</div>;
  if (!card) return (
    <section className="result-card calm">
      <span className="result-orbit small">✓</span><p className="eyebrow">Tout est à jour</p><h2>Aucune révision due</h2>
      <p>Les prochaines cartes apparaîtront ici lorsque leur échéance arrivera.</p>
    </section>
  );
  return (
    <section className="review-session">
      <div className="session-head"><div><p className="eyebrow">Carte {1} sur {cards.length}</p><h2>{card.focus}</h2></div><span>{cards.length} restante{cards.length > 1 ? "s" : ""}</span></div>
      <article className={revealed ? "flashcard revealed" : "flashcard"}>
        <p className="eyebrow">Retrouvez la réponse</p><h2>{card.prompt}</h2>
        {revealed ? <div className="flashcard-answer"><span>Réponse</span><strong>{card.answer}</strong></div> : <button className="primary-button" onClick={() => setRevealed(true)}>Afficher la réponse</button>}
      </article>
      {revealed ? <div className="rating-row" aria-label="Évaluer le rappel">{ratings.map((rating) => <button key={rating.value} className={rating.className} onClick={() => void rate(rating.value)}>{rating.label}</button>)}</div> : null}
    </section>
  );
}
