import { VoiceNotice } from "./VoiceNotice";
import { useMemo, useRef, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import { matchPairsAnswer } from "@shared/learning";
import type { Exercise, LanguageCode } from "@shared/types";
import { getSpeechCapabilities, speakText } from "../lib/browser-speech";
import { stableShuffle } from "../lib/shuffle";

export type PublicExerciseShape = Omit<Exercise, "answer" | "acceptedAnswers">;

interface Props {
  exercise: PublicExerciseShape;
  language: LanguageCode;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const exerciseTypeLabels: Record<Exercise["type"], string> = {
  "multiple-choice": "Choix multiple",
  "fill-gap": "Texte à trous",
  translation: "Traduction",
  "word-bank": "Construire la phrase",
  "match-pairs": "Associer les paires",
  listening: "Écouter et écrire"
};

function WordBank({ exercise, onChange, disabled }: Props) {
  const tiles = useMemo(() => stableShuffle(exercise.tiles ?? [], exercise.id), [exercise]);
  const [chosen, setChosen] = useState<number[]>([]);
  // La phrase courante est lue dans une référence et transmise pendant le geste lui-même : des appuis
  // très rapprochés s'enchaînent sans perdre un mot, même avant le prochain rendu.
  const chosenRef = useRef<number[]>([]);
  const update = (change: (current: number[]) => number[]) => {
    const next = change(chosenRef.current);
    chosenRef.current = next;
    setChosen(next);
    onChange(next.map((index) => tiles[index]).join(" "));
  };
  return (
    <div className="word-bank">
      <div className="word-bank-answer" aria-label="Votre phrase" aria-live="polite">
        {chosen.length === 0 ? <span className="word-bank-placeholder">Touchez les mots dans l'ordre</span> : null}
        {chosen.map((tileIndex, position) => (
          <button key={`${tileIndex}-${position}`} className="word-tile placed" disabled={disabled}
            aria-label={`Retirer « ${tiles[tileIndex]} »`}
            onClick={() => update((current) => current.filter((_, index) => index !== position))}>
            {tiles[tileIndex]}
          </button>
        ))}
      </div>
      <div className="word-bank-pool" role="group" aria-label="Mots disponibles">
        {tiles.map((tile, tileIndex) => {
          const used = chosen.includes(tileIndex);
          return (
            <button key={`${tile}-${tileIndex}`} className={used ? "word-tile used" : "word-tile"} disabled={disabled || used}
              aria-label={used ? `« ${tile} » déjà placé` : `Ajouter « ${tile} »`}
              onClick={() => update((current) => (current.includes(tileIndex) ? current : [...current, tileIndex]))}>
              {tile}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MatchPairs({ exercise, onChange, disabled }: Props) {
  const pairs = exercise.pairs ?? [];
  const natives = useMemo(() => stableShuffle(pairs.map((pair) => pair.native), exercise.id), [exercise]);
  const [selected, setSelectedState] = useState<string>();
  const [links, setLinks] = useState<Record<string, string>>({});
  // Mêmes références que pour les étiquettes : deux appuis rapprochés lisent l'état réel.
  const selectedRef = useRef<string | undefined>(undefined);
  const linksRef = useRef<Record<string, string>>({});
  const setSelected = (target: string | undefined) => {
    selectedRef.current = target;
    setSelectedState(target);
  };
  const linkedNatives = new Set(Object.values(links));
  const chooseNative = (native: string) => {
    const current = selectedRef.current;
    if (!current) return;
    const next = Object.fromEntries(Object.entries(linksRef.current).filter(([, value]) => value !== native));
    next[current] = native;
    linksRef.current = next;
    setLinks(next);
    setSelected(pairs.find((pair) => !next[pair.target])?.target);
    const complete = pairs.every((pair) => next[pair.target]);
    onChange(complete ? matchPairsAnswer(pairs.map((pair) => ({ target: pair.target, native: next[pair.target]! }))) : "");
  };
  return (
    <div className="match-pairs">
      <div role="group" aria-label="Mots en langue étudiée">
        {pairs.map((pair, index) => (
          <button key={pair.target} disabled={disabled} aria-pressed={selected === pair.target}
            aria-label={links[pair.target] ? `${pair.target}, associé à ${links[pair.target]}` : pair.target}
            className={`match-tile${selected === pair.target ? " selected" : ""}${links[pair.target] ? " linked" : ""}`}
            onClick={() => setSelected(pair.target)}>
            <span className="match-index" aria-hidden="true">{index + 1}</span>
            <span>{pair.target}</span>
            {links[pair.target] ? <small>→ {links[pair.target]}</small> : null}
          </button>
        ))}
      </div>
      <div role="group" aria-label="Traductions">
        {natives.map((native) => {
          const owner = Object.entries(links).find(([, value]) => value === native)?.[0];
          const ownerIndex = owner ? pairs.findIndex((pair) => pair.target === owner) + 1 : undefined;
          return (
            <button key={native} disabled={disabled || !selected} className={`match-tile native${linkedNatives.has(native) ? " linked" : ""}`}
              aria-label={owner ? `${native}, associé à ${owner}` : native}
              onClick={() => chooseNative(native)}>
              {ownerIndex ? <span className="match-index" aria-hidden="true">{ownerIndex}</span> : null}
              <span>{native}</span>
            </button>
          );
        })}
      </div>
      <p className="match-help">{selected ? `Choisissez la traduction de « ${selected} ».` : "Touchez d'abord un mot à gauche, puis sa traduction."}</p>
    </div>
  );
}

function Listening({ exercise, language, value, onChange, onSubmit, disabled }: Props) {
  const canSpeak = useMemo(() => getSpeechCapabilities().synthesis, []);
  const play = (rate: number) => exercise.audioText && speakText(exercise.audioText, language, rate);
  return (
    <div className="listening">
      {canSpeak ? <VoiceNotice language={language} onlyMissing /> : null}
      {canSpeak ? (
        <div className="listen-buttons">
          <button className="secondary-button" disabled={disabled} onClick={() => play(0.9)}>▶ Écouter</button>
          <button className="secondary-button" disabled={disabled} onClick={() => play(0.6)}>▶ Lentement</button>
        </div>
      ) : (
        <p className="capability-note">La voix de l'appareil n'est pas disponible : cette dictée en {LANGUAGES[language].name.toLowerCase()} ne peut pas être lue ici. Répondez si vous connaissez la phrase, sinon passez à l'exercice suivant.</p>
      )}
      <label className="answer-field">Ce que vous entendez
        <input value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}
          onKeyDown={(event) => { if (event.key === "Enter") onSubmit(); }} autoCapitalize="sentences" autoComplete="off" spellCheck={false} />
      </label>
    </div>
  );
}

export function ExerciseAnswer(props: Props) {
  const { exercise, value, onChange, onSubmit, disabled } = props;
  if (exercise.type === "word-bank") return <WordBank key={exercise.id} {...props} />;
  if (exercise.type === "match-pairs") return <MatchPairs key={exercise.id} {...props} />;
  if (exercise.type === "listening") return <Listening key={exercise.id} {...props} />;
  if (exercise.choices) {
    return (
      <div className="choice-list" role="group" aria-label="Choisissez une réponse">
        {exercise.choices.map((choice) => (
          <button key={choice} className={value === choice ? "choice selected" : "choice"} aria-pressed={value === choice} onClick={() => onChange(choice)} disabled={disabled}>
            <span className="radio" aria-hidden="true" />{choice}
          </button>
        ))}
      </div>
    );
  }
  return (
    <label className="answer-field">Votre réponse
      <input value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onSubmit(); }} disabled={disabled} autoFocus autoComplete="off" />
    </label>
  );
}
