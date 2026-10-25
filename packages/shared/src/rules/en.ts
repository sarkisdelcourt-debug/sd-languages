import type { GrammarRule } from "../grammar-rules.js";

/**
 * Fiches de règles d'anglais (24/10/2026) : orthographe britannique, explications en français.
 * RÈGLE D'OR : l'`id` d'une fiche ne change jamais.
 */
export const EN_RULES: GrammarRule[] = [
  // ------------------------------------------------------------------------------------------
  // Bases
  // ------------------------------------------------------------------------------------------
  {
    id: "en-r-be-have-there-is",
    language: "en",
    level: "A2",
    group: "Bases",
    order: 1,
    title: "Be, have et there is",
    summary: "Be et have servent à bien plus de choses qu'en français (âge, sensations), et « il y a » se dit there is / there are.",
    sections: [
      {
        heading: "Conjugaison de be et de have au présent",
        table: {
          head: ["Sujet", "be", "have (have got en anglais britannique)"],
          rows: [
            ["I", "am (I'm)", "have (I've got)"],
            ["you / we / they", "are (you're)", "have (we've got)"],
            ["he / she / it", "is (she's)", "has (she's got)"],
            ["Négation", "isn't, aren't, wasn't, weren't", "haven't, hasn't (got) ; don't / doesn't have"],
            ["Question", "Are you tired?", "Have you got a pen? ou Do you have a pen?"]
          ]
        }
      },
      {
        heading: "Là où le français dit « avoir », l'anglais dit « être »",
        points: [
          "L'âge : I am 35 (jamais I have 35 years). On peut ajouter years old : I am 35 years old.",
          "Les sensations : I am hungry, thirsty, cold, hot, afraid, right, wrong, in a hurry.",
          "La météo et le temps : It is cold. It is Monday. It is five o'clock."
        ]
      },
      {
        heading: "Il y a : there is / there are",
        text: "There is s'emploie avec un singulier ou un indénombrable, there are avec un pluriel. Au passé : there was / there were. Question : Is there… ? Are there… ? Attention : « il y a trois jours » se dit three days ago, et non there is.",
        points: ["There is a problem. There are two options. There was some noise."]
      },
      {
        heading: "Autres emplois de have",
        text: "Have est aussi un verbe d'action sans got : have breakfast, have a shower, have a look, have a baby. Dans ces emplois, la question et la négation se font avec do : Did you have a good weekend ? Je n'ai pas pris de petit-déjeuner : I didn't have breakfast."
      }
    ],
    examples: [
      { target: "I am thirty-five and my sister is twenty-eight.", translation: "J'ai trente-cinq ans et ma sœur en a vingt-huit.", note: "L'âge se dit avec be, jamais avec have." },
      { target: "There are three patients in the waiting room.", translation: "Il y a trois patients dans la salle d'attente.", note: "There are devant un pluriel." },
      { target: "Have you got an appointment? / Do you have an appointment?", translation: "Avez-vous un rendez-vous ?", note: "Deux formes correctes ; have got est plus britannique." },
      { target: "I'm very cold. Is there a blanket?", translation: "J'ai très froid. Y a-t-il une couverture ?", note: "Cold se dit avec be ; there is introduit l'existence." }
    ],
    pitfalls: [
      "I have 35 years / I have cold / I have hungry : on emploie be (I am 35, I am cold, I am hungry).",
      "There is three days / It has three days : « il y a trois jours » se dit three days ago ; there is ne traduit pas « il y a » devant une durée passée.",
      "Have you a pen ? est vieilli ; préférer Have you got… ? ou Do you have… ?"
    ],
    skills: ["present-simple", "questions"]
  },
  {
    id: "en-r-comparatives-superlatives",
    language: "en",
    level: "A2",
    group: "Bases",
    order: 2,
    title: "Comparatifs et superlatifs",
    summary: "Adjectif court : -er / -est ; adjectif long : more / the most ; quelques adjectifs sont irréguliers.",
    sections: [
      {
        heading: "Les trois formes",
        table: {
          head: ["Type d'adjectif", "Adjectif", "Comparatif (que = than)", "Superlatif (the …)"],
          rows: [
            ["1 syllabe", "tall", "taller than", "the tallest"],
            ["1 syllabe, consonne finale doublée", "big, hot", "bigger, hotter", "the biggest, the hottest"],
            ["Finit en -y", "easy, busy", "easier, busier", "the easiest, the busiest"],
            ["2 syllabes ou plus", "expensive", "more expensive than", "the most expensive"],
            ["Irrégulier", "good / bad / far", "better / worse / further", "the best / the worst / the furthest"]
          ]
        }
      },
      {
        heading: "Autres structures utiles",
        points: [
          "Égalité : as … as (as tall as). Négation : not as … as, ou less … than (less expensive than).",
          "Plus on…, plus on… : the more you practise, the better you get (the + comparatif, the + comparatif).",
          "Un comparatif peut être renforcé par much, a lot, far, a bit, slightly : much better, a bit worse.",
          "Quelques adjectifs de 2 syllabes prennent les deux formes : clever (cleverer ou more clever), quiet, narrow, simple."
        ]
      },
      {
        heading: "Le superlatif",
        text: "Le superlatif prend toujours the (the best, the most useful) et se complète par in avec un lieu ou un groupe, par of avec une période ou un ensemble : the best doctor in the hospital, the happiest day of my life."
      }
    ],
    examples: [
      { target: "This treatment is more effective than the old one.", translation: "Ce traitement est plus efficace que l'ancien.", note: "Adjectif long : more + adjectif + than." },
      { target: "It's the biggest hospital in the region.", translation: "C'est le plus grand hôpital de la région.", note: "Big double son g ; superlatif avec the et in." },
      { target: "The more I read, the more I understand.", translation: "Plus je lis, plus je comprends.", note: "Structure the … the … avec deux comparatifs." },
      { target: "She is as tired as I am.", translation: "Elle est aussi fatiguée que moi.", note: "as … as pour l'égalité." }
    ],
    pitfalls: [
      "more bigger / most biggest : on n'accumule pas les deux marques (bigger, the biggest).",
      "taller that him / taller of him : après un comparatif on emploie than (taller than him).",
      "the most big : un adjectif court ne prend pas most (the biggest).",
      "Plus de dix : more than ten ; moins de dix (dénombrable) : fewer than ten."
    ],
    skills: ["comparatives"]
  },
  {
    id: "en-r-pronunciation-endings",
    language: "en",
    level: "B1",
    group: "Bases",
    order: 3,
    title: "Prononciation de -ed, de -s et mots piégeux",
    summary: "Les terminaisons -ed et -s se prononcent de trois façons selon le dernier son du mot, et l'orthographe anglaise ne dit pas toujours la prononciation.",
    sections: [
      {
        heading: "Terminaison -ed (prétérit et participe passé)",
        table: {
          head: ["Dernier son du verbe", "Prononciation", "Exemples"],
          rows: [
            ["Consonne sourde (p, k, f, s, ch, sh, x)", "/t/", "stopped, worked, washed, watched, fixed"],
            ["Consonne sonore ou voyelle", "/d/", "played, cleaned, opened, called"],
            ["t ou d", "/ɪd/ (syllabe en plus)", "wanted, needed, decided, treated"]
          ]
        }
      },
      {
        heading: "Terminaison -s (pluriel, 3e personne, possessif)",
        table: {
          head: ["Dernier son", "Prononciation", "Exemples"],
          rows: [
            ["Consonne sourde (p, t, k, f, th)", "/s/", "stops, cats, books, laughs"],
            ["Consonne sonore ou voyelle", "/z/", "dogs, beds, plays, seems"],
            ["s, z, sh, ch, j, x", "/ɪz/ (syllabe en plus)", "buses, washes, watches, changes, boxes"]
          ]
        }
      },
      {
        heading: "Mots piégeux à retenir",
        points: [
          "Lettres muettes : debt (le b), doubt, receipt (le p), psychology, knee, island (le s), listen (le t), castle, muscle.",
          "Mots raccourcis : Wednesday /ˈwenzdeɪ/, comfortable /ˈkʌmftəbl/, vegetable /ˈvedʒtəbl/, clothes /kləʊðz/, February /ˈfebjuəri/.",
          "Famille -ough : though /ðəʊ/, through /θruː/, thought /θɔːt/, enough /ɪˈnʌf/, cough /kɒf/.",
          "Accent de mot : un nom d'un côté, un verbe de l'autre pour certains mots : a record /ˈrekɔːd/ (nom), to record /rɪˈkɔːd/ (verbe).",
          "Adjectifs en -ed prononcés /ɪd/ : naked, wicked, crooked, rugged."
        ]
      }
    ],
    examples: [
      { target: "She worked late and watched a film.", translation: "Elle a travaillé tard et regardé un film.", note: "worked = /wɜːkt/, watched = /wɒtʃt/ : -ed se prononce /t/ après consonne sourde." },
      { target: "He wanted to see the results.", translation: "Il voulait voir les résultats.", note: "Après t, -ed forme une syllabe supplémentaire /ɪd/." },
      { target: "The nurse washes her hands between patients.", translation: "L'infirmière se lave les mains entre deux patients.", note: "washes se termine par /ɪz/ : syllabe en plus." },
      { target: "If in doubt, keep the receipt.", translation: "En cas de doute, gardez le reçu.", note: "Le p de receipt et le b de doubt sont muets." }
    ],
    pitfalls: [
      "Prononcer toutes les terminaisons -ed comme /ɪd/ (worked ≠ work-ed) : seule la syllabe en t/d prend /ɪd/.",
      "Prononcer le h de hour et de honest : ils sont muets (an hour, an honest man).",
      "Lire -ough toujours pareil : through, though, enough et cough se prononcent tous différemment."
    ],
    skills: ["listening", "everyday-vocabulary"]
  },

  // ------------------------------------------------------------------------------------------
  // Verbes et temps
  // ------------------------------------------------------------------------------------------
  {
    id: "en-r-present-simple-continuous",
    language: "en",
    level: "A2",
    group: "Verbes et temps",
    order: 4,
    title: "Present simple et present continuous",
    summary: "Le present simple décrit les habitudes et les faits ; le present continuous décrit ce qui se passe maintenant ou en ce moment.",
    sections: [
      {
        heading: "Le present simple",
        text: "Base verbale, avec -s (ou -es) à la 3e personne du singulier. Négation et question avec do / does : She doesn't smoke. Does he work here ? Après does, le verbe reste à la base (pas de -s).",
        table: {
          head: ["Règle", "Exemples"],
          rows: [
            ["he / she / it + -s", "works, plays, lives"],
            ["-es après s, sh, ch, x, z, o", "passes, watches, goes, does"],
            ["consonne + y devient -ies", "studies, tries (mais plays, says)"],
            ["Négation / question", "He doesn't work. Does he work?"]
          ]
        }
      },
      {
        heading: "Le present continuous (be + verbe en -ing)",
        text: "On l'emploie pour une action en cours, un état temporaire ou un changement : I am writing a report. She is staying with friends this week. Prices are rising. Il se forme avec am / is / are + verbe en -ing. Orthographe : make → making, run → running, lie → lying."
      },
      {
        heading: "Choisir entre les deux",
        points: [
          "Habitude, vérité générale, horaire : present simple (I start at eight. Water boils at 100 °C.).",
          "Maintenant, en ce moment, temporairement : present continuous (Look ! It's snowing.).",
          "Adverbes de fréquence (always, usually, never) : plutôt present simple ; now, at the moment, today : plutôt continuous.",
          "Les verbes d'état ne se mettent pas au continuous : know, understand, believe, want, need, like, love, hate, prefer, belong, seem, have (posséder), see (percevoir, comprendre ; mais I'm seeing the doctor = j'ai rendez-vous).",
          "Always + continuous exprime parfois l'agacement : He is always leaving the door open."
        ]
      }
    ],
    examples: [
      { target: "She works at the hospital and studies at night.", translation: "Elle travaille à l'hôpital et étudie le soir.", note: "3e personne : works, studies (y → ies)." },
      { target: "Shh, the baby is sleeping.", translation: "Chut, le bébé dort.", note: "Action en cours : present continuous." },
      { target: "I understand the problem now.", translation: "Je comprends le problème maintenant.", note: "Understand est un verbe d'état : pas de -ing." },
      { target: "Does he take any medication?", translation: "Prend-il des médicaments ?", note: "Après does, le verbe reste à la base : take, pas takes." }
    ],
    pitfalls: [
      "I am knowing / I am wanting : les verbes d'état n'ont pas de forme en -ing.",
      "Does she works ? : après does, on garde la base (Does she work ?).",
      "J'habite ici depuis 2019 : I have lived here since 2019, pas I live here since 2019.",
      "Oublier le -s de la 3e personne : he work."
    ],
    skills: ["present-simple", "questions"]
  },
  {
    id: "en-r-past-and-present-perfect",
    language: "en",
    level: "B1",
    group: "Verbes et temps",
    order: 5,
    title: "Prétérit, present perfect, for et since",
    summary: "Passé terminé et daté : prétérit ; passé qui touche le présent ou durée jusqu'à maintenant : present perfect.",
    sections: [
      {
        heading: "Le prétérit (past simple)",
        text: "On l'emploie pour une action terminée, située à un moment précis du passé (yesterday, last week, in 2019, three days ago, when I was a student). Verbes réguliers : base + -ed (worked, studied, stopped). Verbes irréguliers : formes à apprendre (go → went, see → saw, take → took). Négation et question avec did + base : Did you see him ? I didn't go."
      },
      {
        heading: "Le present perfect (have / has + participe passé)",
        text: "On l'emploie quand le passé est lié au présent : expérience de vie (I have been to Canada), résultat visible (She has broken her arm), événement récent sans date (They have just left) ou durée qui continue (I have lived here for ten years). On ne précise jamais un moment passé daté avec le present perfect."
      },
      {
        heading: "For, since, ago",
        table: {
          head: ["Mot", "Sens", "Exemple"],
          rows: [
            ["for + durée", "depuis / pendant (durée)", "I have worked here for five years."],
            ["since + point de départ", "depuis (date, événement)", "I have worked here since 2020 / since Monday."],
            ["ago + prétérit", "il y a (durée comptée depuis maintenant)", "I started five years ago."]
          ]
        }
      },
      {
        heading: "Mots-repères",
        points: [
          "Avec le present perfect : ever, never, already, yet, just, so far, recently, this week, how long ?",
          "Avec le prétérit : yesterday, last year, in 2015, ago, when ?",
          "Pour une action qui dure et se poursuit, on peut utiliser le present perfect continuous (have been working) : accent sur la durée ou l'activité."
        ]
      },
      {
        heading: "Past continuous et used to",
        text: "Past continuous (was / were + -ing) : une action en cours au moment passé, souvent interrompue par un prétérit : I was reading when she called. Used to + base : habitude ou état passé qui n'existe plus : I used to smoke (je fumais autrefois). Ne pas confondre avec be used to + -ing (être habitué à) : I am used to working nights."
      }
    ],
    examples: [
      { target: "I met her ten years ago.", translation: "Je l'ai rencontrée il y a dix ans.", note: "Ago exige le prétérit." },
      { target: "I have lived in Lyon since 2015.", translation: "J'habite à Lyon depuis 2015.", note: "Le français utilise le présent, l'anglais le present perfect." },
      { target: "Have you ever worked abroad?", translation: "As-tu déjà travaillé à l'étranger ?", note: "Expérience de vie : ever + present perfect." },
      { target: "We were having dinner when the phone rang.", translation: "Nous dînions quand le téléphone a sonné.", note: "Past continuous interrompu par un prétérit." }
    ],
    pitfalls: [
      "I live here since 2019 : depuis + durée en cours exige le present perfect (I have lived here since 2019).",
      "I have seen him yesterday : yesterday exige le prétérit (I saw him yesterday).",
      "Confondre for et since : for + durée (two years), since + point de départ (2022).",
      "I didn't went : après did / didn't, le verbe reste à la base (I didn't go)."
    ],
    skills: ["present-perfect", "past-tenses", "irregular-past", "past-participles"]
  },
  {
    id: "en-r-future-forms",
    language: "en",
    level: "B1",
    group: "Verbes et temps",
    order: 6,
    title: "Parler du futur : will, going to, présent continu",
    summary: "L'anglais n'a pas de futur unique : on choisit selon la décision, la preuve ou l'arrangement.",
    sections: [
      {
        heading: "Quatre façons de parler du futur",
        table: {
          head: ["Forme", "Emploi", "Exemple"],
          rows: [
            ["will + base", "décision prise à l'instant, promesse, offre, prédiction personnelle", "I'll help you. I think it will rain."],
            ["be going to + base", "plan déjà décidé, prédiction fondée sur un indice visible", "I'm going to study medicine. Look at those clouds : it's going to rain."],
            ["présent continu", "arrangement ferme, avec une heure ou un lieu", "I'm seeing the specialist at ten tomorrow."],
            ["présent simple", "horaire, programme officiel", "The train leaves at 8.15."]
          ]
        }
      },
      {
        heading: "Après if, when, as soon as, before, until…",
        text: "Dans ces subordonnées de temps et de condition, on utilise le présent, jamais will : I'll call you as soon as I get the results. If it rains, we'll stay at home. Le français emploie le futur (« dès que j'aurai ») ; l'anglais emploie le présent simple (as soon as I get) ou le present perfect (as soon as I have finished)."
      },
      {
        heading: "Détails utiles",
        points: [
          "Forme contractée : I'll, you'll, she'll… ; négation won't (will not). Question : Will you come ? Shall I open the window ? (proposition, surtout avec I et we).",
          "Dans une phrase simple, will et going to se ressemblent souvent : le contexte décide (décision spontanée ou plan).",
          "Ne pas utiliser will pour un plan déjà décidé : I'm going to see the dentist (et non I will see… sans contexte)."
        ]
      }
    ],
    examples: [
      { target: "The phone is ringing. I'll get it.", translation: "Le téléphone sonne. Je vais répondre.", note: "Décision à l'instant : will." },
      { target: "I'm going to apply for a position in Geneva.", translation: "Je vais postuler à un poste à Genève.", note: "Intention déjà arrêtée : going to." },
      { target: "We're meeting the director on Friday at three.", translation: "Nous rencontrons la directrice vendredi à quinze heures.", note: "Arrangement fixé : présent continu." },
      { target: "I'll tell you as soon as I know.", translation: "Je te le dirai dès que je saurai.", note: "Après as soon as : présent, pas will." }
    ],
    pitfalls: [
      "When I will arrive, I'll call you : après when / as soon as / before / until, jamais will (when I arrive).",
      "If you will come… est incorrect en emploi normal : if you come…",
      "Utiliser will pour tout : une prévision fondée sur une preuve se dit going to (Be careful, you're going to fall)."
    ],
    skills: ["future-forms"]
  },
  {
    id: "en-r-modals",
    language: "en",
    level: "B1",
    group: "Verbes et temps",
    order: 7,
    title: "Les modaux : can, should, must, have to…",
    summary: "Les modaux sont invariables, sans -s, suivis de la base sans to ; ils expriment capacité, conseil, obligation, probabilité.",
    sections: [
      {
        heading: "Principe",
        text: "Can, could, may, might, will, would, shall, should, must n'ont pas de -s à la 3e personne (she can), s'emploient sans do pour la question et la négation (Can you swim ? He can't come), et sont suivis du verbe à la base sans to (You should rest)."
      },
      {
        heading: "Sens principaux",
        table: {
          head: ["Modal", "Sens", "Exemple"],
          rows: [
            ["can / could", "capacité, possibilité, demande (could = plus poli)", "Can you help me ? Could you wait ?"],
            ["may / might", "permission formelle, possibilité", "May I come in ? It might rain."],
            ["should / ought to", "conseil, recommandation", "You should rest more."],
            ["must", "obligation forte (venant de soi), forte probabilité", "I must go. He must be tired."],
            ["have to", "obligation extérieure (règle, loi)", "You have to wear a mask."],
            ["don't have to", "ce n'est pas nécessaire (absence d'obligation)", "You don't have to come."],
            ["mustn't", "interdiction", "You mustn't smoke here."],
            ["can't", "impossibilité logique", "That can't be true."]
          ]
        }
      },
      {
        heading: "Passé et formes de remplacement",
        points: [
          "Must n'a pas de passé : on utilise had to (I had to leave). Futur : will have to.",
          "Can au passé = could (capacité générale) ou was able to (réussite précise) : I could swim at five. I was able to finish.",
          "Reproche ou regret : should have + participe passé (You should have called). Probabilité passée : must have, might have, can't have + participe passé (She must have forgotten).",
          "Needn't = pas besoin (I needn't go) ; need to est un verbe ordinaire (I need to go)."
        ]
      }
    ],
    examples: [
      { target: "You should see a doctor if the pain continues.", translation: "Tu devrais consulter un médecin si la douleur persiste.", note: "Should : conseil." },
      { target: "You mustn't take this medicine on an empty stomach.", translation: "Il ne faut pas prendre ce médicament à jeun.", note: "Mustn't = interdiction forte, pas absence de nécessité." },
      { target: "You don't have to fast before the test.", translation: "Vous n'avez pas besoin d'être à jeun pour le test.", note: "Don't have to = pas obligatoire." },
      { target: "She has been up all night. She must be exhausted.", translation: "Elle est restée debout toute la nuit. Elle doit être épuisée.", note: "Must = déduction." }
    ],
    pitfalls: [
      "He cans / She musts : pas de -s aux modaux.",
      "You must to go / She can to swim : jamais de to après un modal (sauf have to, ought to).",
      "You mustn't come ne veut PAS dire « tu n'es pas obligé » : c'est une interdiction ; « tu n'es pas obligé » se dit you don't have to.",
      "J'ai dû partir : I had to leave, pas I musted."
    ],
    skills: ["modals", "polite-requests"]
  },
  {
    id: "en-r-conditionals",
    language: "en",
    level: "B1",
    group: "Verbes et temps",
    order: 8,
    title: "Les conditionnels : zéro, 1, 2 et 3",
    summary: "On choisit le type selon le degré de réalité : certain, probable, imaginaire, impossible (passé).",
    sections: [
      {
        heading: "Les quatre types",
        table: {
          head: ["Type", "Proposition en if", "Proposition principale", "Exemple"],
          rows: [
            ["0 : vérité générale", "present simple", "present simple", "If you heat ice, it melts."],
            ["1 : probable ou possible", "present simple", "will + base", "If it rains, we'll stay home."],
            ["2 : irréel du présent ou peu probable", "past simple", "would + base", "If I had time, I would help you."],
            ["3 : irréel du passé", "past perfect (had + participe)", "would have + participe", "If she had come, we would have won."]
          ]
        }
      },
      {
        heading: "Règles de forme",
        points: [
          "Jamais will ni would dans la proposition en if (pour les trois types principaux) : If I have time, I'll call (pas If I will have time).",
          "If I were you…, If he were… : were est la forme habituelle à toutes les personnes dans l'hypothèse de type 2 (If I were rich, If she were here), surtout dans If I were you ; was est tolérée à l'oral.",
          "Unless = if … not : Unless you hurry, you'll miss the train.",
          "Dans la principale, would / could / might / should : If I had the key, I could open it.",
          "Mixte (type 3 + 2) : If I had studied, I would be a doctor now.",
          "La virgule sépare les deux propositions si if commence la phrase."
        ]
      },
      {
        heading: "Comparaison avec le français",
        text: "Le français dit « si j'avais, je ferais » (imparfait + conditionnel) : l'anglais dit If I had, I would do (past simple + would). « Si j'avais su » devient If I had known (past perfect). Le français « s'il pleut, nous resterons » (présent + futur) devient If it rains, we will stay : les temps se ressemblent, mais l'anglais n'utilise jamais le futur après if."
      }
    ],
    examples: [
      { target: "If you don't take your medicine, you won't get better.", translation: "Si tu ne prends pas ton médicament, tu n'iras pas mieux.", note: "Type 1 : present simple + will." },
      { target: "If I were you, I would see a specialist.", translation: "À ta place, je consulterais un spécialiste.", note: "Type 2 pour un conseil : if I were you." },
      { target: "If we had left earlier, we would have caught the train.", translation: "Si nous étions partis plus tôt, nous aurions eu le train.", note: "Type 3 : had + participe, would have + participe." },
      { target: "Unless it improves, we'll have to operate.", translation: "À moins que ça s'améliore, nous devrons opérer.", note: "Unless = if not." }
    ],
    pitfalls: [
      "If I will have time… / If it will rain… : jamais will après if.",
      "If I would be you… : on dit If I were you.",
      "If I had known, I would know : mélange fautif ; type 3 = would have known.",
      "Unless it doesn't rain… : double négation, on écrit Unless it rains."
    ],
    skills: ["conditionals"]
  },
  {
    id: "en-r-passive-voice",
    language: "en",
    level: "B1",
    group: "Verbes et temps",
    order: 9,
    title: "La voix passive",
    summary: "Be + participe passé ; on passe à la voix passive quand l'action ou son objet compte plus que son auteur.",
    sections: [
      {
        heading: "Formation aux différents temps",
        table: {
          head: ["Temps", "Forme", "Exemple"],
          rows: [
            ["Present simple", "am / is / are + participe", "Tests are done every morning."],
            ["Present continuous", "am / is / are being + participe", "The patient is being examined."],
            ["Past simple", "was / were + participe", "He was admitted yesterday."],
            ["Present perfect", "has / have been + participe", "The report has been sent."],
            ["Future (will)", "will be + participe", "The results will be sent tomorrow."],
            ["Modal", "modal + be + participe", "It must be done today."]
          ]
        }
      },
      {
        heading: "Quand et comment l'employer",
        points: [
          "Le complément d'objet de la phrase active devient le sujet : The nurse took the blood sample → The blood sample was taken (by the nurse).",
          "L'agent s'introduit par by, mais on l'omet si on ne le connaît pas ou s'il n'est pas important.",
          "Très fréquent en langue scientifique et médicale : Samples were collected, patients were randomised, the drug is given twice a day.",
          "Là où le français dit « on » (On m'a dit…), l'anglais préfère souvent le passif : I was told that…",
          "Seuls les verbes transitifs (avec objet) ont un passif : on ne dit pas It was happened. Happen, arrive, die, seem n'ont donc pas de passif."
        ]
      },
      {
        heading: "Deux objets",
        text: "Avec give, send, show, tell, deux passifs sont possibles : She was given a prescription (usuel) ou A prescription was given to her. On commence plus naturellement par la personne."
      }
    ],
    examples: [
      { target: "The results will be sent to your GP.", translation: "Les résultats seront envoyés à votre médecin généraliste.", note: "will be + participe passé." },
      { target: "The patient was taken to the ward at noon.", translation: "Le patient a été conduit dans le service à midi.", note: "was + participe passé (taken)." },
      { target: "Blood pressure is checked twice a day.", translation: "La tension est contrôlée deux fois par jour.", note: "Agent omis : peu important." },
      { target: "I was told to wait here.", translation: "On m'a dit d'attendre ici.", note: "Équivalent de « on » : passif personnel." }
    ],
    pitfalls: [
      "The accident was happened : happen n'a pas de passif (The accident happened).",
      "The patient was operate : au passif, on garde le participe passé et la préposition (The patient was operated on).",
      "They told me → I was told : ne pas oublier be (I told ≠ I was told).",
      "Oublier l'auxiliaire be : The tests done yesterday ne forme pas une phrase ; il faut The tests were done yesterday."
    ],
    skills: ["passive-voice"]
  },
  {
    id: "en-r-gerund-infinitive",
    language: "en",
    level: "B1",
    group: "Verbes et temps",
    order: 10,
    title: "Gérondif (-ing) ou infinitif",
    summary: "Après certains verbes on met -ing, après d'autres to + base ; après une préposition, toujours -ing.",
    sections: [
      {
        heading: "Verbes suivis de -ing",
        text: "Enjoy, avoid, finish, mind, suggest, consider, keep, practise, miss, risk, deny, admit, postpone : I enjoy working here. Avoid eating late. Would you mind opening the window ? Après une préposition : interested in learning, good at cooking, before leaving, thank you for coming. Look forward to, object to, be used to : toujours -ing (to est ici une préposition)."
      },
      {
        heading: "Verbes suivis de to + base",
        text: "Want, need, decide, hope, plan, expect, agree, refuse, promise, offer, manage, afford, learn, would like, would love : I decided to leave. She can't afford to retire. Le but s'exprime aussi par to : I went to the pharmacy to buy aspirin (pour acheter, jamais for buy)."
      },
      {
        heading: "Cas particuliers",
        points: [
          "Après un modal (can, should…) et après let / make + objet : base sans to. They made him wait. She let me go.",
          "Like, love, hate, prefer : -ing ou to + base, avec une nuance : I like swimming (goût général) / I like to swim in the morning (habitude).",
          "Sens différent : stop smoking (arrêter de fumer) / stop to smoke (s'arrêter pour fumer) ; remember to lock (ne pas oublier de) / remember locking (se souvenir d'avoir fermé) ; try to open (essayer, effort) / try opening (tester).",
          "Un verbe sujet se met en -ing : Smoking is bad for you."
        ]
      }
    ],
    examples: [
      { target: "I'm looking forward to seeing you.", translation: "J'ai hâte de te voir.", note: "Look forward to est suivi d'un -ing (to = préposition)." },
      { target: "She decided to change jobs.", translation: "Elle a décidé de changer de travail.", note: "Decide + to + base." },
      { target: "He stopped smoking last year.", translation: "Il a arrêté de fumer l'année dernière.", note: "Stop + -ing = cesser une habitude." },
      { target: "Thank you for waiting.", translation: "Merci d'avoir attendu.", note: "Après une préposition : -ing." }
    ],
    pitfalls: [
      "I'm interested to learn this : pour un intérêt, on dit interested in learning ; interested to + verbe (hear, know) existe au sens de « curieux d'apprendre ».",
      "I look forward to see you : to est préposition, donc seeing.",
      "I want that you come : l'anglais dit I want you to come.",
      "Pour acheter : to buy (et pas for buy ni for buying quand il s'agit du but d'un acte)."
    ],
    skills: ["gerund-infinitive"]
  },

  // ------------------------------------------------------------------------------------------
  // Phrases et questions
  // ------------------------------------------------------------------------------------------
  {
    id: "en-r-word-order-questions",
    language: "en",
    level: "A2",
    group: "Phrases et questions",
    order: 11,
    title: "Ordre des mots et questions",
    summary: "Sujet – verbe – complément, sans exception ; les questions s'appuient sur un auxiliaire (do, does, did) placé avant le sujet.",
    sections: [
      {
        heading: "Phrase affirmative",
        text: "L'ordre est rigide : sujet + verbe + complément. L'adverbe de fréquence (always, usually, often, never) se place avant le verbe, mais après be : She always arrives early. She is always early. Pour les compléments : manière, lieu, temps : She worked carefully (manière) in the lab (lieu) yesterday (temps)."
      },
      {
        heading: "Questions",
        table: {
          head: ["Type", "Structure", "Exemple"],
          rows: [
            ["Oui / non, avec be ou modal", "auxiliaire + sujet + …", "Are you tired ? Can you help ?"],
            ["Oui / non, présent", "Do / Does + sujet + base", "Does she work here ?"],
            ["Oui / non, passé", "Did + sujet + base", "Did you see him ?"],
            ["Mot interrogatif", "wh- + auxiliaire + sujet + base", "Where do you live ?"],
            ["Question sur le sujet", "wh- + verbe (sans do)", "Who called ? What happened ?"]
          ]
        }
      },
      {
        heading: "Questions indirectes",
        text: "Dans une question indirecte (Could you tell me…, I wonder…, Do you know…), l'ordre redevient celui d'une phrase affirmative, sans do : Where is the clinic ? → Could you tell me where the clinic is ? ; What time does it open ? → Do you know what time it opens ? Pour oui / non, on emploie if ou whether."
      },
      {
        heading: "Autres points",
        points: [
          "Question tag : She works here, doesn't she ? / You aren't tired, are you ? (négatif ↔ positif).",
          "How long / How often / How many / How much : généralement suivis, après le nom éventuel, de l'auxiliaire puis du sujet (How many tablets do you take ?), sauf si la question porte sur le sujet (How many people came ?).",
          "Pas de pronom de rappel : The doctor, he is late est faux ; The doctor is late."
        ]
      }
    ],
    examples: [
      { target: "What time does the clinic open?", translation: "À quelle heure ouvre la clinique ?", note: "Mot interrogatif + does + sujet + base." },
      { target: "Who called you yesterday?", translation: "Qui t'a appelé hier ?", note: "Question sur le sujet : pas de did." },
      { target: "Could you tell me where the pharmacy is?", translation: "Pourriez-vous me dire où est la pharmacie ?", note: "Question indirecte : sujet + verbe." },
      { target: "He never takes the bus.", translation: "Il ne prend jamais le bus.", note: "never avant le verbe." }
    ],
    pitfalls: [
      "Do you can swim ? / Can you to swim ? : pas de do avec un modal.",
      "Where is going she ? / Where she is going ? : la bonne structure est Where is she going ?",
      "Could you tell me where is the clinic ? : en question indirecte, on dit where the clinic is.",
      "She drinks always tea : l'adverbe de fréquence précède le verbe (She always drinks tea)."
    ],
    skills: ["questions", "sentence-building"]
  },
  {
    id: "en-r-reported-speech",
    language: "en",
    level: "B1",
    group: "Phrases et questions",
    order: 12,
    title: "Le discours indirect",
    summary: "On rapporte les paroles de quelqu'un en reculant le temps d'un cran et en adaptant pronoms et repères de temps.",
    sections: [
      {
        heading: "Le recul des temps (backshift)",
        table: {
          head: ["Discours direct", "Discours indirect"],
          rows: [
            ["present simple : I am tired", "past simple : He said (that) he was tired"],
            ["present continuous : I am working", "past continuous : She said she was working"],
            ["past simple : I saw her", "past perfect : He said he had seen her"],
            ["present perfect : I have finished", "past perfect : She said she had finished"],
            ["will : I will help", "would : He said he would help"],
            ["can / may / must", "could / might / had to"]
          ]
        }
      },
      {
        heading: "Pronoms et repères de temps",
        points: [
          "Pronoms adaptés au sens : « I like it », he said → He said he liked it.",
          "today → that day ; yesterday → the day before ; tomorrow → the next day ; now → then ; ago → before ; this → that ; here → there ; next week → the following week.",
          "Si l'information est toujours vraie ou si le verbe introducteur est au présent, on peut ne pas reculer : She says she is tired. The doctor said that smoking is dangerous."
        ]
      },
      {
        heading: "Questions et ordres",
        points: [
          "Questions oui / non : ask / wonder + if ou whether, ordre affirmatif : He asked if I had eaten.",
          "Questions avec mot interrogatif : le mot interrogatif reste, ordre affirmatif, pas de do : She asked where I lived.",
          "Ordres, demandes : tell / ask + objet + to + base : The doctor told me to rest. He asked me not to smoke.",
          "Say ne prend pas d'objet personnel direct (say that…, say to him) ; tell prend un objet personnel (tell me that…) : He told me. He said to me."
        ]
      }
    ],
    examples: [
      { target: "She said that she was very tired.", translation: "Elle a dit qu'elle était très fatiguée.", note: "Backshift : am → was." },
      { target: "He asked me if I had taken the tablets.", translation: "Il m'a demandé si j'avais pris les comprimés.", note: "if + ordre affirmatif + past perfect." },
      { target: "The doctor told me to rest for a week.", translation: "Le médecin m'a dit de me reposer pendant une semaine.", note: "tell + objet + to + base." },
      { target: "They said they would call the next day.", translation: "Ils ont dit qu'ils appelleraient le lendemain.", note: "will → would ; tomorrow → the next day." }
    ],
    pitfalls: [
      "He said me that… : say n'a pas de complément personnel direct (He told me that… / He said that…).",
      "She asked me where did I live : après ask, l'ordre est affirmatif (where I lived).",
      "He asked if I would to come : on utilise la base sans to après would.",
      "Garder tomorrow, yesterday, now dans un récit rapporté au passé : on écrit the next day, the day before, then."
    ],
    skills: ["reported-speech"]
  },
  {
    id: "en-r-relative-clauses",
    language: "en",
    level: "B1",
    group: "Phrases et questions",
    order: 13,
    title: "Les propositions relatives : who, which, that",
    summary: "Who pour les personnes, which pour les choses, that pour les deux ; on peut supprimer le pronom quand il est complément.",
    sections: [
      {
        heading: "Les pronoms relatifs",
        table: {
          head: ["Pronom", "Emploi", "Exemple"],
          rows: [
            ["who", "personnes (sujet ou objet)", "The nurse who helped me was kind."],
            ["which", "choses et animaux", "The tablet which I took was too strong."],
            ["that", "personnes ou choses, relative déterminative", "The drug that she prescribed worked."],
            ["whose", "possession (dont)", "The patient whose test was positive called."],
            ["where", "lieu", "That's the ward where I worked."],
            ["when", "temps", "The day when he was born."]
          ]
        }
      },
      {
        heading: "Déterminative ou explicative",
        points: [
          "Déterminative (sans virgule) : indispensable pour identifier. Who, which ou that conviennent : The doctor who/that called is Dr Smith.",
          "Explicative (entre virgules) : ajoute une précision. Seulement who / which, jamais that : My brother, who is a nurse, lives in Leeds.",
          "Which avec virgule peut reprendre toute une proposition : He passed his exam, which surprised everyone.",
          "Le pronom peut disparaître quand il est complément d'objet dans une relative déterminative : The tablets (that) she took made her sleepy. Il ne peut pas disparaître quand il est sujet : The doctor who called me."
        ]
      },
      {
        heading: "Avec préposition",
        text: "La préposition passe souvent à la fin : the person I spoke to, the hospital she works in. Plus formel : the person to whom I spoke. Jamais de pronom de rappel : The pen that I bought (it) est faux."
      }
    ],
    examples: [
      { target: "The doctor who treated me was excellent.", translation: "Le médecin qui m'a soigné était excellent.", note: "who = sujet, on ne peut pas l'omettre." },
      { target: "The tablets she took made her sleepy.", translation: "Les comprimés qu'elle a pris l'ont rendue somnolente.", note: "Pronom relatif objet omis." },
      { target: "That's the hospital where I was born.", translation: "C'est l'hôpital où je suis né.", note: "where après un nom de lieu." },
      { target: "My sister, who lives in Paris, is a surgeon.", translation: "Ma sœur, qui habite à Paris, est chirurgienne.", note: "Explicative : virgules, who (pas that)." }
    ],
    pitfalls: [
      "The man which called me : which ne s'emploie pas pour les personnes (who).",
      "What I need is rest est correct, mais The thing what I need est faux : on dit The thing that I need.",
      "My brother, that lives in Leeds, … : that est impossible après virgule.",
      "The tablets that she took them : pas de pronom en double."
    ],
    skills: ["sentence-building", "questions"]
  },

  // ------------------------------------------------------------------------------------------
  // Noms, articles, quantités
  // ------------------------------------------------------------------------------------------
  {
    id: "en-r-articles",
    language: "en",
    level: "A2",
    group: "Noms, articles, quantités",
    order: 14,
    title: "Les articles : a, an, the et zéro article",
    summary: "A / an introduisent un élément parmi d'autres, the désigne un élément connu ou unique, et on n'écrit rien pour le général.",
    sections: [
      {
        heading: "A ou an : une question de son",
        text: "A devant un son consonne, an devant un son voyelle (d'après la prononciation, pas l'orthographe) : a book, an apple, an hour (h muet), an MRI, a university (son /j/), a European. Ces articles n'existent qu'au singulier dénombrable : a doctor, mais doctors."
      },
      {
        heading: "Quand utiliser the",
        points: [
          "Déjà mentionné ou connu des deux interlocuteurs : I saw a patient. The patient was anxious.",
          "Unique : the sun, the moon, the Internet, the NHS.",
          "Superlatifs et ordinaux : the best, the first.",
          "Noms propres pluriels ou composés : the United Kingdom, the Netherlands, the Alps ; fleuves et mers : the Thames, the Mediterranean.",
          "Instruments de musique, institutions : play the piano, go to the cinema (lieu précis), listen to the radio."
        ]
      },
      {
        heading: "Pas d'article",
        points: [
          "Idées générales, pluriels et indénombrables au sens général : Life is hard. I like coffee. Doctors earn good salaries.",
          "Repas, langues, sports, matières : have breakfast, speak French, play tennis, study medicine.",
          "La plupart des pays et des villes : France, London.",
          "Expressions : go to bed / school / work / university, be in hospital / prison (britannique), at home, by car, on foot.",
          "Professions : article indéfini obligatoire en anglais ! She is a doctor, he is an engineer."
        ]
      }
    ],
    examples: [
      { target: "She is a surgeon and he is an anaesthetist.", translation: "Elle est chirurgienne et il est anesthésiste.", note: "Profession : a / an obligatoire." },
      { target: "I waited for an hour.", translation: "J'ai attendu une heure.", note: "Hour commence par un son voyelle : an." },
      { target: "Life is short, but the life of a doctor is busy.", translation: "La vie est courte, mais la vie d'un médecin est chargée.", note: "Sens général : pas d'article ; sens précis : the." },
      { target: "He is in hospital after the accident.", translation: "Il est à l'hôpital à la suite de l'accident.", note: "In hospital (britannique, comme patient) sans article." }
    ],
    pitfalls: [
      "She is doctor : en anglais, on dit She is a doctor.",
      "The life is difficult / The money is important : sens général → pas d'article.",
      "I go to the work every day : go to work.",
      "an university : son /j/ au début, donc a university."
    ],
    skills: ["articles"]
  },
  {
    id: "en-r-plurals-uncountable",
    language: "en",
    level: "A2",
    group: "Noms, articles, quantités",
    order: 15,
    title: "Pluriels et noms indénombrables",
    summary: "Le pluriel suit quelques règles d'orthographe et d'irrégularités ; beaucoup de noms (advice, information, news…) sont indénombrables et restent au singulier.",
    sections: [
      {
        heading: "Former le pluriel",
        table: {
          head: ["Règle", "Singulier → pluriel"],
          rows: [
            ["Cas général : + s", "doctor → doctors, nurse → nurses"],
            ["Après s, x, z, ch, sh : + es", "bus → buses, box → boxes, watch → watches"],
            ["Consonne + y : y devient ies", "study → studies, family → families (mais day → days)"],
            ["f / fe devient ves (certains)", "knife → knives, leaf → leaves (mais roof → roofs)"],
            ["o : + es (certains)", "tomato → tomatoes (mais photo → photos)"],
            ["Irréguliers", "man → men, woman → women, child → children, foot → feet, tooth → teeth, mouse → mice, person → people"],
            ["Invariables", "sheep, fish, series, species"],
            ["Origine latine ou grecque", "diagnosis → diagnoses, bacterium → bacteria, criterion → criteria, vertebra → vertebrae, nucleus → nuclei"]
          ]
        }
      },
      {
        heading: "Les noms indénombrables",
        text: "Un nom indénombrable n'a pas de pluriel, ne s'emploie pas avec a / an, et se construit avec un verbe au singulier. On compte avec une unité : a piece of advice, an item of news, a glass of water, a bit of information. Courants : advice, information, news, research, knowledge, luggage, furniture, equipment, evidence, progress, traffic, weather, work, money, health, accommodation, homework, hair."
      },
      {
        heading: "Toujours pluriels",
        points: [
          "Trousers, jeans, scissors, glasses : a pair of… pour compter (a pair of trousers). Clothes : an item of clothing ; stairs : a flight of stairs ; goods : ne se compte pas ainsi.",
          "People et police sont pluriels : The people are waiting. The police have arrived.",
          "News (singulier) : The news is good. Data est souvent traité comme singulier en usage courant, mais les textes scientifiques gardent parfois le pluriel (the data show)."
        ]
      }
    ],
    examples: [
      { target: "The nurse gave me some useful advice.", translation: "L'infirmière m'a donné des conseils utiles.", note: "Advice est indénombrable : pas de advices." },
      { target: "The results of both diagnoses were positive.", translation: "Les résultats des deux diagnostics étaient positifs.", note: "Pluriel savant : diagnosis → diagnoses." },
      { target: "I need a new pair of glasses.", translation: "J'ai besoin d'une nouvelle paire de lunettes.", note: "Glasses est un pluriel : a pair of." },
      { target: "The news is worrying.", translation: "Les nouvelles sont inquiétantes.", note: "News se termine par -s mais s'accorde au singulier." }
    ],
    pitfalls: [
      "informations, advices, luggages, furnitures, researches : traduire les pluriels français est l'erreur la plus fréquente. On dit information, advice, luggage, furniture, research.",
      "The news are bad : news prend un verbe au singulier.",
      "Two peoples : people est déjà un pluriel (sauf peoples = « les peuples »).",
      "an advice : on dit a piece of advice."
    ],
    skills: ["quantifiers", "articles"]
  },
  {
    id: "en-r-quantifiers",
    language: "en",
    level: "A2",
    group: "Noms, articles, quantités",
    order: 16,
    title: "Some, any, much, many et les quantités",
    summary: "Some / any dépendent du type de phrase ; much / many dépendent du caractère dénombrable du nom.",
    sections: [
      {
        heading: "Some et any",
        points: [
          "Some : phrases affirmatives, et offres ou demandes dont on attend un oui (Would you like some tea ? Can I have some water ?).",
          "Any : négations et questions (I don't have any pain. Is there any milk ?), ainsi qu'après if (If you have any questions…) ; il signifie aussi « n'importe quel » : Any doctor can help you.",
          "No = not any : I have no time = I don't have any time.",
          "Composés : something / anything / nothing, someone / anyone / no one, somewhere / anywhere / nowhere."
        ]
      },
      {
        heading: "Dénombrable ou indénombrable",
        table: {
          head: ["Quantité", "Dénombrable (pluriel)", "Indénombrable (singulier)"],
          rows: [
            ["beaucoup", "many (questions, négations) ; a lot of", "much (questions, négations) ; a lot of"],
            ["peu (insuffisant)", "few", "little"],
            ["quelques / un peu (suffisant)", "a few", "a little"],
            ["trop", "too many", "too much"],
            ["assez", "enough", "enough"],
            ["moins / moins de", "fewer", "less"]
          ]
        }
      },
      {
        heading: "Few ou a few ?",
        text: "A few et a little ont un sens positif (quelques, un peu) ; few et little ont un sens négatif (très peu, presque pas) : I have a few friends here (quelques amis). I have few friends here (j'ai très peu d'amis). Dans une affirmation, on préfère a lot of à much / many, qui s'emploient surtout dans les questions et les négations."
      }
    ],
    examples: [
      { target: "How much money do you need?", translation: "De combien d'argent as-tu besoin ?", note: "Money est indénombrable : how much." },
      { target: "There aren't any chairs left.", translation: "Il ne reste plus aucune chaise.", note: "Négation : any." },
      { target: "Would you like some coffee?", translation: "Voulez-vous du café ?", note: "Offre : some." },
      { target: "I made a few mistakes, but not too many.", translation: "J'ai fait quelques erreurs, mais pas trop.", note: "Mistakes est dénombrable : a few, too many." }
    ],
    pitfalls: [
      "I don't have some money : dans une négation, on utilise any.",
      "How many time do you have ? : time est indénombrable, donc How much time.",
      "Few vs a few : few dit presque rien (négatif), a few dit quelques-uns (neutre).",
      "I have much work est peu naturel dans une affirmation : préférer I have a lot of work."
    ],
    skills: ["quantifiers"]
  },

  // ------------------------------------------------------------------------------------------
  // Prépositions
  // ------------------------------------------------------------------------------------------
  {
    id: "en-r-prepositions-time-place",
    language: "en",
    level: "A2",
    group: "Prépositions",
    order: 17,
    title: "Prépositions de temps et de lieu : at, on, in",
    summary: "At pour un point, on pour une surface ou un jour, in pour un espace fermé ou une période longue.",
    sections: [
      {
        heading: "Le temps",
        table: {
          head: ["Préposition", "Emploi", "Exemples"],
          rows: [
            ["at", "heure précise, moments, fêtes", "at 5 o'clock, at night, at the weekend (UK), at Christmas"],
            ["on", "jours et dates", "on Monday, on 5 May, on Monday morning, on my birthday"],
            ["in", "mois, années, saisons, parties de la journée, durées dans le futur", "in June, in 2019, in summer, in the morning, in two days"],
            ["for / since / during", "durée / point de départ / pendant un événement", "for two hours, since 9 o'clock, during the meeting"],
            ["by / until", "avant (date limite) / jusqu'à", "by Friday, until Friday"]
          ]
        }
      },
      {
        heading: "Le lieu",
        table: {
          head: ["Préposition", "Emploi", "Exemples"],
          rows: [
            ["at", "point précis, lieu d'activité", "at the station, at the doctor's, at work, at home"],
            ["in", "espace entouré, villes, pays", "in the room, in London, in a car, in hospital"],
            ["on", "surface, ligne, étage, transport en commun", "on the table, on the second floor, on the bus, on the train"],
            ["to / into / onto", "mouvement vers (to), entrée (into), surface (onto)", "go to Paris, walk into the room, jump onto the bed"]
          ]
        }
      },
      {
        heading: "Sans préposition",
        points: [
          "Devant next, last, this, every, tomorrow, yesterday, today : I'll see you next week. She left last Monday.",
          "Devant one day, some day : sans préposition.",
          "Dans le sens « dans X jours », on dit in two days ; « il y a deux jours » se dit two days ago."
        ]
      }
    ],
    examples: [
      { target: "The appointment is on Monday at 9 a.m.", translation: "Le rendez-vous est lundi à 9 heures.", note: "on + jour, at + heure." },
      { target: "She was born in 1990 in Nice.", translation: "Elle est née en 1990 à Nice.", note: "in + année, in + ville." },
      { target: "I'll see you in two days.", translation: "Je te verrai dans deux jours.", note: "In + durée = dans (futur)." },
      { target: "There is a notice on the wall.", translation: "Il y a une affiche sur le mur.", note: "On = en contact avec la surface." }
    ],
    pitfalls: [
      "in Monday / at Monday : un jour se dit on Monday.",
      "in the weekend : en britannique at the weekend (en américain on the weekend).",
      "in next week : devant next, aucune préposition.",
      "« Pour » durée = for (for three days), mais « pour » but = to + base (to buy aspirin)."
    ],
    skills: ["prepositions"]
  },
  {
    id: "en-r-dependent-prepositions",
    language: "en",
    level: "B1",
    group: "Prépositions",
    order: 18,
    title: "Verbes et adjectifs avec préposition fixe",
    summary: "Beaucoup de verbes et d'adjectifs exigent une préposition précise, qui ne correspond pas toujours au français.",
    sections: [
      {
        heading: "Verbes avec préposition en anglais",
        table: {
          head: ["Anglais", "Français", "Remarque"],
          rows: [
            ["wait for", "attendre", "préposition for obligatoire"],
            ["look at / look for", "regarder / chercher", "look for = chercher"],
            ["listen to", "écouter", "to obligatoire"],
            ["depend on", "dépendre de", "pas depend of"],
            ["pay for", "payer (un achat)", "pay the bill, mais pay for the meal"],
            ["suffer from", "souffrir de", "suffer from asthma"],
            ["apply for / apply to", "postuler à (poste) / s'adresser à", "apply for a job, apply to a university"],
            ["agree with / on / to", "être d'accord avec (personne) / sur (sujet) / accepter", "agree with you, agree on a date"]
          ]
        }
      },
      {
        heading: "Verbes sans préposition (le français en met une)",
        points: [
          "discuss something (discuter de) : We discussed the case. Jamais discuss about.",
          "enter a room, answer a question, marry someone, attend a meeting, reach a conclusion, mention a problem, approach a patient.",
          "explain something to someone, suggest something to someone : She explained the procedure to him."
        ]
      },
      {
        heading: "Adjectifs + préposition",
        points: [
          "interested in, good at, bad at, afraid of, proud of, capable of, keen on, worried about, responsible for, different from (ou to en britannique), similar to, married to, angry with someone about something, surprised at / by, tired of.",
          "Après la préposition, un verbe se met en -ing : good at cooking, interested in learning, tired of waiting."
        ]
      }
    ],
    examples: [
      { target: "I'm waiting for the test results.", translation: "J'attends les résultats du test.", note: "Wait for : pas de préposition en français." },
      { target: "We discussed the diagnosis with the family.", translation: "Nous avons discuté du diagnostic avec la famille.", note: "Discuss se construit sans préposition." },
      { target: "He suffers from chronic back pain.", translation: "Il souffre de douleurs chroniques au dos.", note: "Suffer from." },
      { target: "She is good at explaining difficult things.", translation: "Elle est douée pour expliquer des choses difficiles.", note: "Préposition + -ing." }
    ],
    pitfalls: [
      "I'm waiting the bus / I listen music / I look the picture : oublier for, to, at.",
      "We discussed about the case / She entered in the room / He answered to the question : ajouter une préposition inutile.",
      "interested to : on dit interested in.",
      "depend of : depend on."
    ],
    skills: ["prepositions"]
  },

  // ------------------------------------------------------------------------------------------
  // Vocabulaire
  // ------------------------------------------------------------------------------------------
  {
    id: "en-r-phrasal-verbs",
    language: "en",
    level: "B1",
    group: "Vocabulaire",
    order: 19,
    title: "Phrasal verbs : comment les comprendre et les apprendre",
    summary: "Un phrasal verb associe un verbe et une particule (up, out, off…) ; il faut l'apprendre en contexte, par famille et par particule.",
    sections: [
      {
        heading: "Trois comportements grammaticaux",
        table: {
          head: ["Type", "Règle", "Exemple"],
          rows: [
            ["Intransitif", "pas de complément", "The anaesthetic wore off. He passed out."],
            ["Transitif séparable", "le complément peut s'intercaler ; un pronom s'intercale toujours", "Fill in the form / Fill the form in / Fill it in (jamais Fill in it)."],
            ["Transitif inséparable", "le complément suit toujours la particule", "Look after the patient / Look after her."],
            ["À trois mots", "verbe + 2 particules, inséparable", "look forward to, put up with, get on with"]
          ]
        }
      },
      {
        heading: "Comment les apprendre",
        points: [
          "Toujours en phrase complète, jamais seuls : une phrase d'exemple + sa traduction.",
          "Par particule : up = vers le haut, achever, augmenter (speed up, finish up) ; down = diminuer, réduire (cut down, turn down) ; out = sortir, distribuer, disparaître (give out, find out) ; off = partir, arrêter, commencer (set off, switch off) ; on = continuer, allumer (carry on, switch on) ; back = retour (call back).",
          "Par thème : en médecine, en voyage, au travail (voir les listes de vocabulaire de l'application).",
          "Beaucoup ont un équivalent latin plus formel (find out = discover, put off = postpone, carry out = perform, cut down on = reduce) : à connaître pour l'écrit comme pour l'oral.",
          "Apprendre d'abord les 30 les plus fréquents, puis élargir ; repérer la forme séparable ou non."
        ]
      },
      {
        heading: "Phrasal verbs utiles en médecine et au quotidien",
        table: {
          head: ["Phrasal verb", "Sens"],
          rows: [
            ["come down with", "tomber malade de (come down with the flu)"],
            ["pass out", "perdre connaissance"],
            ["carry out", "réaliser (carry out tests)"],
            ["fill in / fill out", "remplir (un formulaire)"],
            ["cut down on", "réduire (cut down on sugar)"],
            ["put off", "reporter, décourager"],
            ["follow up", "assurer le suivi"],
            ["wear off", "s'estomper (effet d'un médicament)"],
            ["throw up", "vomir"],
            ["give up", "arrêter, renoncer"]
          ]
        }
      }
    ],
    examples: [
      { target: "Could you fill in this form, please?", translation: "Pourriez-vous remplir ce formulaire, s'il vous plaît ?", note: "Séparable : fill it in." },
      { target: "I can't put up with this noise any longer.", translation: "Je ne supporte plus ce bruit.", note: "Verbe à trois mots : inséparable." },
      { target: "He passed out in the waiting room.", translation: "Il s'est évanoui dans la salle d'attente.", note: "Intransitif." },
      { target: "The doctor told me to cut down on salt.", translation: "Le médecin m'a dit de réduire le sel.", note: "Cut down on + nom." }
    ],
    pitfalls: [
      "Fill in it : un pronom complément se place entre le verbe et la particule (fill it in).",
      "Look after to the patient : pas de préposition en plus.",
      "Deviner le sens mot à mot : give up n'a rien à voir avec donner vers le haut.",
      "Utiliser tous les phrasal verbs à l'écrit formel : préférer parfois le verbe latin (postpone, discover)."
    ],
    skills: ["phrasal-verbs"]
  },
  {
    id: "en-r-false-friends",
    language: "en",
    level: "B1",
    group: "Vocabulaire",
    order: 20,
    title: "Faux amis courants et médicaux",
    summary: "Des mots qui ressemblent au français mais ont un autre sens : les connaître évite des contresens parfois graves.",
    sections: [
      {
        heading: "Faux amis du quotidien",
        table: {
          head: ["Mot anglais", "Ne veut PAS dire", "Veut dire", "Pour dire l'autre sens"],
          rows: [
            ["actually", "actuellement", "en fait", "currently, at the moment"],
            ["eventually", "éventuellement", "finalement, à terme", "possibly, if necessary"],
            ["sensible", "sensible", "raisonnable", "sensitive"],
            ["attend", "attendre", "assister à", "wait for"],
            ["library", "librairie", "bibliothèque", "bookshop"],
            ["lecture", "lecture", "cours magistral, conférence", "reading"],
            ["pretend", "prétendre", "faire semblant", "claim"],
            ["deceive", "décevoir", "tromper", "disappoint"],
            ["demand", "demander", "exiger", "ask"],
            ["resume", "résumer", "reprendre", "summarise"]
          ]
        }
      },
      {
        heading: "Faux amis médicaux",
        table: {
          head: ["Mot anglais", "Sens réel", "À ne pas confondre avec"],
          rows: [
            ["medicine", "médecine ou médicament", "medication / drug : médicament"],
            ["physician", "médecin", "physicist : physicien"],
            ["preservative", "conservateur (alimentaire)", "préservatif = condom"],
            ["affection", "affection (tendresse)", "affection médicale = condition / disorder"],
            ["sympathetic", "compatissant", "sympathique = nice, friendly"],
            ["surgery", "chirurgie ; cabinet médical (UK)", "cabinet = practice / surgery"],
            ["comprehensive", "complet, exhaustif", "compréhensif = understanding"],
            ["injury", "blessure", "wound pour plaie ouverte"],
            ["intoxication", "ivresse", "poisoning : intoxication"],
            ["evolve", "évoluer", "progress : la maladie évolue / s'aggrave"]
          ]
        }
      },
      {
        heading: "Astuces",
        points: [
          "Les mots en -tion, -ment, -able, -ible existent souvent dans les deux langues : ils sont souvent transparents, mais pas toujours (sensible, intoxication, affection).",
          "Quand un mot est trop « évident », vérifier dans un dictionnaire et noter la phrase dans laquelle il sert.",
          "Dans les textes médicaux, relire les mots de la famille des faux amis : un contresens peut modifier le diagnostic."
        ]
      }
    ],
    examples: [
      { target: "Actually, I'm a doctor, not a nurse.", translation: "En fait, je suis médecin, pas infirmière.", note: "Actually = en fait, pas actuellement." },
      { target: "I'm currently working on a research project.", translation: "Je travaille actuellement sur un projet de recherche.", note: "Actuellement = currently." },
      { target: "I'm going to attend the conference in May.", translation: "Je vais assister à la conférence en mai.", note: "Attend = être présent." },
      { target: "He was very sympathetic when I told him the news.", translation: "Il a été très compatissant quand je lui ai annoncé la nouvelle.", note: "Sympathetic ≠ sympathique." }
    ],
    pitfalls: [
      "Traduire sensible par sensible : She gave a sensible answer = une réponse raisonnable.",
      "Utiliser library pour acheter un livre : on achète un livre dans une librairie (bookshop).",
      "Dire I am waiting the conference pour assister : attend = présence, wait for = attendre.",
      "Utiliser preservative en anglais pour un préservatif : préférer condom."
    ],
    skills: ["false-friends", "medical-vocabulary"]
  },
  {
    id: "en-r-word-formation",
    language: "en",
    level: "B1",
    group: "Vocabulaire",
    order: 21,
    title: "Formation des mots : préfixes et suffixes",
    summary: "Préfixes et suffixes permettent de deviner et de fabriquer des mots : treat, treatment, treatable, untreated.",
    sections: [
      {
        heading: "Suffixes courants",
        table: {
          head: ["Nature produite", "Suffixes", "Exemples"],
          rows: [
            ["Nom d'action ou de résultat", "-tion, -sion, -ment, -ance, -ence", "prevention, decision, treatment, tolerance"],
            ["Nom de qualité ou d'état", "-ness, -ity, -ship", "illness, ability, friendship"],
            ["Nom de personne", "-er, -or, -ist, -ian", "researcher, doctor, pharmacist, physician"],
            ["Adjectif", "-able / -ible, -ful, -less, -ous, -al, -ic, -ive", "treatable, painful, painless, nervous, medical, chronic, active"],
            ["Verbe", "-ise / -ize (UK -ise), -ify, -en", "hospitalise, simplify, strengthen"],
            ["Adverbe", "-ly", "quickly, carefully"]
          ]
        }
      },
      {
        heading: "Préfixes courants",
        table: {
          head: ["Préfixe", "Sens", "Exemples"],
          rows: [
            ["un-", "contraire (adjectifs, verbes)", "unhappy, undo, unconscious"],
            ["in- / im- / il- / ir-", "contraire (adjectifs de style latin) ; im- devant b, m, p ; il- devant l ; ir- devant r", "incomplete, impossible, illegal, irregular"],
            ["dis-", "contraire, séparation", "disagree, disconnect"],
            ["mis-", "mal, à tort", "misunderstand, misdiagnose"],
            ["re-", "de nouveau", "rewrite, readmit"],
            ["over- / under-", "trop / pas assez", "overdose, underweight"],
            ["pre- / post-", "avant / après", "preoperative, postoperative"],
            ["anti-, hyper-, hypo-", "contre / trop / sous", "antibiotic, hypertension, hypoglycaemia"]
          ]
        }
      },
      {
        heading: "Conseils",
        points: [
          "Le français -ité devient -ity (possibility), -eur devient -or ou -er (doctor, researcher), -ique devient -ic (chronic), -isme devient -ism.",
          "L'accent du mot change souvent avec le suffixe : photograph, photographer, photographic.",
          "Écrire les familles ensemble : treat – treatment – treatable – untreated – maltreat."
        ]
      }
    ],
    examples: [
      { target: "The treatment is painless and easily repeatable.", translation: "Le traitement est indolore et facilement renouvelable.", note: "treat + -ment, pain + -less, repeat + -able." },
      { target: "It was an impossible decision.", translation: "C'était une décision impossible.", note: "im- devant p ; decide + -sion." },
      { target: "She misunderstood the instructions.", translation: "Elle a mal compris les instructions.", note: "mis- = à tort." },
      { target: "He was unconscious for ten minutes.", translation: "Il est resté inconscient dix minutes.", note: "un- + conscious." }
    ],
    pitfalls: [
      "inpossible / unpossible : devant p, le préfixe est im- (impossible).",
      "disable ≠ unable : le contraire de able est unable ; disable = désactiver ou handicaper.",
      "La terminaison -ize est américaine ; en britannique on préfère -ise (hospitalise).",
      "Un suffixe peut changer la classe du mot : care est un nom, careful un adjectif, carefully un adverbe."
    ],
    skills: ["everyday-vocabulary", "medical-vocabulary"]
  },
  {
    id: "en-r-collocations",
    language: "en",
    level: "B1",
    group: "Vocabulaire",
    order: 22,
    title: "Collocations : make, do, take, have",
    summary: "Make, do, take et have forment des expressions figées qu'il faut apprendre en bloc, car le français n'utilise pas le même verbe.",
    sections: [
      {
        heading: "Make ou do ?",
        text: "Make = créer, produire, un résultat ; do = activité, tâche, travail en général. La règle n'est pas absolue : il faut apprendre les groupes.",
        table: {
          head: ["make", "do"],
          rows: [
            ["a mistake, a decision, an appointment, a phone call", "homework, housework, the shopping, the washing-up"],
            ["progress, an effort, a suggestion, a complaint", "research, business, an exercise, a course"],
            ["money, noise, a mess, sense, a difference", "a favour, damage, harm, your best"]
          ]
        }
      },
      {
        heading: "Take et have",
        table: {
          head: ["take", "have"],
          rows: [
            ["a break, a test, medication, an exam (passer un examen)", "a shower, a bath, a rest, a break"],
            ["a blood sample, someone's blood pressure, notes, a history", "breakfast, lunch, dinner, a drink"],
            ["care, a risk, advantage, part in, place, time", "a look, a go, a chat, a conversation"],
            ["a decision (britannique), a photo, a taxi", "an operation, a headache, a cold, a problem"]
          ]
        }
      },
      {
        heading: "Collocations utiles avec d'autres verbes",
        points: [
          "pay attention, keep in touch, catch a cold, run a test, carry out an examination, reach a conclusion, break the news, give birth, raise awareness.",
          "heavy rain, strong coffee, deep sleep, severe pain, high temperature, chronic illness : certains adjectifs vont avec certains noms et pas avec d'autres.",
          "Passer un examen (le faire) : take / sit an exam ; le réussir : pass an exam."
        ]
      }
    ],
    examples: [
      { target: "Don't worry, everybody makes mistakes.", translation: "Ne t'inquiète pas, tout le monde fait des erreurs.", note: "Make a mistake." },
      { target: "I need to make an appointment with the dentist.", translation: "Je dois prendre rendez-vous chez le dentiste.", note: "Make an appointment." },
      { target: "The nurse will take your blood pressure.", translation: "L'infirmière va prendre votre tension.", note: "Take blood pressure." },
      { target: "We did some research before we made a decision.", translation: "Nous avons fait des recherches avant de prendre une décision.", note: "Do research / make a decision." }
    ],
    pitfalls: [
      "do a mistake / do an error : on dit make a mistake.",
      "take an appointment : on dit make an appointment (et make ou take a decision).",
      "I passed the exam pour dire « j'ai passé l'examen » : pass = réussir ; passer un examen = take ou sit an exam.",
      "make homework / make the shopping : do homework, do the shopping."
    ],
    skills: ["everyday-vocabulary", "medical-vocabulary"]
  }
];
