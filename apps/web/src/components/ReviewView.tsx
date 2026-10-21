import { useEffect, useState } from "react";
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
  const rate = async (rating: ReviewRating) => {
    if (!card) return;
    try {
      await api.review(card.id, rating);
      setCards((current) => current.slice(1));
      setRevealed(false);
      onProgress();
    } catch (reason) {
      setError((reason as Error).message);
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
