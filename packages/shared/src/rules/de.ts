import type { GrammarRule } from "../grammar-rules.js";

type RawRule = Omit<GrammarRule, "language">;

const RAW_DE_RULES: RawRule[] = [
  // ---------------------------------------------------------------- Premiers pas
  {
    id: "de-r-prononciation-orthographe", level: "A1", group: "Premiers pas", order: 1,
    title: "Prononciation et orthographe",
    summary: "L'allemand s'écrit comme il se prononce : apprenez ä, ö, ü, ß, ch, sch, et mettez une majuscule à tous les noms.",
    sections: [
      {
        heading: "Les lettres propres à l'allemand",
        table: {
          head: ["Lettre", "Son approximatif", "Exemple"],
          rows: [
            ["ä", "comme « è » (ouvert)", "Käse, Mädchen"],
            ["ö", "comme « eu » de peu / peur", "schön, können"],
            ["ü", "comme le « u » français", "über, müde"],
            ["ß", "un « s » sourd, après voyelle longue ou diphtongue", "Straße, heiß, groß"],
            ["ss", "un « s » sourd, après voyelle brève", "muss, essen, Wasser"]
          ]
        }
      },
      {
        heading: "Combinaisons de lettres",
        table: {
          head: ["Écriture", "Prononciation", "Exemple"],
          rows: [
            ["ei", "« aï »", "nein, Zeit"],
            ["ie", "« i » long", "Liebe, sieben"],
            ["eu / äu", "« oï »", "heute, Häuser"],
            ["sch", "« ch » français", "Schule, schnell"],
            ["sp- / st- en début de mot", "« chp » / « cht »", "sprechen, Straße"],
            ["z", "« ts »", "zehn, Zeit"],
            ["w / v", "w = « v » ; v = « f » dans les mots germaniques", "Wasser, Vater"],
            ["s devant voyelle", "« z » sonore", "Sonne, sagen"],
            ["ch", "doux [ç] après e, i, ä, ö, ü ; rauque [x] après a, o, u", "ich, Buch"]
          ]
        }
      },
      {
        heading: "Majuscules",
        points: [
          "Tous les noms prennent une majuscule : der Arzt, die Krankheit, das Herz.",
          "La politesse « Sie / Ihr / Ihnen » prend une majuscule ; « ich » n'en prend pas (sauf en début de phrase).",
          "Les adjectifs de nationalité restent en minuscule : deutsch, französisch ; la langue nominalisée prend une majuscule : Ich lerne Deutsch.",
          "À la fin d'un mot, b, d, g se prononcent p, t, k : Tag [tak], und [unt]."
        ]
      }
    ],
    examples: [
      { target: "Die Straße ist schön.", translation: "La rue est belle.", note: "ß après voyelle longue (a) ; ö = « eu »." },
      { target: "Ich muss das Wasser kaufen.", translation: "Je dois acheter de l'eau.", note: "ss après voyelle brève (muss) ; Wasser avec majuscule." },
      { target: "Wir sprechen Deutsch.", translation: "Nous parlons allemand.", note: "sp = « chp » ; Deutsch en majuscule car c'est la langue." },
      { target: "Die Häuser sind groß.", translation: "Les maisons sont grandes.", note: "äu = « oï » ; ß dans groß." }
    ],
    pitfalls: [
      "Prononcer v comme en français : Vater se dit « fater », alors que Wasser (avec w) se dit « vasser ».",
      "Oublier la majuscule des noms : on écrit der Tisch, pas der tisch.",
      "Écrire ss ou ß au hasard : ß seulement après voyelle longue ou diphtongue (Fuß, heiß), ss après voyelle brève (Fluss).",
      "Prononcer ie comme « ié » : Liebe se dit « libe »."
    ],
    skills: ["listening", "everyday-vocabulary"]
  },

  // ---------------------------------------------------------------- Genre et articles
  {
    id: "de-r-genre-des-noms", level: "A1", group: "Genre et articles", order: 2,
    title: "Genre des noms et indices (suffixes)",
    summary: "Trois genres (der, die, das) qui ne coïncident pas toujours avec le français : apprenez chaque nom avec son article et repérez les suffixes.",
    sections: [
      {
        heading: "Apprendre le nom avec son article",
        text: "Il y a trois genres : masculin (der), féminin (die), neutre (das). Le genre est rarement logique : le soleil est féminin (die Sonne), la lune est masculin (der Mond), la jeune fille est neutre (das Mädchen). Apprenez toujours « der Tisch », jamais « Tisch » tout seul."
      },
      {
        heading: "Les terminaisons qui donnent le genre",
        table: {
          head: ["Suffixe ou catégorie", "Genre", "Exemples"],
          rows: [
            ["-ung, -heit, -keit, -schaft", "féminin (die)", "die Behandlung, die Gesundheit, die Möglichkeit, die Wissenschaft"],
            ["-ion, -tät, -ur, -ik, -ie, -ei", "féminin (die)", "die Station, die Universität, die Kultur, die Klinik, die Allergie, die Bäckerei"],
            ["-in (femme)", "féminin (die)", "die Ärztin, die Lehrerin"],
            ["-e (le plus souvent)", "féminin (die)", "die Lampe, die Blume, die Straße"],
            ["-er (agent), -ling, -ismus, -or, -ist", "masculin (der)", "der Lehrer, der Frühling, der Optimismus, der Motor, der Pianist"],
            ["jours, mois, saisons, points cardinaux", "masculin (der)", "der Montag, der Mai, der Winter, der Norden"],
            ["-chen, -lein (diminutifs)", "neutre (das)", "das Mädchen, das Tischchen, das Fräulein"],
            ["-ment, -um, -ma", "neutre (das)", "das Medikament, das Zentrum, das Thema"],
            ["Ge- collectif, infinitif nominalisé, couleurs, métaux", "neutre (das)", "das Gebäude, das Essen, das Blau, das Gold"]
          ]
        }
      },
      {
        heading: "Quelques exceptions utiles",
        points: [
          "der Name, der Käse, der Buchstabe (noms en -e masculins) ; das Auge, das Ende (neutres en -e).",
          "Le suffixe diminutif -chen / -lein rend le nom neutre et ajoute souvent un tréma : die Hand, das Händchen.",
          "Médecine : der Arzt, die Ärztin, der Patient, das Herz, das Blut, der Blutdruck, die Behandlung, das Medikament."
        ]
      }
    ],
    examples: [
      { target: "die Untersuchung", translation: "l'examen", note: "-ung donne toujours le féminin." },
      { target: "das Mädchen", translation: "la jeune fille", note: "-chen donne le neutre, même pour une personne de sexe féminin." },
      { target: "der Lehrer / die Lehrerin", translation: "le professeur / la professeure", note: "-er est masculin ; on ajoute -in pour le féminin." },
      { target: "die Sonne und der Mond", translation: "le soleil et la lune", note: "Le genre est l'inverse du français : à mémoriser." }
    ],
    pitfalls: [
      "Calquer le genre français : le soleil est die Sonne, la lune est der Mond, le beurre est die Butter.",
      "Oublier que -chen rend le nom neutre : das Mädchen, pas die Mädchen.",
      "Apprendre les noms sans article : le genre commande toutes les terminaisons de la phrase."
    ],
    skills: ["articles-gender"]
  },
  {
    id: "de-r-articles-nominatif", level: "A1", group: "Genre et articles", order: 3,
    title: "Articles et nominatif",
    summary: "Le nominatif est le cas du sujet : der / die / das (défini), ein / eine / ein (indéfini), et la forme de base de chaque nom.",
    sections: [
      {
        heading: "Les articles au nominatif",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["défini", "der Arzt", "die Ärztin", "das Kind", "die Kinder"],
            ["indéfini", "ein Arzt", "eine Ärztin", "ein Kind", "(pas d'article) Kinder"],
            ["négatif", "kein Arzt", "keine Ärztin", "kein Kind", "keine Kinder"]
          ]
        }
      },
      {
        heading: "Quand utiliser le nominatif",
        points: [
          "Le sujet de la phrase : Der Arzt arbeitet.",
          "L'attribut après sein, werden, bleiben : Das ist ein Medikament. Er wird Arzt.",
          "Une profession sans article après sein / werden : Sie ist Ärztin (mais Sie ist eine gute Ärztin)."
        ]
      },
      {
        heading: "Article défini ou indéfini",
        text: "On emploie l'article défini quand le nom est connu ou unique (die Sonne), l'indéfini pour introduire quelque chose de nouveau (Ich habe einen Hund). Au pluriel, l'indéfini n'existe pas : on n'écrit rien (Ich habe Fragen)."
      }
    ],
    examples: [
      { target: "Der Patient wartet im Zimmer.", translation: "Le patient attend dans la chambre.", note: "Der Patient est le sujet : nominatif." },
      { target: "Das ist eine gute Idee.", translation: "C'est une bonne idée.", note: "Après sein, le nom reste au nominatif." },
      { target: "Sie ist Ärztin.", translation: "Elle est médecin.", note: "Profession sans article après sein." }
    ],
    pitfalls: [
      "Dire « Er ist ein Arzt » pour une simple profession : l'usage préfère Er ist Arzt.",
      "Chercher un article indéfini pluriel : « ein » n'a pas de pluriel (Ich habe Kinder).",
      "Confondre le nominatif féminin (die) avec le pluriel (die aussi) : le verbe aide à trancher."
    ],
    skills: ["articles-gender"]
  },

  // ---------------------------------------------------------------- Cas
  {
    id: "de-r-accusatif", level: "A1", group: "Cas", order: 4,
    title: "L'accusatif (complément d'objet direct)",
    summary: "À l'accusatif, seul le masculin change : der devient den, ein devient einen ; die, das et le pluriel restent identiques.",
    sections: [
      {
        heading: "Les formes",
        table: {
          caption: "Nominatif -> accusatif",
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["nominatif", "der / ein / kein", "die / eine / keine", "das / ein / kein", "die / – / keine"],
            ["accusatif", "den / einen / keinen", "die / eine / keine", "das / ein / kein", "die / – / keine"]
          ]
        }
      },
      {
        heading: "Quand l'employer",
        points: [
          "Complément d'objet direct : Ich sehe den Hund. Er kauft einen Apfel.",
          "Après les prépositions durch, für, gegen, ohne, um, bis, entlang.",
          "Pour exprimer une durée ou un moment précis : Ich bleibe einen Tag. Jeden Morgen trinke ich Kaffee.",
          "Avec les verbes de direction + Wechselpräposition (réponse à « wohin ? »)."
        ]
      },
      {
        heading: "Astuce",
        text: "Posez la question « wen ou was ? » (qui ou quoi ?) : Was kaufe ich ? Den Apfel. Si la réponse est masculine, pensez den / einen. Le nom lui-même ne change pas (sauf quelques masculins faibles : der Student -> den Studenten, der Junge -> den Jungen)."
      }
    ],
    examples: [
      { target: "Ich kaufe einen Apfel.", translation: "J'achète une pomme.", note: "der Apfel est masculin : ein devient einen." },
      { target: "Sie liebt den Lehrer.", translation: "Elle aime le professeur.", note: "den = masculin accusatif." },
      { target: "Wir haben keine Zeit.", translation: "Nous n'avons pas le temps.", note: "Féminin : keine ne change pas." },
      { target: "Er besucht den Studenten.", translation: "Il rend visite à l'étudiant.", note: "Masculin faible : -en au nom aussi." }
    ],
    pitfalls: [
      "Laisser der / ein au masculin accusatif : Ich sehe der Mann est faux, il faut Ich sehe den Mann.",
      "Changer aussi le féminin ou le neutre : ils restent identiques à l'accusatif.",
      "Oublier le -n des masculins faibles : den Studenten, den Kollegen, den Patienten."
    ],
    skills: ["accusative", "articles-gender"]
  },
  {
    id: "de-r-datif", level: "A2", group: "Cas", order: 5,
    title: "Le datif (complément d'attribution)",
    summary: "Le datif répond à « à qui ? » : dem (m, n), der (f), den + -n (pluriel) ; il suit mit, bei, nach, von, zu, aus, seit, et des verbes comme helfen ou gehören.",
    sections: [
      {
        heading: "Les formes",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["nominatif", "der / ein", "die / eine", "das / ein", "die"],
            ["datif", "dem / einem", "der / einer", "dem / einem", "den + -n (den Kindern)"],
            ["pronom", "ihm", "ihr", "ihm", "ihnen"]
          ]
        }
      },
      {
        heading: "Quand l'employer",
        points: [
          "Complément d'attribution (à qui ?) : Ich gebe dem Kind das Buch.",
          "Après aus, außer, bei, mit, nach, seit, von, zu, gegenüber : mit dem Zug, bei der Arbeit.",
          "Après certains verbes : helfen, danken, gehören, gefallen, antworten, schmecken, passen, fehlen : Ich helfe dem Patienten.",
          "Au pluriel, le nom prend -n au datif (sauf s'il finit déjà par -n ou -s) : mit den Kindern, mit den Autos."
        ]
      },
      {
        heading: "Ordre des compléments",
        text: "Quand il y a deux compléments, le datif (la personne) précède généralement l'accusatif (la chose) : Ich gebe dem Arzt das Formular. Si l'accusatif est un pronom, il passe en premier : Ich gebe es dem Arzt."
      }
    ],
    examples: [
      { target: "Ich fahre mit dem Zug.", translation: "Je vais en train.", note: "mit exige toujours le datif." },
      { target: "Das Buch gehört der Frau.", translation: "Le livre appartient à la femme.", note: "gehören + datif ; féminin = der." },
      { target: "Er hilft den Kindern.", translation: "Il aide les enfants.", note: "Pluriel au datif : den + nom en -n." },
      { target: "Wie geht es Ihnen?", translation: "Comment allez-vous ?", note: "Ihnen = datif de Sie." }
    ],
    pitfalls: [
      "Mettre l'accusatif après mit, bei, von, zu : on dit mit dem Auto, pas mit das Auto.",
      "Oublier le -n du datif pluriel : mit den Kindern, pas mit den Kinder.",
      "Traduire littéralement « aider quelqu'un » : helfen veut le datif (Ich helfe dir), pas l'accusatif.",
      "Confondre dem (m / n) et der (f) : le féminin datif est der, comme le nominatif masculin."
    ],
    skills: ["dative", "articles-gender"]
  },
  {
    id: "de-r-genitif", level: "B1", group: "Cas", order: 6,
    title: "Le génitif (possession et rapports)",
    summary: "Le génitif marque l'appartenance : des (m, n) + nom en -s / -es, der (f et pluriel) ; il suit wegen, trotz, während, statt.",
    sections: [
      {
        heading: "Les formes",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["défini", "des Arztes", "der Ärztin", "des Kindes", "der Kinder"],
            ["indéfini", "eines Arztes", "einer Ärztin", "eines Kindes", "–"],
            ["pronom relatif", "dessen", "deren", "dessen", "deren"]
          ]
        }
      },
      {
        heading: "Quand l'employer",
        points: [
          "Appartenance, relation : das Auto des Nachbarn, die Tasche der Frau.",
          "Prépositions : wegen, trotz, während, statt / anstatt, innerhalb, außerhalb. Wegen des Regens bleiben wir hier.",
          "À l'oral, on dit souvent von + datif : das Auto von meinem Vater. Cette tournure reste correcte.",
          "Noms de personnes : Annas Buch (nom propre + -s, sans article)."
        ]
      },
      {
        heading: "Terminaisons du nom",
        text: "Les noms masculins et neutres prennent -s ou -es : des Hauses, des Tisches, des Kindes. Les noms courts et les mots en -s, -ß, -x, -z prennent plutôt -es ; les mots longs ou en -er, -en, -el prennent -s. Les masculins faibles prennent -(e)n : des Studenten, des Patienten."
      }
    ],
    examples: [
      { target: "Das ist das Auto meines Vaters.", translation: "C'est la voiture de mon père.", note: "meines Vaters : génitif masculin avec -s sur le nom." },
      { target: "Wegen des Regens bleiben wir zu Hause.", translation: "À cause de la pluie, nous restons à la maison.", note: "wegen + génitif : des Regens." },
      { target: "Trotz der Kälte gehen sie spazieren.", translation: "Malgré le froid, ils vont se promener.", note: "Féminin génitif : der Kälte." },
      { target: "Die Meinung des Patienten ist wichtig.", translation: "L'avis du patient est important.", note: "Masculin faible : des Patienten." }
    ],
    pitfalls: [
      "Traduire « le livre de Marie » par das Buch von der Marie en toutes circonstances : on dit Marias Buch ou das Buch von Maria.",
      "Oublier le -s du nom masculin ou neutre : le génitif de das Kind est des Kindes, pas des Kind.",
      "Utiliser le datif après wegen dans un texte soigné : l'écrit standard garde le génitif."
    ],
    skills: ["articles-gender", "possessives"]
  },
  {
    id: "de-r-pronoms-possessifs", level: "A1", group: "Cas", order: 7,
    title: "Pronoms personnels et possessifs",
    summary: "Les pronoms changent selon le cas (ich, mich, mir) ; les possessifs (mein, dein…) se déclinent comme ein / kein.",
    sections: [
      {
        heading: "Pronoms personnels aux trois cas",
        table: {
          head: ["Nominatif", "Accusatif", "Datif"],
          rows: [
            ["ich", "mich", "mir"],
            ["du", "dich", "dir"],
            ["er", "ihn", "ihm"],
            ["sie (elle)", "sie", "ihr"],
            ["es", "es", "ihm"],
            ["wir", "uns", "uns"],
            ["ihr", "euch", "euch"],
            ["sie (ils)", "sie", "ihnen"],
            ["Sie (vouvoiement)", "Sie", "Ihnen"]
          ]
        }
      },
      {
        heading: "Les possessifs",
        table: {
          head: ["Personne", "Possessif", "Exemple (nominatif m / f)"],
          rows: [
            ["ich", "mein-", "mein Vater / meine Mutter"],
            ["du", "dein-", "dein Vater / deine Mutter"],
            ["er, es", "sein-", "sein Vater / seine Mutter"],
            ["sie (elle)", "ihr-", "ihr Vater / ihre Mutter"],
            ["wir", "unser-", "unser Vater / unsere Mutter"],
            ["ihr", "euer-", "euer Vater / eure Mutter"],
            ["sie (ils)", "ihr-", "ihr Vater / ihre Mutter"],
            ["Sie", "Ihr-", "Ihr Vater / Ihre Mutter"]
          ]
        }
      },
      {
        heading: "Terminaisons du possessif",
        text: "Le possessif porte les mêmes terminaisons que ein : masculin accusatif meinen, datif meinem (m, n) et meiner (f), pluriel meine. Le radical dépend du possesseur (sein- pour il, ihr- pour elle) ; la terminaison dépend du genre et du cas du nom possédé : seine Mutter (sa mère, à lui), ihre Mutter (sa mère, à elle), ihr Vater (son père, à elle)."
      }
    ],
    examples: [
      { target: "Ich sehe ihn jeden Tag.", translation: "Je le vois tous les jours.", note: "ihn = er à l'accusatif." },
      { target: "Kannst du mir helfen?", translation: "Peux-tu m'aider ?", note: "helfen veut le datif : mir." },
      { target: "Sie besucht ihren Bruder.", translation: "Elle rend visite à son frère.", note: "ihren : possessif + accusatif masculin (-en)." },
      { target: "Wie geht es Ihnen?", translation: "Comment allez-vous ?", note: "Ihnen : majuscule de politesse." }
    ],
    pitfalls: [
      "Choisir sein/ihr d'après le nom possédé comme en français : « son père » (à elle) se dit ihr Vater, pas sein Vater.",
      "Oublier la terminaison du masculin accusatif : Ich liebe meinen Vater, pas mein Vater.",
      "Confondre sie (elle), sie (ils) et Sie (vous) : verbe et contexte aident ; Sie poli prend toujours la majuscule.",
      "Oublier que euer perd le e devant une terminaison : eure Mutter, euren Vater."
    ],
    skills: ["possessives", "accusative", "dative"]
  },

  // ---------------------------------------------------------------- Prépositions
  {
    id: "de-r-prepositions-cas", level: "A2", group: "Prépositions", order: 8,
    title: "Prépositions et cas",
    summary: "Chaque préposition impose un cas : accusatif (durch, für, gegen, ohne, um), datif (aus, bei, mit, nach, seit, von, zu), génitif (wegen, trotz, während).",
    sections: [
      {
        heading: "Les trois listes à connaître",
        table: {
          head: ["Cas", "Prépositions", "Exemple"],
          rows: [
            ["accusatif", "durch, für, gegen, ohne, um, bis, entlang", "für den Arzt, ohne die Brille"],
            ["datif", "aus, außer, bei, mit, nach, seit, von, zu, gegenüber", "mit dem Zug, bei der Arbeit"],
            ["génitif", "wegen, trotz, während, statt, innerhalb", "wegen des Regens"]
          ]
        }
      },
      {
        heading: "Astuces de mémorisation",
        points: [
          "Accusatif : « durch, für, gegen, ohne, um » : « DOGFU » (durch, ohne, gegen, für, um).",
          "Datif : « aus, bei, mit, nach, seit, von, zu » : sept prépositions toujours suivies du datif.",
          "Contractions : zu + dem = zum, zu + der = zur, bei + dem = beim, von + dem = vom, in + dem = im, an + dem = am, in + das = ins, für + das = fürs."
        ]
      },
      {
        heading: "Sens à ne pas confondre",
        points: [
          "nach + ville / pays sans article : nach Berlin ; zu + personne ou lieu : zum Arzt, zur Apotheke.",
          "bei + personne ou lieu (chez, auprès de) : beim Arzt ; seit + durée passée : seit zwei Jahren.",
          "von + datif = « de » (origine ou auteur) ; aus = « hors de » ou provenance : aus der Schweiz."
        ]
      }
    ],
    examples: [
      { target: "Ich gehe zum Arzt.", translation: "Je vais chez le médecin.", note: "zu + dem = zum ; zu veut le datif." },
      { target: "Das Geschenk ist für meinen Bruder.", translation: "Le cadeau est pour mon frère.", note: "für + accusatif : meinen." },
      { target: "Seit einem Jahr lerne ich Deutsch.", translation: "J'apprends l'allemand depuis un an.", note: "seit + datif : einem Jahr." },
      { target: "Wir wohnen bei meinen Eltern.", translation: "Nous habitons chez mes parents.", note: "bei + datif pluriel : meinen Eltern." }
    ],
    pitfalls: [
      "Utiliser l'accusatif par automatisme après mit ou bei : le datif est obligatoire.",
      "Avec seit, garder le présent comme en français (Ich wohne seit 2020 hier), et non le Perfekt.",
      "Oublier les contractions : on dit zum Bahnhof, pas zu dem Bahnhof (sauf insistance)."
    ],
    skills: ["accusative", "dative"]
  },
  {
    id: "de-r-wechselpraepositionen", level: "A2", group: "Prépositions", order: 9,
    title: "Prépositions mixtes (Wechselpräpositionen)",
    summary: "Neuf prépositions prennent l'accusatif pour le mouvement (wohin ?) et le datif pour la position (wo ?).",
    sections: [
      {
        heading: "Les neuf prépositions",
        text: "an, auf, hinter, in, neben, über, unter, vor, zwischen. Le verbe indique si l'on bouge (accusatif) ou si l'on est quelque part (datif)."
      },
      {
        heading: "Wo ? Wohin ?",
        table: {
          head: ["Question", "Cas", "Verbes typiques", "Exemple"],
          rows: [
            ["Wo ? (où ?)", "datif", "sein, stehen, liegen, sitzen, hängen, wohnen", "Das Buch liegt auf dem Tisch."],
            ["Wohin ? (vers où ?)", "accusatif", "gehen, legen, stellen, setzen, hängen (accrocher), fahren", "Ich lege das Buch auf den Tisch."]
          ]
        }
      },
      {
        heading: "Paires de verbes",
        table: {
          head: ["Position (datif)", "Mouvement (accusatif)"],
          rows: [
            ["liegen (être couché)", "legen (poser à plat)"],
            ["stehen (être debout)", "stellen (poser debout)"],
            ["sitzen (être assis)", "setzen (asseoir)"],
            ["hängen (être suspendu)", "hängen (accrocher)"]
          ]
        }
      },
      {
        heading: "Article attendu",
        text: "Datif : in dem = im, an dem = am, auf dem. Accusatif : in das = ins, an das = ans, auf das. Féminin datif : in der Küche ; féminin accusatif : in die Küche."
      }
    ],
    examples: [
      { target: "Ich bin in der Küche.", translation: "Je suis dans la cuisine.", note: "Position : datif (der)." },
      { target: "Ich gehe in die Küche.", translation: "Je vais dans la cuisine.", note: "Mouvement : accusatif (die)." },
      { target: "Die Lampe hängt über dem Tisch.", translation: "La lampe est suspendue au-dessus de la table.", note: "hängt = position : dem Tisch (datif)." },
      { target: "Er stellt die Flasche auf den Tisch.", translation: "Il pose la bouteille sur la table.", note: "stellen = mouvement : accusatif den Tisch." }
    ],
    pitfalls: [
      "Ne pas regarder le verbe : c'est le sens (position ou mouvement) qui décide, pas la préposition.",
      "Mélanger liegen / legen et stehen / stellen : le premier est la position (datif), le second le mouvement (accusatif).",
      "Employer ces prépositions au sens figuré : elles peuvent se figer avec un seul cas (Angst haben vor + datif)."
    ],
    skills: ["accusative", "dative"]
  },

  // ---------------------------------------------------------------- Adjectifs et pluriels
  {
    id: "de-r-pluriels", level: "A1", group: "Adjectifs et pluriels", order: 10,
    title: "Les pluriels (cinq types)",
    summary: "Le pluriel allemand n'est pas prévisible : cinq types (-e, -er, -(e)n, -s, sans terminaison), avec souvent un tréma ; apprenez-le avec le nom.",
    sections: [
      {
        heading: "Les types de pluriel",
        table: {
          head: ["Type", "Exemples", "Particularités"],
          rows: [
            ["-e (avec ou sans tréma)", "der Tag -> die Tage ; der Stuhl -> die Stühle", "Surtout masculins et quelques neutres"],
            ["-er (avec tréma si possible)", "das Kind -> die Kinder ; das Buch -> die Bücher ; das Haus -> die Häuser", "Surtout neutres"],
            ["-(e)n", "die Frau -> die Frauen ; die Blume -> die Blumen ; der Student -> die Studenten", "Presque tous les féminins"],
            ["-s", "das Auto -> die Autos ; das Hotel -> die Hotels ; das Handy -> die Handys", "Mots d'origine étrangère"],
            ["sans terminaison (avec ou sans tréma)", "der Lehrer -> die Lehrer ; der Apfel -> die Äpfel ; die Mutter -> die Mütter", "Masculins et neutres en -er, -el, -en"]
          ]
        }
      },
      {
        heading: "Règles d'appoint",
        points: [
          "Au pluriel, l'article défini est toujours die, quel que soit le genre : die Kinder, die Männer, die Frauen.",
          "Les noms féminins en -ung, -heit, -keit, -schaft, -in font -en (-nen pour -in) : die Behandlungen, die Ärztinnen.",
          "Au datif pluriel, ajoutez -n (sauf si le pluriel finit en -n ou -s) : mit den Kindern.",
          "Indiquez toujours le pluriel avec le nom : der Mann, die Männer."
        ]
      }
    ],
    examples: [
      { target: "Zwei Äpfel und drei Birnen.", translation: "Deux pommes et trois poires.", note: "Apfel -> Äpfel (tréma) ; Birne -> Birnen." },
      { target: "Die Kinder spielen im Garten.", translation: "Les enfants jouent dans le jardin.", note: "das Kind -> die Kinder (-er)." },
      { target: "Die Ärztinnen arbeiten hier.", translation: "Les médecins (femmes) travaillent ici.", note: "-in -> -innen." },
      { target: "Wir haben zwei Autos.", translation: "Nous avons deux voitures.", note: "Mot d'emprunt : -s." }
    ],
    pitfalls: [
      "Ajouter -s partout par calque du français : seuls les mots étrangers le prennent (Autos, Hotels), mais pas die Kinders ni die Frauens.",
      "Oublier le tréma : Mutter -> Mütter, Haus -> Häuser, Buch -> Bücher.",
      "Laisser l'article au genre singulier : au pluriel, c'est toujours die.",
      "Oublier le -n du datif pluriel : mit den Kindern, bei den Eltern."
    ],
    skills: ["articles-gender"]
  },
  {
    id: "de-r-adjectifs-declinaison", level: "A2", group: "Adjectifs et pluriels", order: 11,
    title: "Déclinaison des adjectifs épithètes",
    summary: "Devant un nom, l'adjectif prend une terminaison qui dépend de l'article, du genre et du cas ; attribut (après sein), il reste invariable.",
    sections: [
      {
        heading: "Principe",
        text: "Attribut, l'adjectif ne change pas : Das Haus ist groß. Épithète (devant le nom), il prend une terminaison. Si l'article ne marque pas déjà le genre et le cas, c'est l'adjectif qui porte la marque."
      },
      {
        heading: "Après l'article défini (der, die, das, dieser, jeder…)",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["nominatif", "der gute Arzt", "die gute Ärztin", "das gute Kind", "die guten Kinder"],
            ["accusatif", "den guten Arzt", "die gute Ärztin", "das gute Kind", "die guten Kinder"],
            ["datif", "dem guten Arzt", "der guten Ärztin", "dem guten Kind", "den guten Kindern"],
            ["génitif", "des guten Arztes", "der guten Ärztin", "des guten Kindes", "der guten Kinder"]
          ]
        }
      },
      {
        heading: "Après l'article indéfini (ein, kein, mein…)",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["nominatif", "ein guter Arzt", "eine gute Ärztin", "ein gutes Kind", "keine guten Kinder"],
            ["accusatif", "einen guten Arzt", "eine gute Ärztin", "ein gutes Kind", "keine guten Kinder"],
            ["datif", "einem guten Arzt", "einer guten Ärztin", "einem guten Kind", "keinen guten Kindern"],
            ["génitif", "eines guten Arztes", "einer guten Ärztin", "eines guten Kindes", "keiner guten Kinder"]
          ]
        }
      },
      {
        heading: "Sans article",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["nominatif", "guter Kaffee", "gute Milch", "gutes Wasser", "gute Freunde"],
            ["accusatif", "guten Kaffee", "gute Milch", "gutes Wasser", "gute Freunde"],
            ["datif", "gutem Kaffee", "guter Milch", "gutem Wasser", "guten Freunden"],
            ["génitif", "guten Kaffees", "guter Milch", "guten Wassers", "guter Freunde"]
          ]
        }
      },
      {
        heading: "Mémo",
        points: [
          "Après l'article défini : seulement -e ou -en. -e au nominatif singulier (et accusatif f, n), -en partout ailleurs.",
          "Après ein : l'adjectif porte la marque que l'article ne porte pas (ein guter, ein gutes).",
          "Sans article : l'adjectif reprend la terminaison de l'article défini (guter, gute, gutes, gutem, guter…)."
        ]
      }
    ],
    examples: [
      { target: "Ich kaufe einen neuen Mantel.", translation: "J'achète un nouveau manteau.", note: "ein + masculin accusatif : -en." },
      { target: "Das ist ein gutes Beispiel.", translation: "C'est un bon exemple.", note: "ein + neutre nominatif : -es." },
      { target: "Sie wohnt in einer kleinen Wohnung.", translation: "Elle habite dans un petit appartement.", note: "Datif féminin : -en." },
      { target: "Wir trinken heißen Tee.", translation: "Nous buvons du thé chaud.", note: "Sans article, masculin accusatif : -en." }
    ],
    pitfalls: [
      "Décliner l'adjectif attribut : on dit Das Auto ist neu, pas Das Auto ist neues.",
      "Utiliser -e partout après l'article défini : seul le nominatif singulier et l'accusatif féminin / neutre le gardent ; ailleurs c'est -en.",
      "Oublier la marque du genre après ein : au nominatif masculin, on dit ein guter Mann (pas ein gute Mann) et ein gutes Kind.",
      "Oublier de décliner l'adjectif sans article : gute Freunde, mit guten Freunden."
    ],
    skills: ["articles-gender", "accusative", "dative"]
  },
  {
    id: "de-r-comparatifs", level: "A2", group: "Adjectifs et pluriels", order: 12,
    title: "Comparatifs et superlatifs",
    summary: "Comparatif en -er + als, superlatif en am -sten ; quelques adjectifs prennent un tréma ou sont irréguliers (gut, besser, am besten).",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Forme", "Règle", "Exemple"],
          rows: [
            ["positif", "adjectif", "schnell"],
            ["comparatif", "adjectif + -er", "schneller"],
            ["superlatif attribut", "am + adjectif + -sten", "am schnellsten"],
            ["superlatif épithète", "der / die / das + adjectif + -ste / -sten (selon le cas)", "der schnellste Zug"]
          ]
        }
      },
      {
        heading: "Tréma et irréguliers",
        table: {
          head: ["Adjectif", "Comparatif", "Superlatif"],
          rows: [
            ["alt", "älter", "am ältesten"],
            ["jung", "jünger", "am jüngsten"],
            ["groß", "größer", "am größten"],
            ["gut", "besser", "am besten"],
            ["viel", "mehr", "am meisten"],
            ["gern", "lieber", "am liebsten"],
            ["hoch", "höher", "am höchsten"],
            ["nah", "näher", "am nächsten"]
          ]
        }
      },
      {
        heading: "Comparer",
        points: [
          "Égalité : so ... wie : Er ist so groß wie ich.",
          "Supériorité : comparatif + als : Er ist größer als ich.",
          "Plus ... plus ... : je + comparatif ... desto + comparatif : Je mehr ich übe, desto besser spreche ich.",
          "Après un article, le comparatif se décline : ein größeres Zimmer, der ältere Bruder."
        ]
      }
    ],
    examples: [
      { target: "Mein Bruder ist älter als ich.", translation: "Mon frère est plus âgé que moi.", note: "alt -> älter (tréma) ; comparaison avec als." },
      { target: "Dieser Zug ist am schnellsten.", translation: "Ce train est le plus rapide.", note: "Superlatif attribut : am ... -sten." },
      { target: "Ich trinke lieber Tee als Kaffee.", translation: "Je préfère le thé au café.", note: "gern -> lieber ; als pour comparer." },
      { target: "Je früher, desto besser.", translation: "Le plus tôt sera le mieux.", note: "je + comparatif, desto + comparatif." }
    ],
    pitfalls: [
      "Écrire « als » pour l'égalité ou « wie » pour la supériorité : so groß wie, mais größer als.",
      "Oublier le tréma : alt -> älter, jung -> jünger, groß -> größer.",
      "Dire mehr gut au lieu de besser : gut est irrégulier.",
      "Oublier le « am » avec le superlatif attribut : am schnellsten, pas schnellsten tout seul."
    ],
    skills: ["comparison"]
  },

  // ---------------------------------------------------------------- Verbes et temps
  {
    id: "de-r-present-irreguliers", level: "A1", group: "Verbes et temps", order: 13,
    title: "Présent et verbes irréguliers",
    summary: "Radical + terminaison (-e, -st, -t, -en, -t, -en) ; les verbes forts changent de voyelle à du / er (fahren, du fährst), et sein, haben, werden sont irréguliers.",
    sections: [
      {
        heading: "Verbe régulier : machen",
        table: {
          head: ["Personne", "machen", "arbeiten (radical en -t / -d)"],
          rows: [
            ["ich", "mache", "arbeite"],
            ["du", "machst", "arbeitest"],
            ["er / sie / es", "macht", "arbeitet"],
            ["wir", "machen", "arbeiten"],
            ["ihr", "macht", "arbeitet"],
            ["sie / Sie", "machen", "arbeiten"]
          ]
        }
      },
      {
        heading: "Les trois auxiliaires",
        table: {
          head: ["Personne", "sein", "haben", "werden"],
          rows: [
            ["ich", "bin", "habe", "werde"],
            ["du", "bist", "hast", "wirst"],
            ["er / sie / es", "ist", "hat", "wird"],
            ["wir", "sind", "haben", "werden"],
            ["ihr", "seid", "habt", "werdet"],
            ["sie / Sie", "sind", "haben", "werden"]
          ]
        }
      },
      {
        heading: "Verbes à changement de voyelle (du et er seulement)",
        table: {
          head: ["Infinitif", "ich", "du", "er / sie / es"],
          rows: [
            ["fahren", "fahre", "fährst", "fährt"],
            ["schlafen", "schlafe", "schläfst", "schläft"],
            ["laufen", "laufe", "läufst", "läuft"],
            ["essen", "esse", "isst", "isst"],
            ["sprechen", "spreche", "sprichst", "spricht"],
            ["sehen", "sehe", "siehst", "sieht"],
            ["lesen", "lese", "liest", "liest"],
            ["nehmen", "nehme", "nimmst", "nimmt"],
            ["geben", "gebe", "gibst", "gibt"],
            ["helfen", "helfe", "hilfst", "hilft"],
            ["wissen (change aussi à ich : ich weiß)", "weiß", "weißt", "weiß"]
          ]
        }
      }
    ],
    examples: [
      { target: "Er fährt jeden Tag mit dem Bus.", translation: "Il prend le bus tous les jours.", note: "fahren -> er fährt (a devient ä)." },
      { target: "Du sprichst sehr gut Deutsch.", translation: "Tu parles très bien allemand.", note: "sprechen -> du sprichst (e devient i)." },
      { target: "Ich weiß es nicht.", translation: "Je ne le sais pas.", note: "wissen : ich weiß, du weißt, er weiß." },
      { target: "Sie arbeitet im Krankenhaus.", translation: "Elle travaille à l'hôpital.", note: "arbeiten -> -et après radical en -t." }
    ],
    pitfalls: [
      "Appliquer le changement de voyelle à ich ou wir : il ne concerne que du et er / sie / es (ich fahre, du fährst).",
      "Oublier le e de liaison : du arbeitest, er arbeitet.",
      "Traduire « il y a » par er hat : on dit es gibt + accusatif (Es gibt einen Arzt).",
      "Employer le présent progressif français : l'allemand n'a qu'une forme (Ich arbeite = je travaille / je suis en train de travailler)."
    ],
    skills: ["present-tense"]
  },
  {
    id: "de-r-verbes-modaux", level: "A1", group: "Verbes et temps", order: 14,
    title: "Les verbes modaux",
    summary: "können, müssen, wollen, sollen, dürfen, mögen / möchten : le modal est conjugué en 2e position et l'infinitif part à la fin de la phrase.",
    sections: [
      {
        heading: "Conjugaison au présent",
        table: {
          head: ["Personne", "können", "müssen", "wollen", "sollen", "dürfen", "möchte"],
          rows: [
            ["ich", "kann", "muss", "will", "soll", "darf", "möchte"],
            ["du", "kannst", "musst", "willst", "sollst", "darfst", "möchtest"],
            ["er / sie / es", "kann", "muss", "will", "soll", "darf", "möchte"],
            ["wir", "können", "müssen", "wollen", "sollen", "dürfen", "möchten"],
            ["ihr", "könnt", "müsst", "wollt", "sollt", "dürft", "möchtet"],
            ["sie / Sie", "können", "müssen", "wollen", "sollen", "dürfen", "möchten"]
          ]
        }
      },
      {
        heading: "Sens",
        table: {
          head: ["Modal", "Sens", "Exemple"],
          rows: [
            ["können", "pouvoir (capacité, possibilité)", "Ich kann schwimmen."],
            ["müssen", "devoir (nécessité)", "Ich muss arbeiten."],
            ["wollen", "vouloir (volonté forte)", "Ich will gehen."],
            ["sollen", "devoir (ordre d'un tiers)", "Du sollst mehr trinken."],
            ["dürfen", "avoir le droit", "Hier darf man nicht rauchen."],
            ["möchte", "souhaiter (poli)", "Ich möchte einen Kaffee."]
          ]
        }
      },
      {
        heading: "Construction",
        text: "Le modal conjugué est en 2e position, l'infinitif est rejeté en fin de proposition : Ich muss heute lange arbeiten. Avec un verbe séparable, la particule se recolle : Ich muss um sieben aufstehen. Ne pas confondre ich muss nicht (je n'ai pas besoin de) et ich darf nicht (je n'ai pas le droit)."
      }
    ],
    examples: [
      { target: "Ich kann heute nicht kommen.", translation: "Je ne peux pas venir aujourd'hui.", note: "Modal en 2e position, infinitif à la fin." },
      { target: "Du musst mehr Wasser trinken.", translation: "Tu dois boire plus d'eau.", note: "müssen : nécessité." },
      { target: "Hier darf man nicht rauchen.", translation: "Ici on n'a pas le droit de fumer.", note: "dürfen nicht = interdiction." },
      { target: "Möchten Sie einen Tee?", translation: "Désirez-vous un thé ?", note: "möchte : forme polie de vouloir." }
    ],
    pitfalls: [
      "Ajouter zu après un modal : on dit Ich kann kommen, pas Ich kann zu kommen.",
      "Conjuguer l'infinitif aussi : seul le modal prend la personne (Er kann kommen).",
      "Oublier l'irrégularité de ich / er : kann, muss, will, soll, darf n'ont pas de -e.",
      "Confondre müssen nicht (pas obligé) et dürfen nicht (interdit)."
    ],
    skills: ["modals"]
  },
  {
    id: "de-r-verbes-separables", level: "A2", group: "Verbes et temps", order: 15,
    title: "Les verbes à particule séparable",
    summary: "La particule (an-, auf-, aus-, ein-, mit-, vor-, zu-…) se détache et part en fin de phrase au présent ; elle se recolle à l'infinitif et au participe.",
    sections: [
      {
        heading: "Fonctionnement",
        table: {
          head: ["Temps ou forme", "aufstehen (se lever)", "anrufen (téléphoner)"],
          rows: [
            ["présent", "Ich stehe um sieben auf.", "Ich rufe dich an."],
            ["avec modal", "Ich muss früh aufstehen.", "Ich will dich anrufen."],
            ["subordonnée", "..., weil ich früh aufstehe.", "..., dass ich dich anrufe."],
            ["Perfekt", "Ich bin aufgestanden.", "Ich habe angerufen."],
            ["impératif", "Steh auf!", "Ruf an!"],
            ["avec zu", "Es ist schwer, früh aufzustehen.", "Ich vergesse, dich anzurufen."]
          ]
        }
      },
      {
        heading: "Particules séparables et inséparables",
        points: [
          "Séparables, accentuées : ab-, an-, auf-, aus-, bei-, ein-, mit-, nach-, vor-, zu-, zurück-… (ankommen, einkaufen, mitkommen).",
          "Inséparables, non accentuées : be-, emp-, ent-, er-, ge-, miss-, ver-, zer- (verstehen, besuchen, bekommen). Pas de ge- au participe : verstanden, besucht.",
          "Le sens des préfixes peut changer : aufstehen (se lever) mais verstehen (comprendre)."
        ]
      }
    ],
    examples: [
      { target: "Der Zug kommt um acht Uhr an.", translation: "Le train arrive à huit heures.", note: "an- part à la fin de la proposition." },
      { target: "Ich kaufe heute Abend ein.", translation: "Je fais les courses ce soir.", note: "einkaufen : ein- en fin de phrase." },
      { target: "Wir haben gestern den Arzt angerufen.", translation: "Nous avons appelé le médecin hier.", note: "Participe : an + ge + rufen = angerufen." },
      { target: "Kannst du mich morgen abholen?", translation: "Peux-tu venir me chercher demain ?", note: "Avec modal, l'infinitif reste soudé." }
    ],
    pitfalls: [
      "Laisser la particule collée à la 2e position : Ich anrufe dich est faux, on dit Ich rufe dich an.",
      "Oublier que la particule se recolle dans une subordonnée : ..., weil er morgen anruft.",
      "Ajouter ge- devant un verbe inséparable : on dit besucht, pas gebesucht.",
      "Couper les verbes à préfixe inséparable : Ich verstehe dich, pas Ich stehe dich ver."
    ],
    skills: ["separable-verbs"]
  },
  {
    id: "de-r-verbes-pronominaux", level: "A2", group: "Verbes et temps", order: 16,
    title: "Les verbes pronominaux (réfléchis)",
    summary: "Le pronom réfléchi (mich, dich, sich, uns, euch, sich) se place après le verbe ; il est au datif quand le verbe a déjà un complément à l'accusatif.",
    sections: [
      {
        heading: "Les pronoms réfléchis",
        table: {
          head: ["Personne", "accusatif", "datif"],
          rows: [
            ["ich", "mich", "mir"],
            ["du", "dich", "dir"],
            ["er / sie / es", "sich", "sich"],
            ["wir", "uns", "uns"],
            ["ihr", "euch", "euch"],
            ["sie / Sie", "sich", "sich"]
          ]
        }
      },
      {
        heading: "Verbes courants",
        points: [
          "sich waschen, sich anziehen, sich setzen, sich legen, sich freuen (auf / über), sich erinnern (an), sich interessieren (für), sich fühlen, sich treffen, sich beeilen.",
          "Le datif est utilisé quand il y a déjà un complément d'objet direct : Ich wasche mir die Hände (je me lave les mains), Ich putze mir die Zähne.",
          "Il existe des verbes réfléchis purs (sich erholen) et des verbes qui existent sans pronom avec un autre sens (sich fühlen / fühlen)."
        ]
      },
      {
        heading: "Place",
        text: "Le pronom réfléchi suit le verbe conjugué : Ich freue mich auf das Wochenende. Dans une phrase avec inversion, il suit le sujet : Morgen treffen wir uns. Dans une subordonnée, il se place avant le sujet si celui-ci est un nom, après s'il est un pronom : ..., weil sich der Patient gut fühlt ; ..., weil er sich gut fühlt."
      }
    ],
    examples: [
      { target: "Ich freue mich auf den Urlaub.", translation: "Je me réjouis des vacances.", note: "sich freuen auf + accusatif." },
      { target: "Er interessiert sich für Medizin.", translation: "Il s'intéresse à la médecine.", note: "sich interessieren für + accusatif." },
      { target: "Wir treffen uns um acht Uhr.", translation: "Nous nous retrouvons à huit heures.", note: "uns : réfléchi (accusatif)." },
      { target: "Ich putze mir die Zähne.", translation: "Je me brosse les dents.", note: "mir : datif car die Zähne est l'accusatif." }
    ],
    pitfalls: [
      "Utiliser mich quand le complément direct est déjà exprimé : on dit Ich wasche mir die Hände, pas Ich wasche mich die Hände.",
      "Oublier le sich de la 3e personne : Er freut sich, pas Er freut.",
      "Traduire les verbes français sans vérifier : s'asseoir = sich setzen ; se rappeler = sich erinnern an.",
      "Confondre préposition et pronom : sich freuen auf (futur) / über (présent)."
    ],
    skills: ["present-tense"]
  },
  {
    id: "de-r-perfekt", level: "A2", group: "Verbes et temps", order: 17,
    title: "Le Perfekt (passé composé)",
    summary: "haben ou sein conjugué en 2e position + participe II à la fin ; sein pour les verbes de mouvement ou de changement d'état.",
    sections: [
      {
        heading: "Formation du participe II",
        table: {
          head: ["Type", "Règle", "Exemples"],
          rows: [
            ["faible (réguliers)", "ge- + radical + -t", "machen -> gemacht ; arbeiten -> gearbeitet"],
            ["fort (irréguliers)", "ge- + radical (changé) + -en", "essen -> gegessen ; sehen -> gesehen ; nehmen -> genommen"],
            ["mixte", "ge- + radical modifié + -t", "bringen -> gebracht ; denken -> gedacht ; wissen -> gewusst"],
            ["séparable", "particule + ge + radical", "aufstehen -> aufgestanden ; anrufen -> angerufen"],
            ["inséparable (be-, ver-, er-…)", "pas de ge-", "besuchen -> besucht ; verstehen -> verstanden"],
            ["en -ieren", "pas de ge-", "studieren -> studiert ; telefonieren -> telefoniert"]
          ]
        }
      },
      {
        heading: "haben ou sein ?",
        table: {
          head: ["Auxiliaire", "Verbes", "Exemples"],
          rows: [
            ["sein", "mouvement vers un lieu : gehen, fahren, kommen, fliegen, laufen", "Ich bin nach Berlin gefahren."],
            ["sein", "changement d'état : aufstehen, einschlafen, werden, sterben", "Er ist eingeschlafen."],
            ["sein", "sein, bleiben, passieren, geschehen", "Wir sind zu Hause geblieben."],
            ["haben", "tous les autres, dont les transitifs et les modaux", "Ich habe einen Apfel gegessen."]
          ]
        }
      },
      {
        heading: "Place des mots",
        text: "L'auxiliaire est en 2e position, le participe tout à la fin : Ich habe gestern einen Film gesehen. Dans une subordonnée, l'auxiliaire va après le participe : ..., weil ich gestern einen Film gesehen habe."
      }
    ],
    examples: [
      { target: "Ich habe gestern Fisch gegessen.", translation: "J'ai mangé du poisson hier.", note: "essen -> gegessen ; auxiliaire haben." },
      { target: "Wir sind nach Hause gegangen.", translation: "Nous sommes rentrés à la maison.", note: "Mouvement : sein + gegangen." },
      { target: "Er hat den Patienten untersucht.", translation: "Il a examiné le patient.", note: "Inséparable : pas de ge-." },
      { target: "Sie ist früh aufgestanden.", translation: "Elle s'est levée tôt.", note: "Séparable + changement d'état : sein + aufgestanden." }
    ],
    pitfalls: [
      "Choisir toujours haben comme en français : avec gehen, fahren, kommen, bleiben, il faut sein.",
      "Ajouter ge- à un verbe inséparable ou en -ieren : on dit besucht, studiert.",
      "Placer le participe en 2e position : il reste en fin de phrase.",
      "Utiliser le Perfekt partout à l'écrit : les récits écrits utilisent surtout le Präteritum."
    ],
    skills: ["perfekt"]
  },
  {
    id: "de-r-preteritum", level: "B1", group: "Verbes et temps", order: 18,
    title: "Le Präteritum (prétérit)",
    summary: "Temps du récit écrit ; usage oral courant seulement pour sein, haben et les modaux (war, hatte, konnte…).",
    sections: [
      {
        heading: "Conjugaison",
        table: {
          head: ["Personne", "sein", "haben", "machen (faible)", "gehen (fort)"],
          rows: [
            ["ich", "war", "hatte", "machte", "ging"],
            ["du", "warst", "hattest", "machtest", "gingst"],
            ["er / sie / es", "war", "hatte", "machte", "ging"],
            ["wir", "waren", "hatten", "machten", "gingen"],
            ["ihr", "wart", "hattet", "machtet", "gingt"],
            ["sie / Sie", "waren", "hatten", "machten", "gingen"]
          ]
        }
      },
      {
        heading: "Verbes forts fréquents et modaux",
        table: {
          head: ["Infinitif", "Präteritum (ich / er)", "Participe II"],
          rows: [
            ["kommen", "kam", "gekommen"],
            ["sehen", "sah", "gesehen"],
            ["schreiben", "schrieb", "geschrieben"],
            ["finden", "fand", "gefunden"],
            ["nehmen", "nahm", "genommen"],
            ["können / müssen / wollen", "konnte / musste / wollte", "gekonnt / gemusst / gewollt"],
            ["sollen / dürfen / mögen", "sollte / durfte / mochte", "gesollt / gedurft / gemocht"]
          ]
        }
      },
      {
        heading: "Quand l'employer",
        points: [
          "À l'écrit : récits, romans, articles, comptes rendus.",
          "À l'oral : pour sein, haben et les modaux surtout (Ich war müde, Ich hatte Zeit, Ich musste arbeiten).",
          "Verbes faibles : radical + -te (-ete après d / t) : arbeitete, redete.",
          "Les formes er / sie / es et ich sont identiques."
        ]
      }
    ],
    examples: [
      { target: "Gestern war ich sehr müde.", translation: "Hier, j'étais très fatigué.", note: "war : prétérit de sein, très courant à l'oral." },
      { target: "Er hatte keine Zeit.", translation: "Il n'avait pas le temps.", note: "hatte : prétérit de haben." },
      { target: "Ich musste früh aufstehen.", translation: "Je devais me lever tôt.", note: "Modal au prétérit : musste." },
      { target: "Sie kam, sah und siegte.", translation: "Elle vint, vit et vainquit.", note: "Verbes forts : kam, sah." }
    ],
    pitfalls: [
      "Ajouter -te à un verbe fort : on dit ging, pas gehte.",
      "Mettre une terminaison à ich et er : au Präteritum, ich et er sont identiques (ich ging, er ging).",
      "Utiliser le Präteritum à l'oral pour tous les verbes : en conversation, préférez le Perfekt (sauf sein, haben, modaux).",
      "Confondre le prétérit du modal (musste) et son participe (gemusst)."
    ],
    skills: ["perfekt"]
  },
  {
    id: "de-r-futur", level: "A2", group: "Verbes et temps", order: 19,
    title: "Le futur",
    summary: "werden + infinitif en fin de phrase pour le futur ou la supposition ; mais le présent + un repère de temps suffit souvent.",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Personne", "werden", "Exemple"],
          rows: [
            ["ich", "werde", "Ich werde kommen."],
            ["du", "wirst", "Du wirst kommen."],
            ["er / sie / es", "wird", "Er wird kommen."],
            ["wir", "werden", "Wir werden kommen."],
            ["ihr", "werdet", "Ihr werdet kommen."],
            ["sie / Sie", "werden", "Sie werden kommen."]
          ]
        }
      },
      {
        heading: "Usages",
        points: [
          "Futur prévu : Ich werde im Sommer nach Wien fahren.",
          "Présent avec un repère de temps (plus courant à l'oral) : Morgen fahre ich nach Wien.",
          "Supposition sur le présent : Er wird wohl krank sein (il est probablement malade).",
          "Promesse ou menace : Du wirst sehen!"
        ]
      },
      {
        heading: "Ne pas confondre",
        text: "werden = devenir (Er wird Arzt), auxiliaire du futur (Er wird kommen) et auxiliaire du passif (Er wird untersucht). Le contexte tranche : le futur est suivi d'un infinitif, le passif d'un participe II."
      }
    ],
    examples: [
      { target: "Morgen werde ich lange schlafen.", translation: "Demain je dormirai longtemps.", note: "werden en 2e position, infinitif à la fin." },
      { target: "Nächste Woche fahren wir nach Hamburg.", translation: "La semaine prochaine, nous allons à Hambourg.", note: "Le présent avec nächste Woche exprime le futur." },
      { target: "Sie wird wohl noch im Büro sein.", translation: "Elle est sans doute encore au bureau.", note: "werden + wohl = supposition." }
    ],
    pitfalls: [
      "Utiliser werden pour tous les futurs : le présent avec un adverbe de temps est plus naturel à l'oral.",
      "Mettre l'infinitif juste après werden : il va à la fin de la phrase.",
      "Confondre Ich werde Arzt (je deviens médecin) et Ich werde kommen (je viendrai)."
    ],
    skills: ["present-tense"]
  },
  {
    id: "de-r-konjunktiv-2", level: "B1", group: "Verbes et temps", order: 20,
    title: "Le Konjunktiv II (hypothèse et politesse)",
    summary: "Pour l'irréel, le souhait et la politesse : würde + infinitif, ou hätte, wäre, könnte, müsste ; passé : hätte / wäre + participe II.",
    sections: [
      {
        heading: "Formes courantes",
        table: {
          head: ["Personne", "sein", "haben", "werden", "können"],
          rows: [
            ["ich", "wäre", "hätte", "würde", "könnte"],
            ["du", "wärst", "hättest", "würdest", "könntest"],
            ["er / sie / es", "wäre", "hätte", "würde", "könnte"],
            ["wir", "wären", "hätten", "würden", "könnten"],
            ["ihr", "wärt", "hättet", "würdet", "könntet"],
            ["sie / Sie", "wären", "hätten", "würden", "könnten"]
          ]
        }
      },
      {
        heading: "Les emplois",
        points: [
          "Hypothèse irréelle (présent) : Wenn ich Zeit hätte, würde ich mehr lesen.",
          "Hypothèse irréelle (passé) : Wenn ich das gewusst hätte, wäre ich gekommen. (hätte / wäre + participe II)",
          "Politesse : Könnten Sie mir helfen ? Ich hätte gern einen Kaffee. Würden Sie bitte warten ?",
          "Souhait : Ich wäre gern Ärztin. Wenn ich nur reich wäre !",
          "Conseil : Du solltest mehr schlafen. An deiner Stelle würde ich zum Arzt gehen."
        ]
      },
      {
        heading: "Construction",
        text: "Avec les verbes courants (sein, haben, modaux, wissen, kommen, gehen, geben), on utilise la forme propre : ich wäre, hätte, könnte, müsste, käme, ginge. Avec les autres verbes, on emploie würde + infinitif : Ich würde arbeiten. Les modaux aussi : Ich müsste gehen, Ich dürfte nicht rauchen. Dans la proposition en wenn, le verbe conjugué est en fin de proposition."
      }
    ],
    examples: [
      { target: "Wenn ich Zeit hätte, würde ich mehr lesen.", translation: "Si j'avais le temps, je lirais davantage.", note: "hätte dans la subordonnée, würde + infinitif dans la principale." },
      { target: "Könnten Sie mir bitte helfen?", translation: "Pourriez-vous m'aider, s'il vous plaît ?", note: "könnten : politesse." },
      { target: "Wenn er gekommen wäre, hätten wir gefeiert.", translation: "S'il était venu, nous aurions fait la fête.", note: "Passé : wäre / hätte + participe II." },
      { target: "Ich hätte gern einen Termin.", translation: "J'aimerais un rendez-vous.", note: "hätte gern : formule de politesse courante." }
    ],
    pitfalls: [
      "Utiliser würde dans la subordonnée en wenn : on dit Wenn ich Zeit hätte, pas Wenn ich Zeit haben würde (réservé à l'oral relâché).",
      "Utiliser l'indicatif pour une demande polie : Kannst du mir helfen ? est plus direct que Könntest du mir helfen ?",
      "Oublier hätte / wäre + participe II pour le passé : Wenn ich das gewusst hätte, wäre ich gekommen (et non Wenn ich das wüsste, ...).",
      "Ajouter un tréma à tous les verbes : la forme propre n'existe que pour quelques verbes fréquents."
    ],
    skills: ["konjunktiv-2", "konjunktiv-1"]
  },
  {
    id: "de-r-passif", level: "B1", group: "Verbes et temps", order: 21,
    title: "Le passif",
    summary: "werden + participe II (Vorgangspassiv) pour l'action ; sein + participe II pour le résultat ; l'agent s'exprime avec von + datif.",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Temps", "Règle", "Exemple"],
          rows: [
            ["présent", "werden + participe II", "Der Patient wird untersucht."],
            ["Präteritum", "wurde + participe II", "Der Patient wurde untersucht."],
            ["Perfekt", "sein + participe II + worden", "Der Patient ist untersucht worden."],
            ["avec modal", "modal + participe II + werden", "Der Patient muss untersucht werden."],
            ["état résultant (Zustandspassiv)", "sein + participe II", "Die Praxis ist geschlossen."]
          ]
        }
      },
      {
        heading: "Agent et moyen",
        points: [
          "Agent (personne) : von + datif : Das Medikament wird von dem Arzt verschrieben.",
          "Moyen, cause : durch + accusatif : Die Krankheit wird durch Viren verursacht.",
          "L'agent est facultatif : Hier wird Deutsch gesprochen.",
          "Le sujet actif devient l'agent, l'objet direct devient sujet : Der Arzt untersucht den Patienten -> Der Patient wird (vom Arzt) untersucht."
        ]
      },
      {
        heading: "Attention",
        text: "Le participe II de werden au passif est worden (et non geworden) : Er ist untersucht worden. Les verbes à datif conservent le datif au passif : Dem Patienten wird geholfen. Avec es : Es wird getanzt (on danse)."
      }
    ],
    examples: [
      { target: "Das Medikament wird dreimal täglich genommen.", translation: "Le médicament est pris trois fois par jour.", note: "wird + participe II." },
      { target: "Der Patient wurde gestern operiert.", translation: "Le patient a été opéré hier.", note: "Passif au Präteritum : wurde + participe II." },
      { target: "Das Formular muss ausgefüllt werden.", translation: "Le formulaire doit être rempli.", note: "Modal + participe II + werden." },
      { target: "Die Tür ist geschlossen.", translation: "La porte est fermée.", note: "Zustandspassiv : résultat, avec sein." }
    ],
    pitfalls: [
      "Confondre werden (passif) et sein (état) : Die Tür wird geschlossen (on la ferme) / Die Tür ist geschlossen (elle est fermée).",
      "Écrire geworden au Perfekt passif : on dit worden.",
      "Utiliser von pour un moyen : on dit durch pour la cause ou l'instrument, von pour la personne.",
      "Oublier que le « on » français se traduit souvent par man ou par un passif allemand : On parle allemand ici = Man spricht hier Deutsch = Hier wird Deutsch gesprochen."
    ],
    skills: ["passive-voice"]
  },

  // ---------------------------------------------------------------- Ordre des mots
  {
    id: "de-r-ordre-mots-v2-question", level: "A1", group: "Ordre des mots", order: 22,
    title: "Ordre des mots : verbe en 2e position et questions",
    summary: "Dans une principale, le verbe conjugué est toujours en 2e position (une seule unité devant lui) ; dans une question oui / non il est en 1re position.",
    sections: [
      {
        heading: "Verbe en 2e position",
        table: {
          head: ["Position 1", "Position 2 (verbe)", "Suite"],
          rows: [
            ["Ich", "gehe", "heute ins Kino."],
            ["Heute", "gehe", "ich ins Kino."],
            ["Ins Kino", "gehe", "ich heute."],
            ["Morgen Abend", "fahren", "wir nach Wien."]
          ]
        }
      },
      {
        heading: "Les questions",
        table: {
          head: ["Type", "Ordre", "Exemple"],
          rows: [
            ["question en W-", "mot interrogatif + verbe + sujet", "Wann kommst du?"],
            ["question oui / non", "verbe + sujet", "Kommst du heute?"],
            ["demande polie", "verbe modal + sujet + ... + infinitif", "Können Sie mir helfen?"],
            ["impératif", "verbe en 1re position", "Komm bitte schnell!"]
          ]
        }
      },
      {
        heading: "Le mélange classique : TeKaMoLo",
        text: "Dans le « milieu » de la phrase, l'ordre des indications est : Temps, Cause, Manière, Lieu (TeKaMoLo). Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin. Le sujet pronom précède les autres éléments ; l'objet pronom précède l'objet nom."
      },
      {
        heading: "Conjonctions de coordination",
        text: "und, oder, aber, denn, sondern sont « hors phrase » : elles n'influencent pas l'ordre. Ich bleibe zu Hause, denn ich bin krank. En revanche deshalb, dann, trotzdem, darum comptent comme position 1 : Ich bin krank, deshalb bleibe ich zu Hause."
      }
    ],
    examples: [
      { target: "Heute gehe ich ins Kino.", translation: "Aujourd'hui, je vais au cinéma.", note: "Heute en position 1 : le verbe reste 2e, le sujet passe après." },
      { target: "Wann kommst du?", translation: "Quand viens-tu ?", note: "Question en W- : mot interrogatif, verbe, sujet." },
      { target: "Ich fahre morgen mit dem Zug nach Hamburg.", translation: "Je vais demain à Hambourg en train.", note: "Temps (morgen), manière (mit dem Zug), lieu (nach Hamburg)." },
      { target: "Er ist krank, deshalb bleibt er zu Hause.", translation: "Il est malade, c'est pourquoi il reste à la maison.", note: "deshalb en position 1 : inversion." }
    ],
    pitfalls: [
      "Écrire « Heute ich gehe » : après un élément en tête, le verbe reste 2e et le sujet suit.",
      "Placer le verbe à la fin dans une principale : seul le second élément du verbe (infinitif, participe, particule) part à la fin.",
      "Garder l'ordre du français dans la question : Wann du kommst est faux, il faut Wann kommst du?",
      "Croire que denn ou aber inversent : ils sont hors position."
    ],
    skills: ["verb-second", "sentence-building"]
  },
  {
    id: "de-r-subordonnee-verbe-final", level: "A2", group: "Ordre des mots", order: 23,
    title: "La subordonnée : verbe conjugué en fin de proposition",
    summary: "Après weil, dass, wenn, ob, obwohl, als, damit, bevor, nachdem, le verbe conjugué part en fin de proposition.",
    sections: [
      {
        heading: "Les conjonctions de subordination",
        table: {
          head: ["Conjonction", "Sens", "Exemple"],
          rows: [
            ["weil / da", "parce que", "..., weil ich krank bin."],
            ["dass", "que", "Ich weiß, dass er kommt."],
            ["wenn", "si, quand (répété)", "Wenn ich Zeit habe, lese ich."],
            ["ob", "si (interrogation)", "Ich frage, ob er kommt."],
            ["obwohl", "bien que", "..., obwohl es regnet."],
            ["als", "quand (passé, une fois)", "Als ich jung war, ..."],
            ["damit", "afin que", "Ich erkläre es, damit du es verstehst."],
            ["bevor / nachdem / während / bis", "avant que / après que / pendant que / jusqu'à ce que", "Nachdem er gegessen hatte, ..."]
          ]
        }
      },
      {
        heading: "Règle",
        points: [
          "Le verbe conjugué est rejeté à la fin de la subordonnée : Ich bleibe zu Hause, weil ich krank bin.",
          "Au Perfekt, l'auxiliaire est en tout dernier : ..., weil ich gestern nicht gekommen bin.",
          "Avec modal : le modal est en dernier : ..., weil ich arbeiten muss.",
          "Séparable : la particule se recolle : ..., weil er früh aufsteht.",
          "Une virgule sépare toujours la principale de la subordonnée."
        ]
      },
      {
        heading: "Subordonnée en tête de phrase",
        text: "Si la subordonnée ouvre la phrase, elle compte comme position 1 : le verbe de la principale vient immédiatement après la virgule. Weil ich krank bin, bleibe ich zu Hause."
      }
    ],
    examples: [
      { target: "Ich bleibe zu Hause, weil ich krank bin.", translation: "Je reste à la maison parce que je suis malade.", note: "weil : verbe conjugué à la fin." },
      { target: "Weil es regnet, nehme ich einen Schirm.", translation: "Comme il pleut, je prends un parapluie.", note: "Subordonnée en tête : verbe de la principale juste après la virgule." },
      { target: "Er sagt, dass er keine Zeit hat.", translation: "Il dit qu'il n'a pas le temps.", note: "dass : verbe en fin." },
      { target: "Ich weiß nicht, ob er morgen kommt.", translation: "Je ne sais pas s'il vient demain.", note: "ob pour l'interrogation indirecte." }
    ],
    pitfalls: [
      "Garder l'ordre principal après weil : Ich bleibe, weil ich bin krank est faux.",
      "Oublier la virgule avant la subordonnée.",
      "Oublier l'inversion dans la principale quand la subordonnée vient en premier : Weil es regnet, bleibe ich (pas ich bleibe).",
      "Confondre wenn et als : als pour un fait passé unique, wenn pour le présent, le futur ou les répétitions."
    ],
    skills: ["subordinate-clauses"]
  },
  {
    id: "de-r-negation", level: "A1", group: "Ordre des mots", order: 24,
    title: "La négation : nicht et kein",
    summary: "kein remplace ein ou l'absence d'article devant un nom ; nicht sert pour tout le reste (verbe, adjectif, nom défini).",
    sections: [
      {
        heading: "kein ou nicht ?",
        table: {
          head: ["Cas", "Négation", "Exemple"],
          rows: [
            ["nom avec ein, ou sans article", "kein", "Ich habe kein Auto. Ich habe keine Zeit."],
            ["nom avec article défini ou possessif", "nicht", "Ich kenne den Arzt nicht. Das ist nicht mein Auto."],
            ["verbe", "nicht (en fin de phrase)", "Ich arbeite nicht."],
            ["adjectif ou adverbe", "nicht devant", "Er ist nicht müde."],
            ["groupe prépositionnel", "nicht devant", "Wir fahren nicht nach Berlin."]
          ]
        }
      },
      {
        heading: "Déclinaison de kein",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["nominatif", "kein", "keine", "kein", "keine"],
            ["accusatif", "keinen", "keine", "kein", "keine"],
            ["datif", "keinem", "keiner", "keinem", "keinen"],
            ["génitif", "keines", "keiner", "keines", "keiner"]
          ]
        }
      },
      {
        heading: "Place de nicht et locutions",
        points: [
          "Nicht porte sur toute la phrase : il se place en fin de phrase (avant l'infinitif ou le participe en fin) : Ich verstehe das nicht. Ich habe das nicht verstanden.",
          "Nicht porte sur un élément : il le précède : Ich fahre nicht heute, sondern morgen.",
          "noch nicht (pas encore), nicht mehr / kein ... mehr (ne ... plus) : Er arbeitet nicht mehr. Ich habe keine Zeit mehr.",
          "nicht nur ... sondern auch (non seulement ... mais aussi) ; nicht ... sondern (mais).",
          "Réponse à une question négative : doch (si) pour contredire : Hast du kein Auto ? Doch, ich habe eins."
        ]
      }
    ],
    examples: [
      { target: "Ich habe keine Zeit.", translation: "Je n'ai pas le temps.", note: "Zeit sans article défini : keine." },
      { target: "Er kommt heute nicht.", translation: "Il ne vient pas aujourd'hui.", note: "nicht en fin de phrase, avant un élément de manière ou de lieu éventuel." },
      { target: "Das ist nicht mein Auto.", translation: "Ce n'est pas ma voiture.", note: "Possessif : nicht, pas kein." },
      { target: "Sie arbeitet nicht mehr hier.", translation: "Elle ne travaille plus ici.", note: "nicht mehr = ne ... plus." }
    ],
    pitfalls: [
      "Utiliser nicht devant un nom indéfini : Ich habe nicht ein Auto est faux, on dit Ich habe kein Auto.",
      "Utiliser kein devant un nom défini : Ich sehe kein den Arzt est faux, on dit Ich sehe den Arzt nicht.",
      "Oublier la terminaison de kein : keinen devant un masculin accusatif (Ich habe keinen Hunger).",
      "Répondre « ja » à une question négative pour contredire : il faut doch."
    ],
    skills: ["accusative", "sentence-building"]
  },
  {
    id: "de-r-relatives", level: "B1", group: "Ordre des mots", order: 25,
    title: "Les propositions relatives",
    summary: "Le pronom relatif prend le genre et le nombre de son antécédent mais le cas de sa fonction dans la relative ; le verbe va en fin de proposition.",
    sections: [
      {
        heading: "Les pronoms relatifs",
        table: {
          head: ["", "masculin", "féminin", "neutre", "pluriel"],
          rows: [
            ["nominatif", "der", "die", "das", "die"],
            ["accusatif", "den", "die", "das", "die"],
            ["datif", "dem", "der", "dem", "denen"],
            ["génitif", "dessen", "deren", "dessen", "deren"]
          ]
        }
      },
      {
        heading: "Fonctionnement",
        points: [
          "Genre et nombre = ceux de l'antécédent ; cas = fonction dans la relative (sujet, objet, datif, préposition).",
          "Virgule avant et après la relative ; le verbe conjugué est à la fin : Der Arzt, den ich gestern gesehen habe, ist nett.",
          "Avec préposition : la préposition précède le pronom : Der Arzt, mit dem ich spreche, ist nett.",
          "was après alles, nichts, etwas, das ; wo pour un lieu : Alles, was du sagst, ist richtig. Die Stadt, wo ich wohne."
        ]
      },
      {
        heading: "Méthode pas à pas",
        text: "1. Cherchez l'antécédent (Arzt, masculin singulier). 2. Cherchez la fonction du pronom dans la relative (objet direct = accusatif). 3. Prenez la forme correspondante : masculin + accusatif = den. Der Arzt, den ich kenne."
      }
    ],
    examples: [
      { target: "Der Mann, der dort steht, ist Arzt.", translation: "L'homme qui est là-bas est médecin.", note: "Masculin, sujet de la relative : der." },
      { target: "Die Frau, die ich gesehen habe, ist meine Nachbarin.", translation: "La femme que j'ai vue est ma voisine.", note: "Féminin, objet direct : die." },
      { target: "Das Kind, dem ich geholfen habe, ist gesund.", translation: "L'enfant que j'ai aidé est en bonne santé.", note: "helfen + datif : dem." },
      { target: "Der Patient, dessen Akte fehlt, wartet.", translation: "Le patient dont le dossier manque attend.", note: "Génitif : dessen." }
    ],
    pitfalls: [
      "Choisir le pronom d'après le cas de la principale : c'est le cas dans la relative qui compte.",
      "Oublier la virgule de chaque côté de la relative.",
      "Employer le verbe en 2e position : dans la relative, il part à la fin.",
      "Confondre dessen / deren avec le possessif : après le relatif génitif, il n'y a pas d'article (dessen Akte, pas dessen die Akte)."
    ],
    skills: ["relative-clauses"]
  },
  {
    id: "de-r-infinitif-zu-um-zu", level: "B1", group: "Ordre des mots", order: 26,
    title: "L'infinitif avec zu et um ... zu",
    summary: "zu + infinitif complète certains verbes et expressions (Lust haben, versuchen) ; um ... zu exprime le but ; sans zu après un modal.",
    sections: [
      {
        heading: "Quand utiliser zu",
        table: {
          head: ["Construction", "Exemple"],
          rows: [
            ["verbe + zu + infinitif", "Ich versuche, früh aufzustehen."],
            ["Lust / Zeit / Angst / Absicht haben zu", "Ich habe keine Lust, heute zu arbeiten."],
            ["es ist + adjectif + zu", "Es ist wichtig, viel Wasser zu trinken."],
            ["anfangen / aufhören / vergessen / beginnen + zu", "Er hat vergessen, mich anzurufen."],
            ["um ... zu (but)", "Ich lerne Deutsch, um in Wien zu arbeiten."],
            ["ohne ... zu / (an)statt ... zu", "Er geht, ohne zu grüßen."]
          ]
        }
      },
      {
        heading: "Place de zu",
        points: [
          "Verbe simple : zu devant l'infinitif : zu arbeiten, zu lesen.",
          "Verbe séparable : zu entre la particule et le verbe, écrit en un mot : aufzustehen, anzurufen, einzukaufen.",
          "Une virgule précède souvent la proposition infinitive (obligatoire avec um, ohne, (an)statt, außer, als, ou quand l'infinitif dépend d'un nom ou est annoncé par un mot comme es ou darauf ; facultative dans les autres cas)."
        ]
      },
      {
        heading: "Sans zu",
        text: "Pas de zu après les verbes modaux (können, müssen, wollen, sollen, dürfen, möchten), werden, lassen, et après les verbes de perception (sehen, hören) ou de mouvement (gehen, fahren, bleiben) : Ich gehe einkaufen. Er lässt mich warten."
      },
      {
        heading: "um ... zu ou damit",
        text: "Quand le sujet est le même, on utilise um ... zu : Ich lerne, um besser zu verstehen. Quand les sujets diffèrent, on utilise damit : Ich erkläre es, damit du es verstehst."
      }
    ],
    examples: [
      { target: "Ich habe keine Zeit, heute einzukaufen.", translation: "Je n'ai pas le temps de faire les courses aujourd'hui.", note: "ein-kaufen : zu s'insère : einzukaufen." },
      { target: "Er lernt Deutsch, um in Wien zu arbeiten.", translation: "Il apprend l'allemand pour travailler à Vienne.", note: "um ... zu : but, même sujet." },
      { target: "Es ist wichtig, genug zu schlafen.", translation: "Il est important de dormir assez.", note: "es ist + adjectif + zu." },
      { target: "Sie ging, ohne ein Wort zu sagen.", translation: "Elle est partie sans dire un mot.", note: "ohne ... zu = sans + infinitif." }
    ],
    pitfalls: [
      "Ajouter zu après un modal : Ich kann zu schwimmen est faux.",
      "Oublier de souder zu au verbe séparable : aufzustehen (pas zu aufstehen).",
      "Utiliser um ... zu avec un sujet différent : il faut damit + subordonnée.",
      "Traduire « pour » par für + infinitif : pour exprimer le but avec un verbe, on utilise um ... zu."
    ],
    skills: ["subordinate-clauses", "separable-verbs"]
  },

  // ---------------------------------------------------------------- Vocabulaire
  {
    id: "de-r-formation-mots", level: "A2", group: "Vocabulaire", order: 27,
    title: "Mots composés et formation des mots",
    summary: "L'allemand colle des mots (Krankenhaus) : le dernier élément donne le genre et le sens de base ; préfixes et suffixes transforment la classe du mot.",
    sections: [
      {
        heading: "Les mots composés",
        points: [
          "Le dernier élément détermine le genre : die Hand + der Schuh = der Handschuh ; das Zimmer + die Tür = die Zimmertür.",
          "Entre deux éléments, on trouve parfois une lettre de liaison (Fugenlaut) : Arbeitszeit, Geburtstag, Krankenhaus, Blutdruck (sans lettre).",
          "Médical : Herz-Kreislauf-Erkrankung, Blutdruckmessgerät, Röntgenbild, Impfstoff, Nebenwirkung.",
          "Pour comprendre un mot long, découpez-le de droite à gauche : Krankenversicherungskarte = carte (Karte) d'assurance (Versicherung) maladie (Kranken)."
        ]
      },
      {
        heading: "Suffixes nominaux",
        table: {
          head: ["Suffixe", "Genre", "Sens", "Exemples"],
          rows: [
            ["-ung", "die", "action, résultat (verbe -> nom)", "behandeln -> die Behandlung"],
            ["-heit / -keit", "die", "qualité (adjectif -> nom)", "gesund -> die Gesundheit ; möglich -> die Möglichkeit"],
            ["-schaft", "die", "ensemble, relation", "die Freundschaft, die Gesellschaft"],
            ["-er", "der", "personne qui fait", "lehren -> der Lehrer"],
            ["-in", "die", "féminin d'un métier", "der Arzt -> die Ärztin"],
            ["-chen / -lein", "das", "diminutif", "das Mädchen, das Kindlein"],
            ["-nis", "das (parfois die)", "résultat", "das Ergebnis, das Gefängnis"]
          ]
        }
      },
      {
        heading: "Préfixes et suffixes adjectivaux",
        table: {
          head: ["Élément", "Effet", "Exemples"],
          rows: [
            ["un-", "contraire", "möglich -> unmöglich ; glücklich -> unglücklich"],
            ["miss-", "faux, mauvais", "das Missverständnis"],
            ["-lich / -ig / -isch", "adjectif", "ärztlich, ruhig, typisch"],
            ["-bar", "qu'on peut", "essbar, machbar"],
            ["-los / -voll", "sans / plein de", "schmerzlos, schmerzvoll, sorglos"],
            ["verbes : be-, ver-, ent-, er-", "changent le sens du verbe", "bekommen, verstehen, entdecken, erklären"]
          ]
        }
      }
    ],
    examples: [
      { target: "das Krankenhaus", translation: "l'hôpital", note: "Kranke(n) + Haus ; genre du dernier élément : das." },
      { target: "die Behandlung -> behandeln", translation: "le traitement -> traiter", note: "-ung transforme un verbe en nom féminin." },
      { target: "die Gesundheit", translation: "la santé", note: "gesund + -heit : nom féminin." },
      { target: "unmöglich", translation: "impossible", note: "un- renverse le sens de möglich." }
    ],
    pitfalls: [
      "Se tromper de genre : un composé prend toujours le genre de son dernier élément.",
      "Couper un mot composé : on l'écrit en un seul mot (Blutdruck, pas Blut Druck).",
      "Oublier la lettre de liaison : Arbeitszeit, Geburtstag, Krankenhaus.",
      "Confondre -heit et -keit : -keit s'emploie après -ig, -lich, -bar, -sam (Möglichkeit, Fähigkeit)."
    ],
    skills: ["articles-gender", "health-vocabulary"]
  },
  {
    id: "de-r-faux-amis", level: "B1", group: "Vocabulaire", order: 28,
    title: "Faux amis français-allemand",
    summary: "Certains mots ressemblent au français mais ont un autre sens : das Gift, bekommen, also, die Dose, das Rezept, die Praxis.",
    sections: [
      {
        heading: "Les pièges les plus fréquents",
        table: {
          head: ["Mot allemand", "Sens réel", "Ne signifie pas"],
          rows: [
            ["das Gift", "poison (pour un cadeau : das Geschenk)", "cadeau"],
            ["bekommen", "recevoir, obtenir (devenir : werden)", "devenir"],
            ["also", "donc, alors (aussi : auch)", "aussi"],
            ["bald", "bientôt", "bal (Ball)"],
            ["fast", "presque (rapide : schnell)", "rapide"],
            ["der Rock", "jupe", "rock (Rockmusik)"],
            ["die Dose", "boîte, canette (dose : die Dosis)", "dose de médicament"],
            ["das Rezept", "ordonnance ou recette", "reçu"],
            ["die Praxis", "cabinet médical (ou pratique)", "pratique seulement"],
            ["die Rente", "pension de retraite", "rente"],
            ["der Chef", "patron, supérieur", "chef cuisinier (der Koch)"],
            ["das Gymnasium", "le lycée (voie générale)", "pas un gymnase : la salle de sport se dit die Turnhalle"]
          ]
        }
      },
      {
        heading: "Pièges médicaux",
        points: [
          "die Medizin : la médecine (science) ; le médicament se dit das Medikament ou das Arzneimittel.",
          "die Praxis : le cabinet d'un médecin ; die Klinik, das Krankenhaus : l'hôpital.",
          "die Diät : le régime alimentaire thérapeutique ; die Dosis : la dose d'un médicament.",
          "der Patient : le patient ; der Pate : le parrain (ne pas confondre)."
        ]
      },
      {
        heading: "Méthode",
        text: "Quand un mot allemand vous semble transparent, vérifiez-le dans un contexte. Notez les faux amis rencontrés dans vos lectures : ils s'oublient peu une fois repérés."
      }
    ],
    examples: [
      { target: "Ich bekomme morgen ein Rezept.", translation: "Je recevrai demain une ordonnance.", note: "bekommen = recevoir, pas devenir." },
      { target: "Das ist ein schönes Geschenk.", translation: "C'est un beau cadeau.", note: "Pour « cadeau », on dit Geschenk, jamais Gift." },
      { target: "Die Praxis öffnet um acht Uhr.", translation: "Le cabinet ouvre à huit heures.", note: "Praxis = cabinet médical." },
      { target: "Er ist mein Chef.", translation: "C'est mon patron.", note: "Chef est le supérieur hiérarchique, pas le cuisinier." }
    ],
    pitfalls: [
      "Lire also comme « aussi » : il signifie « donc » ; « aussi » se dit auch.",
      "Dire bekommen pour « devenir » : on dit werden (Er wird Arzt).",
      "Offrir un Gift : c'est un poison ! Un cadeau se dit Geschenk.",
      "Traduire « fast » par rapide : « presque » en allemand, « rapide » se dit schnell."
    ],
    skills: ["everyday-vocabulary", "health-vocabulary"]
  }
];

export const DE_RULES: GrammarRule[] = RAW_DE_RULES.map((rule) => ({ ...rule, language: "de" as const }));
