import { IRREGULAR_VERBS } from "../../../shared/src/content/en/verbs.js";
import type { LanguageCode } from "../../../shared/src/types.js";

/**
 * Correcteur local par règles (22/10/2026) : repère les erreurs typiques d'un francophone et propose
 * une reformulation expliquée. Ce n'est pas une IA (décision de Sarkis : pas d'API) — il ne voit
 * que ce que ses règles décrivent, et ne prétend pas corriger le reste.
 */
export interface CheckFinding {
  rule: string;
  explanation: string;
}

export interface CheckResult {
  corrected: string;
  findings: CheckFinding[];
}

interface Rule {
  id: string;
  pattern: RegExp;
  replace: (match: string, ...groups: string[]) => string;
  explanation: string;
  /** Condition supplémentaire sur la phrase entière (ex. présence d'un marqueur de temps). */
  when?: (text: string) => boolean;
}

const variants = (value: string) => value.split("/").map((part) => part.trim().toLowerCase());
const pastOfParticiple = new Map<string, string>();
const participleOfBase = new Map<string, string>();
const baseOfPast = new Map<string, string>();
for (const verb of IRREGULAR_VERBS) {
  const [past] = variants(verb.past);
  const [participle] = variants(verb.participle);
  for (const form of variants(verb.participle)) if (form !== verb.base) pastOfParticiple.set(form, past!);
  if (participle !== verb.base) participleOfBase.set(verb.base.toLowerCase(), participle!);
  for (const form of variants(verb.past)) if (form !== verb.base) baseOfPast.set(form, verb.base.toLowerCase());
}

/** Verbes réguliers fréquents dont la base, après « have », est presque toujours une erreur. */
const REGULAR_BASES = ["finish", "complete", "receive", "prepare", "decide", "explain", "contact", "arrive", "ask", "answer", "start", "organize", "organise", "book", "check", "visit", "try", "call", "watch", "wait", "phone", "email", "submit", "publish"];
/**
 * Verbes aussi employés comme noms (« I have work to do ») : corrigés seulement quand un moment
 * passé terminé rend l'erreur certaine (« Yesterday I have work » → « I worked »).
 */
const FINISHED_TIME_BASES = ["work", "play", "watch", "live", "stay", "travel", "talk", "help", "need", "want", "use", "move", "open", "close", "cook", "walk", "study", "change", "present", "review", "report"];
const pastOfRegular = (base: string) => base.endsWith("e") ? `${base}d` : base.endsWith("y") && !/[aeiou]y$/.test(base) ? `${base.slice(0, -1)}ied` : base === "submit" ? "submitted" : `${base}ed`;
const REGULAR_PAST_TO_BASE = new Map(REGULAR_BASES.map((base) => [pastOfRegular(base), base]));
["needed:need", "wanted:want", "liked:like", "worked:work", "changed:change", "used:use", "played:play", "lived:live", "loved:love", "helped:help"]
  .forEach((pair) => { const [past, base] = pair.split(":"); REGULAR_PAST_TO_BASE.set(past!, base!); });

const FINISHED_TIME = /\b(yesterday|last (night|week|month|year|time|monday|tuesday|wednesday|thursday|friday|saturday|sunday|summer|winter)|\d+ (minutes?|hours?|days?|weeks?|months?|years?) ago|(a|an|two|three|four|five|few|several) \w+ ago|in (19|20)\d\d|the day before yesterday)\b/i;
const DURATION = "(\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|a few|several|many)\\s+(minutes?|hours?|days?|weeks?|months?|years?)";

/** Conserve la majuscule initiale du segment remplacé. */
function keepCase(original: string, replacement: string): string {
  return /^[A-Z]/.test(original) ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
}

/** Prétérit d'un verbe trouvé après have/has : participe (seen → saw), base (go → went) ou régulier. */
function pastForm(verb: string, subject: string): string | undefined {
  const lower = verb.toLowerCase();
  const plural = /^(you|we|they)$/i.test(subject);
  if (lower === "been" || lower === "be") return plural ? "were" : "was";
  if (pastOfParticiple.has(lower)) return pastOfParticiple.get(lower);
  const irregular = IRREGULAR_VERBS.find((item) => item.base.toLowerCase() === lower);
  if (irregular) return variants(irregular.past)[0];
  if (REGULAR_BASES.includes(lower) || FINISHED_TIME_BASES.includes(lower)) return pastOfRegular(lower);
  if (/ed$/.test(lower)) return lower;
  return undefined;
}

const ENGLISH_RULES: Rule[] = [
  {
    id: "present-perfect-finished-time",
    pattern: /\b(I|you|we|they|he|she|it)(?:\s+(?:have|has)|'ve|'s)\s+(not\s+)?([a-z]+)\b/gi,
    when: (text) => FINISHED_TIME.test(text),
    replace: (match, subject, negation, verb) => {
      const past = pastForm(verb!, subject!);
      if (!past) return match;
      if (negation) {
        const base = past === "was" || past === "were" ? "be" : baseOfPast.get(past) ?? REGULAR_PAST_TO_BASE.get(past) ?? verb;
        return base === "be" ? `${subject} ${past === "were" ? "weren't" : "wasn't"}` : `${subject} didn't ${base}`;
      }
      return `${subject} ${past}`;
    },
    explanation: "Avec un moment passé et terminé (yesterday, last week, … ago), on emploie le prétérit : « I finished it yesterday », pas « I have finished »."
  },
  {
    id: "have-plus-base",
    pattern: /\b(have|has)\s+(not\s+)?([a-z]+)\b(?!\s+to\b)/gi,
    when: (text) => !FINISHED_TIME.test(text),
    replace: (match, auxiliary, negation, verb) => {
      const lower = verb!.toLowerCase();
      const participle = participleOfBase.get(lower) ?? (REGULAR_BASES.includes(lower) ? pastOfRegular(lower) : undefined);
      return participle ? `${auxiliary} ${negation ?? ""}${participle}` : match;
    },
    explanation: "Après have/has (present perfect), le verbe se met au participe passé : « I have finished », « she has written »."
  },
  {
    id: "present-since",
    pattern: /\b(I am|I'm|we are|we're|I live|we live|I work|we work|I know)\b(?=[^.?!]*\bsince\b)/gi,
    replace: (match) => {
      const map: Record<string, string> = { "i am": "I have been", "i'm": "I've been", "we are": "we have been", "we're": "we've been", "i live": "I have lived", "we live": "we have lived", "i work": "I have worked", "we work": "we have worked", "i know": "I have known" };
      return keepCase(match, map[match.toLowerCase()] ?? match);
    },
    explanation: "« Je suis ici depuis… » se dit au present perfect en anglais : « I have been here since 2019 », jamais au présent."
  },
  {
    id: "has-since-duration",
    pattern: new RegExp(`\\b(has|have)\\s+(?=(?:a|an|the|my|his|her|their|our|some|no|\\d+)\\b)([^.?!]*?)\\bsince\\s+${DURATION}\\b`, "gi"),
    replace: (match, verb, middle) => `${verb} had ${middle}${match.replace(/^[\s\S]*?\bsince\s+/i, "for ")}`,
    explanation: "Une situation qui dure s'exprime au present perfect avec for + durée : « has had a fever for two days » (since sert à donner le point de départ : since Monday)."
  },
  {
    id: "since-duration",
    pattern: new RegExp(`\\bsince\\s+${DURATION}\\b`, "gi"),
    replace: (match) => keepCase(match, match.replace(/^since/i, "for")),
    explanation: "Since introduit un point de départ (since 2019, since Monday) ; pour une durée, on dit for : « for three years »."
  },
  {
    id: "during-duration",
    pattern: new RegExp(`\\bduring\\s+${DURATION}\\b`, "gi"),
    replace: (match) => keepCase(match, match.replace(/^during/i, "for")),
    explanation: "« Pendant trois ans » = for three years. During s'emploie avec un nom d'événement : during the meeting."
  },
  {
    id: "be-agree",
    pattern: /\b(I am|I'm|we are|we're)\s+(not\s+)?agree\b/gi,
    replace: (match, subject, negation) => {
      const plain = /^we/i.test(subject!) ? "we" : "I";
      return keepCase(match, negation ? `${plain} don't agree` : `${plain} agree`);
    },
    explanation: "Agree est un verbe : « I agree », « I don't agree » — sans « am »."
  },
  {
    id: "depend-of",
    pattern: /\b(depend|depends|depending|depended)\s+of\b/gi,
    replace: (_match, verb) => `${verb} on`,
    explanation: "On dit depend on (dépendre de), jamais « depend of »."
  },
  {
    id: "its-depend",
    pattern: /\bit'?s depend\b/gi,
    replace: (match) => keepCase(match, "it depends"),
    explanation: "« Ça dépend » = it depends (verbe conjugué, sans « is »)."
  },
  {
    id: "explain-me",
    pattern: /\b(explain|explains|explained|explaining)\s+(me|him|her|us|them)\b/gi,
    replace: (_match, verb, pronoun) => `${verb} to ${pronoun}`,
    explanation: "Explain se construit avec to : « explain to me », « explain it to me »."
  },
  {
    id: "discuss-about",
    pattern: /\b(discuss|discussed|discussing)\s+about\b/gi,
    replace: (_match, verb) => verb!,
    explanation: "Discuss est transitif : « discuss the results », sans « about »."
  },
  {
    id: "make-photo",
    pattern: /\b(make|makes|made|making)\s+(a|some)\s+(photo|photos|picture|pictures)\b/gi,
    replace: (_match, verb, determiner, noun) => `${({ make: "take", makes: "takes", made: "took", making: "taking" } as Record<string, string>)[verb!.toLowerCase()]} ${determiner} ${noun}`,
    explanation: "On « prend » une photo en anglais : take a photo."
  },
  {
    id: "uncountable-agreement",
    pattern: /\b(informations|advices|equipments|feedbacks|homeworks|furnitures|luggages|knowledges|evidences|softwares)\s+(are|were|have)\b/gi,
    replace: (_match, noun, verb) => `${noun!.replace(/s$/i, "")} ${({ are: "is", were: "was", have: "has" } as Record<string, string>)[verb!.toLowerCase()]}`,
    explanation: "Information, advice, equipment… sont indénombrables : pas de -s, et le verbe reste au singulier (« the information is »)."
  },
  {
    id: "uncountable-plural",
    pattern: /\b(informations|advices|equipments|feedbacks|homeworks|furnitures|luggages|knowledges|evidences|softwares)\b/gi,
    replace: (match) => match.replace(/s$/i, ""),
    explanation: "Information, advice, equipment, feedback, luggage… sont indénombrables : pas de -s (« some information », « a piece of advice »)."
  },
  {
    id: "people-is",
    pattern: /\bpeople (is|was|has)\b/gi,
    replace: (_match, verb) => `people ${({ is: "are", was: "were", has: "have" } as Record<string, string>)[verb!.toLowerCase()]}`,
    explanation: "People est un pluriel : « people are », « people have »."
  },
  {
    id: "third-person-dont",
    pattern: /\b(he|she|it)\s+don'?t\b/gi,
    replace: (_match, subject) => `${subject} doesn't`,
    explanation: "À la 3e personne du singulier : « he doesn't », pas « he don't »."
  },
  {
    id: "double-comparative",
    pattern: /\bmore\s+(better|worse|easier|bigger|smaller|cheaper|faster|harder|older|younger|longer|shorter)\b/gi,
    replace: (_match, comparative) => comparative!,
    explanation: "Better, easier, cheaper… sont déjà des comparatifs : pas de « more » devant."
  },
  {
    id: "age-have",
    pattern: /\b(I|you|we|they|he|she)\s+(have|has)\s+(\d+)\s+years\b(?!\s+old)/gi,
    replace: (_match, subject, _verb, age) => `${subject} ${({ i: "am", he: "is", she: "is" } as Record<string, string>)[subject!.toLowerCase()] ?? "are"} ${age} years old`,
    explanation: "L'âge se dit avec be : « I am 45 (years old) »."
  },
  {
    id: "wait-for",
    // Pas « a/an » : « wait a minute » est correct.
    pattern: /\b(wait|waits|waiting|waited)\s+(me|you|him|her|us|them|the|my|your|his|our|their|this|that)\b/gi,
    replace: (_match, verb, next) => `${verb} for ${next}`,
    explanation: "Attendre quelqu'un = wait for someone."
  },
  {
    id: "listen-to",
    pattern: /\b(listen|listens|listening|listened)\s+(?!to\b)(music|the|me|you|him|her|us|them|this|that|my|your|his|our|their)\b/gi,
    replace: (_match, verb, next) => `${verb} to ${next}`,
    explanation: "Écouter quelque chose = listen to something."
  },
  {
    id: "go-to-home",
    pattern: /\b(go|goes|went|going|come|came|coming|get|got|getting)\s+(back\s+)?to\s+home\b/gi,
    replace: (_match, verb, back) => `${verb} ${back ?? ""}home`,
    explanation: "Home s'emploie sans « to » après un verbe de mouvement : « go home », « come back home »."
  },
  {
    id: "according-to-me",
    pattern: /\baccording to me\b/gi,
    replace: (match) => keepCase(match, "in my opinion"),
    explanation: "« Selon moi » = in my opinion ; according to s'emploie pour les autres (according to the guidelines)."
  },
  {
    id: "since-long",
    pattern: /\bsince (a )?long( time)?\b/gi,
    replace: (match) => keepCase(match, "for a long time"),
    explanation: "« Depuis longtemps » = for a long time."
  },
  {
    id: "assist-to",
    pattern: /\b(assist|assists|assisted|assisting)\s+(to|at)\b/gi,
    replace: (_match, verb) => verb!.replace(/^assist/i, "attend"),
    explanation: "Assister à une réunion = attend a meeting ; assist veut dire aider."
  },
  {
    id: "how-call",
    pattern: /\bhow do you call\b/gi,
    replace: (match) => keepCase(match, "what do you call"),
    explanation: "« Comment on appelle… ? » = What do you call…?"
  },
  {
    id: "did-past",
    pattern: /\b(did(?:n't| not)?)\s+(I|you|we|they|he|she|it)?\s*([a-z]+)\b/gi,
    replace: (match, auxiliary, subject, verb) => {
      const lower = verb!.toLowerCase();
      const base = baseOfPast.get(lower) ?? REGULAR_PAST_TO_BASE.get(lower);
      if (!base) return match;
      return `${auxiliary} ${subject ? `${subject} ` : ""}${base}`;
    },
    explanation: "Après did / didn't, le verbe reste à la base : « Did you go? », « I didn't see it »."
  },
  {
    id: "modal-to",
    pattern: /\b(can|could|should|must|will|would|might|may)\s+to\s+([a-z]+)/gi,
    replace: (_match, modal, verb) => `${modal} ${verb}`,
    explanation: "Après un modal (can, must, should…), pas de « to » : « I must go »."
  },
  {
    id: "modal-s",
    pattern: /\b(can|could|should|must|will|would|might|may)\s+(goes|has|does|works|comes|takes|makes|needs|wants|says|gets)\b/gi,
    replace: (_match, modal, verb) => `${modal} ${verb === "has" ? "have" : verb === "does" ? "do" : verb === "goes" ? "go" : verb!.replace(/s$/, "")}`,
    explanation: "Après un modal, le verbe reste à la base, sans -s : « she can go »."
  },
  {
    id: "on-the-other-hand",
    pattern: /\bin the other hand\b/gi,
    replace: (match) => keepCase(match, "on the other hand"),
    explanation: "« D'un autre côté » = on the other hand."
  },
  {
    id: "the-most-of",
    pattern: /\bthe most (part )?of\b/gi,
    replace: (match) => keepCase(match, "most of"),
    explanation: "« La plupart de » = most of (sans « the »)."
  },
  {
    id: "thanks-you",
    pattern: /\bthanks you\b/gi,
    replace: (match) => keepCase(match, "thank you"),
    explanation: "On dit « thank you » ou « thanks », pas « thanks you »."
  },
  {
    id: "lowercase-i",
    pattern: /(^|\s)i(?=\s|'m|'ve|'ll|'d)/g,
    replace: (_match, space) => `${space}I`,
    explanation: "Le pronom « I » prend toujours une majuscule."
  }
];

const GERMAN_RULES: Rule[] = [
  {
    id: "de-ich-bin-gut",
    pattern: /\bich bin gut\b/gi,
    replace: (match) => keepCase(match, "mir geht es gut"),
    explanation: "Pour parler de son état, « Mir geht es gut » est plus naturel."
  },
  {
    id: "de-alter-haben",
    pattern: /\bich habe (\d+) jahre\b/gi,
    replace: (match, age) => keepCase(match, `ich bin ${age} Jahre alt`),
    explanation: "L'âge se dit avec sein : « Ich bin 45 Jahre alt »."
  }
];

const SPANISH_RULES: Rule[] = [
  {
    id: "es-edad-tener",
    pattern: /\bsoy\s+(\d+)\s+años\b/gi,
    replace: (_match, age) => `tengo ${age} años`,
    explanation: "En espagnol, l'âge s'exprime avec tener : « tengo 45 años »."
  },
  {
    id: "es-estar-lugar",
    pattern: /\b(soy|es|somos|son)\s+en\b/gi,
    replace: (_match, verb) => `${({ soy: "estoy", es: "está", somos: "estamos", son: "están" } as Record<string, string>)[verb!.toLowerCase()]} en`,
    explanation: "Pour situer quelqu'un ou quelque chose, on emploie estar : « estoy en Madrid »."
  }
];

const RULES: Record<LanguageCode, Rule[]> = { en: ENGLISH_RULES, de: GERMAN_RULES, es: SPANISH_RULES };

export function checkText(language: LanguageCode, text: string): CheckResult {
  // Le clavier de l'iPhone tape des apostrophes typographiques (’) : on les ramène à « ' ».
  let corrected = text.replace(/[’‘]/g, "'");
  const findings: CheckFinding[] = [];
  for (const rule of RULES[language]) {
    if (rule.when && !rule.when(corrected)) continue;
    const before = corrected;
    corrected = corrected
      .replace(rule.pattern, (match: string, ...groups: string[]) => keepCase(match, rule.replace(match, ...groups)))
      .replace(/\s{2,}/g, " ");
    if (corrected !== before) findings.push({ rule: rule.id, explanation: rule.explanation });
  }
  return { corrected, findings };
}
