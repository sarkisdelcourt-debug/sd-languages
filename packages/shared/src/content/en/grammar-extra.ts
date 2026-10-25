import { withContractionVariants } from "../generators.js";
import type { CefrLevel } from "../../types.js";
import type { TopicExercise } from "../types.js";

/**
 * Exercices de grammaire complémentaires, liés aux fiches de règles (24/10/2026). Orthographe britannique.
 * RÈGLE D'OR : les `id` ne changent jamais une fois publiés (en-g-x-001…).
 */
type Draft = Omit<TopicExercise, "id" | "language" | "topic">;

const mc = (level: CefrLevel, focus: string, skillTags: string[], prompt: string, choices: string[], answer: string, explanation: string, hint: string): Draft => (
  { level, type: "multiple-choice", focus, skillTags, prompt, choices, answer, explanation, hint }
);
const gap = (level: CefrLevel, focus: string, skillTags: string[], prompt: string, answer: string, explanation: string, hint: string, acceptedAnswers?: string[]): Draft => (
  { level, type: "fill-gap", focus, skillTags, prompt, answer, explanation, hint, ...(acceptedAnswers ? { acceptedAnswers } : {}) }
);
const tr = (level: CefrLevel, focus: string, skillTags: string[], prompt: string, answer: string, acceptedAnswers: string[], explanation: string, hint: string): Draft => (
  { level, type: "translation", focus, skillTags, prompt, answer, acceptedAnswers, explanation, hint }
);

const DRAFTS: Draft[] = [
  // Be, have et there is
  mc("A2", "Be, have et there is", ["present-simple"], "Complétez : I ___ 35 years old.", ["am", "have", "has", "do"], "am",
    "L'âge se dit avec be en anglais (I am 35), jamais avec have comme en français.", "« J'ai 35 ans » : l'anglais dit « je suis »."),
  gap("A2", "Be, have et there is", ["present-simple", "quantifiers"], "Complétez : ___ there any milk in the fridge?", "Is",
    "Milk est indénombrable, donc singulier : Is there any milk ? (There are s'emploie devant un pluriel.)", "Milk est singulier."),

  // Articles
  mc("A2", "Les articles", ["articles"], "Complétez : She is ___ doctor at the university hospital.", ["a", "an", "the", "no article"], "a",
    "Devant une profession, l'article indéfini est obligatoire en anglais. Doctor commence par un son consonne : a.", "Profession : article obligatoire."),
  gap("A2", "Les articles", ["articles"], "Complétez avec a ou an : She has been waiting for ___ hour.", "an",
    "Hour commence par un h muet, donc un son voyelle : an hour. On choisit a ou an selon le son, pas selon la lettre.", "Le h de hour est muet."),
  mc("A2", "Les articles", ["articles"], "Choisissez la phrase correcte.",
    ["Life is not always easy.", "The life is not always easy.", "A life is not always easy.", "Lives is not always easy."], "Life is not always easy.",
    "Pour une idée générale, on n'emploie pas d'article : Life is hard, Money is important. The life ne conviendrait que pour une vie précise.", "Sens général : pas d'article."),

  // Pluriels et indénombrables
  mc("B1", "Pluriels et indénombrables", ["quantifiers"], "Le pluriel de « diagnosis » est ___ .", ["diagnoses", "diagnosises", "diagnosis", "diagnosi"], "diagnoses",
    "Les noms d'origine grecque en -is font leur pluriel en -es : diagnosis → diagnoses, analysis → analyses.", "Pluriel savant."),
  mc("B1", "Pluriels et indénombrables", ["quantifiers", "articles"], "Choisissez la phrase correcte.",
    ["She gave me some good advice.", "She gave me some good advices.", "She gave me a good advice.", "She gave me many good advice."], "She gave me some good advice.",
    "Advice est indénombrable : pas de pluriel ni de a. On compte avec a piece of advice.", "Advice n'a pas de pluriel."),
  tr("B1", "Pluriels et indénombrables", ["quantifiers"], "Traduisez : Les nouvelles sont bonnes.", "The news is good.", ["The news is good"],
    "News est indénombrable : il se construit avec un verbe au singulier (The news is good), même s'il se termine par un -s.", "News + verbe au singulier."),

  // Ordre des mots et questions
  mc("A2", "Ordre des mots et questions", ["sentence-building"], "Choisissez la phrase correcte.",
    ["She always drinks tea in the morning.", "She drinks always tea in the morning.", "Always drinks she tea in the morning.", "She drinks tea always in the morning."], "She always drinks tea in the morning.",
    "L'adverbe de fréquence se place avant le verbe principal (après be) : She always drinks, She is always late.", "Always avant le verbe."),
  gap("B1", "Ordre des mots et questions", ["questions"], "Complétez : Could you tell me where the pharmacy ___ ?", "is",
    "Dans une question indirecte, l'ordre redevient celui de l'affirmative : where the pharmacy is (et non where is the pharmacy).", "Ordre affirmatif : sujet puis verbe."),
  mc("A2", "Ordre des mots et questions", ["questions"], "Complétez : What time ___ the clinic open?", ["does", "do", "are", "has"], "does",
    "Au present simple, on forme la question avec do ou does : What time does the clinic open ? (clinic = 3e personne).", "Sujet singulier à la 3e personne."),

  // Present simple et continuous
  mc("B1", "Present simple et continuous", ["present-simple"], "Choisissez la phrase correcte.",
    ["I understand the problem now.", "I am understanding the problem now.", "I'm understand the problem now.", "I understanding the problem now."], "I understand the problem now.",
    "Understand est un verbe d'état : on ne le met pas au continuous (comme know, want, believe, need).", "Verbe d'état."),
  gap("A2", "Present simple et continuous", ["present-simple"], "Complétez avec le verbe study : She ___ English every evening.", "studies",
    "À la 3e personne du singulier, consonne + y devient ies : study → studies.", "Verbe en consonne + y."),
  mc("A2", "Present simple et continuous", ["present-simple"], "Complétez : Shh! The baby ___ .", ["is sleeping", "sleeps", "sleep", "slept"], "is sleeping",
    "Une action en cours au moment où l'on parle se met au present continuous : is sleeping.", "Maintenant."),

  // Prétérit et present perfect
  mc("B1", "Prétérit et present perfect", ["present-perfect"], "Complétez : I ___ in this hospital since 2019.",
    ["have worked", "work", "worked", "am working"], "have worked",
    "Since + point de départ, avec une action qui continue, exige le present perfect : I have worked here since 2019.", "Depuis + action qui continue."),
  gap("B1", "Prétérit et present perfect", ["present-perfect"], "Complétez avec for ou since : She has been a nurse ___ 2015.", "since",
    "2015 est un point de départ : since. For s'emploie avec une durée (for ten years).", "Date de début."),
  tr("B1", "Prétérit et present perfect", ["present-perfect"], "Traduisez : Je n'ai pas encore vu le médecin.", "I haven't seen the doctor yet.",
    ["I have not seen the doctor yet.", "I haven't seen the doctor yet", "I haven't yet seen the doctor.", "I have not yet seen the doctor."],
    "Not … yet s'emploie avec le present perfect (action attendue qui n'a pas encore eu lieu).", "Yet à la fin."),

  // Futur
  mc("B1", "Parler du futur", ["future-forms"], "Look at those clouds! It ___ rain.", ["is going to", "will", "is raining", "rains"], "is going to",
    "Une prévision fondée sur une preuve visible (les nuages) se dit going to.", "Preuve visible."),
  mc("B1", "Parler du futur", ["future-forms"], "The phone is ringing. — I ___ get it.", ["will", "am going to", "am getting", "get"], "will",
    "Une décision prise à l'instant se dit avec will (I'll get it).", "Décision spontanée."),
  gap("B1", "Parler du futur", ["future-forms"], "Complétez avec le verbe get : I'll call you as soon as I ___ the results.", "get",
    "Après as soon as, when, if, before, on utilise le présent, jamais will : as soon as I get.", "Pas de will après as soon as."),

  // Modaux
  mc("B1", "Les modaux", ["modals"], "Complétez : You ___ smoke in the hospital. It is forbidden.", ["mustn't", "don't have to", "needn't to", "aren't must"], "mustn't",
    "Mustn't exprime l'interdiction. Don't have to dirait que ce n'est pas obligatoire.", "Interdit."),
  mc("B1", "Les modaux", ["modals"], "Complétez : You ___ wear a tie. It is optional.", ["don't have to", "mustn't", "can't", "shouldn't to"], "don't have to",
    "Don't have to = ce n'est pas nécessaire. Ne pas confondre avec mustn't (interdiction).", "Facultatif."),
  gap("B1", "Les modaux", ["modals"], "Complétez avec must ou can't : He has been up all night, so he ___ be tired.", "must",
    "Must exprime une forte probabilité (déduction) ; can't exprime l'impossibilité logique.", "Déduction logique."),

  // Conditionnels
  mc("B1", "Les conditionnels", ["conditionals"], "Complétez : If it rains tomorrow, we ___ at home.", ["will stay", "would stay", "stay", "stayed"], "will stay",
    "Condition réelle ou probable : if + present simple, will + base (type 1).", "Type 1."),
  gap("B1", "Les conditionnels", ["conditionals"], "Complétez : If I ___ you, I would see a doctor.", "were",
    "Pour donner un conseil, on dit If I were you ; was est toléré à l'oral.", "Verbe être au prétérit.", ["was"]),
  mc("B2", "Les conditionnels", ["conditionals"], "Complétez : If we had left earlier, we ___ the last train.",
    ["would have caught", "would catch", "will catch", "had caught"], "would have caught",
    "Irréel du passé (type 3) : if + past perfect, would have + participe passé.", "Type 3 : would have + participe."),

  // Passif
  mc("B1", "La voix passive", ["passive-voice"], "Complétez : The patient ___ to the ward yesterday.", ["was taken", "took", "has taken", "is taking"], "was taken",
    "Le passif au prétérit se forme avec was / were + participe passé : was taken.", "Passé + passif."),
  tr("B2", "La voix passive", ["passive-voice"], "Traduisez : Les résultats seront envoyés demain.", "The results will be sent tomorrow.",
    ["The results are going to be sent tomorrow.", "The results will be sent tomorrow"],
    "Passif au futur : will be + participe passé (will be sent).", "will be + participe."),

  // Discours indirect
  mc("B1", "Le discours indirect", ["reported-speech"], "Last week, he said: « I am tired. » → He said that he ___ tired.", ["was", "is", "were", "has been"], "was",
    "Le verbe introducteur est au passé : le present simple recule en past simple (am → was).", "Reculer d'un temps."),
  gap("B1", "Le discours indirect", ["reported-speech"], "Complétez : She asked me ___ I had taken the tablets.", "if",
    "Pour une question oui / non rapportée, on emploie if ou whether, avec l'ordre d'une affirmation.", "Oui / non rapporté.", ["whether"]),
  tr("B2", "Le discours indirect", ["reported-speech"], "Traduisez : Le médecin m'a dit de me reposer.", "The doctor told me to rest.",
    ["The doctor told me to take a rest.", "The doctor told me to get some rest.", "The doctor told me to rest"],
    "Un ordre rapporté se construit avec tell + objet + to + base (told me to rest).", "tell + objet + to."),

  // Gérondif et infinitif
  mc("B1", "Gérondif ou infinitif", ["gerund-infinitive"], "Complétez : I'm looking forward to ___ you.", ["seeing", "see", "saw", "to see"], "seeing",
    "Dans look forward to, to est une préposition : le verbe qui suit se met en -ing.", "Préposition + -ing."),
  mc("B1", "Gérondif ou infinitif", ["gerund-infinitive"], "Complétez : She decided ___ the job.", ["to leave", "leaving", "leave", "left"], "to leave",
    "Decide se construit avec to + base.", "Decide + to."),
  mc("B2", "Gérondif ou infinitif", ["gerund-infinitive"], "Complétez : He stopped ___ because it was bad for his health.", ["smoking", "to smoke", "smoke", "to smoking"], "smoking",
    "Stop + -ing signifie cesser de ; stop to + base signifie s'arrêter pour faire quelque chose.", "Cesser de."),

  // Comparatifs
  gap("A2", "Comparatifs et superlatifs", ["comparatives"], "Complétez avec le comparatif de good : This treatment is ___ than the old one.", "better",
    "Good est irrégulier : good – better – the best.", "Comparatif irrégulier."),
  mc("B1", "Comparatifs et superlatifs", ["comparatives"], "Complétez : It's ___ hospital in the city.", ["the biggest", "the most big", "the bigger", "most big"], "the biggest",
    "Adjectif court : the + adjectif + -est, avec doublement de la consonne (big → biggest).", "Adjectif court."),

  // Prépositions
  mc("A2", "Prépositions de temps et de lieu", ["prepositions"], "Complétez : The appointment is ___ Monday ___ 9 a.m.",
    ["on / at", "in / at", "at / on", "on / in"], "on / at",
    "On devant un jour, at devant une heure précise.", "Jour puis heure."),
  gap("B1", "Prépositions de temps et de lieu", ["prepositions"], "Complétez : The results will be ready ___ two days.", "in",
    "In + durée = dans (futur) : in two days. Il y a deux jours se dit two days ago.", "Dans deux jours."),
  mc("A2", "Prépositions de temps et de lieu", ["prepositions"], "Complétez : There is a notice ___ the wall.", ["on", "in", "at", "by"], "on",
    "On exprime le contact avec une surface : on the wall, on the table.", "Surface."),

  // Prépositions fixes
  mc("B1", "Verbes et adjectifs avec préposition", ["prepositions"], "Complétez : I'm waiting ___ the test results.", ["for", "to", "of", "at"], "for",
    "Wait se construit avec for : wait for something. Le français n'emploie pas de préposition.", "Attendre quelque chose."),
  mc("B1", "Verbes et adjectifs avec préposition", ["prepositions"], "Choisissez la phrase correcte.",
    ["We discussed the case yesterday.", "We discussed about the case yesterday.", "We discussed of the case yesterday.", "We discussed on the case yesterday."], "We discussed the case yesterday.",
    "Discuss se construit sans préposition, contrairement à « discuter de ».", "Pas de préposition."),

  // Quantités
  mc("A2", "Some, any, much, many", ["quantifiers"], "Complétez : There aren't ___ chairs in the waiting room.", ["any", "some", "much", "a little"], "any",
    "Dans une négation, on emploie any devant un nom dénombrable ou indénombrable.", "Phrase négative."),
  mc("A2", "Some, any, much, many", ["quantifiers"], "Complétez : How ___ money do you need?", ["much", "many", "some", "few"], "much",
    "Money est indénombrable : how much.", "Indénombrable."),

  // Relatives
  mc("B1", "Les relatives", ["sentence-building"], "Complétez : The doctor ___ treated me was excellent.", ["who", "which", "whose", "where"], "who",
    "Pour une personne sujet, on emploie who (ou that). Which est réservé aux choses.", "Personne."),
  gap("B1", "Les relatives", ["sentence-building"], "Complétez : That's the hospital ___ I was born.", "where",
    "Where introduit une relative de lieu : the hospital where I was born.", "Lieu."),
  mc("B2", "Les relatives", ["sentence-building"], "Choisissez la phrase correcte.",
    ["The tablets she took made her sleepy.", "The tablets that she took them made her sleepy.", "The tablets what she took made her sleepy.", "The tablets who she took made her sleepy."], "The tablets she took made her sleepy.",
    "Le pronom relatif complément d'objet peut être omis : the tablets (that) she took. Il n'y a jamais de pronom de rappel, et what ne sert pas de relatif.", "Pronom relatif objet omis."),

  // Phrasal verbs
  mc("B1", "Phrasal verbs", ["phrasal-verbs"], "Complétez : The patient ___ in the waiting room (il a perdu connaissance).",
    ["passed out", "passed on", "passed up", "passed by"], "passed out",
    "Pass out = s'évanouir. Pass on peut vouloir dire transmettre ou, par euphémisme, mourir.", "Perdre connaissance."),
  gap("B1", "Phrasal verbs", ["phrasal-verbs"], "Complétez : Could you fill ___ this form, please?", "in",
    "Fill in a form (britannique) ; fill out est surtout américain, et les deux sont corrects.", "Remplir un formulaire.", ["out"]),
  gap("B1", "Phrasal verbs", ["phrasal-verbs"], "Complétez : I can't put ___ with this noise any longer.", "up",
    "Put up with = supporter. C'est un phrasal verb à trois mots, inséparable.", "Supporter."),

  // Faux amis
  mc("B1", "Faux amis", ["false-friends"], "Complétez : I'm ___ looking for a new job. (actuellement)", ["currently", "actually", "eventually", "finally"], "currently",
    "Actuellement se dit currently ou at the moment. Actually signifie en fait.", "Actuellement."),
  mc("B1", "Faux amis", ["false-friends", "medical-vocabulary"], "« Un physicien » se dit en anglais ___ .", ["a physicist", "a physician", "a pharmacist", "a physiotherapist"], "a physicist",
    "Physician = médecin ; physicist = physicien. Un faux ami à connaître en contexte médical.", "Physician est médecin."),
  tr("B1", "Faux amis", ["false-friends"], "Traduisez : Je vais assister à la conférence.", "I'm going to attend the conference.",
    ["I am going to attend the conference.", "I will attend the conference.", "I'll attend the conference.", "I'm attending the conference."],
    "Attend signifie assister à (être présent) ; « attendre » se dit wait for.", "Assister = attend."),

  // Formation des mots
  mc("B1", "Formation des mots", ["everyday-vocabulary"], "Le contraire de « possible » est ___ .", ["impossible", "unpossible", "inpossible", "dispossible"], "impossible",
    "Devant p, b ou m, le préfixe négatif de style latin devient im- : impossible.", "Préfixe devant p."),
  gap("B1", "Formation des mots", ["everyday-vocabulary", "medical-vocabulary"], "Complétez avec le nom dérivé de treat : The ___ lasts six weeks.", "treatment",
    "Le suffixe -ment forme un nom d'action ou de résultat : treat → treatment.", "Suffixe -ment."),
  mc("A2", "Formation des mots", ["medical-vocabulary"], "En anglais, « painless » signifie ___ .", ["indolore", "douloureux", "très douloureux", "sans médicament"], "indolore",
    "Le suffixe -less indique l'absence : painless = sans douleur, careless = sans soin.", "Suffixe -less."),

  // Collocations
  mc("A2", "Collocations", ["everyday-vocabulary"], "Complétez : Don't worry, everybody ___ mistakes.", ["makes", "does", "takes", "has"], "makes",
    "On dit make a mistake (jamais do a mistake).", "Make + mistake."),
  gap("A2", "Collocations", ["everyday-vocabulary"], "Complétez avec make, do, take ou have : I need to ___ an appointment with the dentist.", "make",
    "On dit make an appointment.", "Rendez-vous."),
  mc("B1", "Collocations", ["medical-vocabulary"], "Complétez : The nurse will ___ your blood pressure.", ["take", "do", "make", "give"], "take",
    "On dit take someone's blood pressure (et take a blood sample).", "Prendre la tension."),

  // Prononciation
  mc("B1", "Prononciation de -ed et -s", ["listening"], "Dans « wanted », la terminaison -ed se prononce ___ .", ["/ɪd/", "/t/", "/d/", "elle est muette"], "/ɪd/",
    "Après un t ou un d, -ed forme une syllabe supplémentaire /ɪd/ : wanted, needed.", "Après un t."),
  mc("B1", "Prononciation de -ed et -s", ["listening"], "Quel mot se termine par le son /ɪz/ ?", ["watches", "cats", "dogs", "stops"], "watches",
    "Après ch, sh, s, z, j, x, le -s forme une syllabe /ɪz/ : watches, washes, buses.", "Après ch.")
];

export const EN_GRAMMAR_EXTRA: TopicExercise[] = DRAFTS.map((draft, index): TopicExercise => withContractionVariants({
  ...draft,
  id: `en-g-x-${String(index + 1).padStart(3, "0")}`,
  language: "en",
  topic: "grammar"
}));
