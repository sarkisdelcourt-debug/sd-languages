import type { GrammarRule } from "../grammar-rules.js";

/**
 * Fiches de règles d'espagnol (24/10/2026) : parcours « je pars de zéro » (fiches 1 à 8), puis grammaire, accords,
 * pronoms, temps, prépositions et formation du vocabulaire. RÈGLE D'OR : l'`id` d'une fiche ne change jamais.
 */
type EsRule = Omit<GrammarRule, "language">;

const RULES: EsRule[] = [
  {
    id: "es-r-alphabet-prononciation",
    level: "A1",
    group: "Premiers pas",
    order: 1,
    title: "Alphabet et prononciation",
    summary: "L'espagnol se prononce comme il s'écrit : chaque lettre a un son stable, avec quelques pièges (j, h, ll, ñ, b/v, c/z, qu/gu).",
    sections: [
      {
        heading: "Les voyelles et le principe général",
        text: "Il y a 5 voyelles pures, toujours prononcées de la même façon : a, e (é), i, o, u (ou). Il n'y a ni voyelle nasale ni « eu » : on prononce chaque lettre. Un mot s'écrit comme il se dit."
      },
      {
        heading: "Les lettres qui demandent de l'attention",
        table: {
          head: ["Lettre", "Son", "Exemple"],
          rows: [
            ["j (jota)", "son rauque, comme le « ch » allemand de Bach", "jamón, trabajo"],
            ["g + e / i", "même son que j", "gente, gimnasio"],
            ["g + a / o / u", "comme « g » de gare", "gato, goma, gusto"],
            ["gu + e / i", "« g » dur : le u ne se prononce pas", "guerra, guitarra"],
            ["gü + e / i", "le u se prononce (tréma)", "pingüino, vergüenza"],
            ["h", "toujours muette", "hola, hospital, ahora"],
            ["ll", "proche de « y » (ou « ill » de fille)", "calle, llamar"],
            ["ñ (eñe)", "comme « gn » de montagne", "España, año, mañana"],
            ["b et v", "même son : b franc en début de phrase et après m/n (vino, un beso), plus doux entre voyelles", "vaca et baca se disent pareil"],
            ["c + e / i", "« th » anglais (Espagne) ou « s » (Amérique, sud de l'Espagne)", "cena, gracias"],
            ["z", "même son que c + e / i", "zapato, lápiz"],
            ["c + a / o / u", "comme « k »", "casa, cosa, cuando"],
            ["qu + e / i", "comme « k » : le u est muet", "queso, quince"],
            ["ch", "comme « tch »", "mucho, chico"],
            ["r / rr", "r entre voyelles : un seul battement de langue (pero) ; rr, r en début de mot ou après n/l/s : roulé fort (perro, rojo, Enrique)", "pero (doux) / perro (fort), rojo"],
            ["y", "comme « y » de yeux ; seul, y = « i » (et)", "yo, y"]
          ]
        }
      },
      {
        heading: "Alphabet",
        text: "27 lettres : a, be, ce, de, e, efe, ge, hache, i, jota, ka, ele, eme, ene, eñe, o, pe, cu, erre, ese, te, u, uve, uve doble, equis, ye, zeta. Pour épeler votre nom, apprenez les noms des lettres."
      }
    ],
    examples: [
      { target: "El niño come jamón en España.", translation: "L'enfant mange du jambon en Espagne.", note: "ñ = gn, j = son rauque, h absente." },
      { target: "Hola, me llamo Hugo.", translation: "Bonjour, je m'appelle Hugo.", note: "Les deux h sont muets ; ll = y." },
      { target: "Quiero queso y guitarra, gracias.", translation: "Je veux du fromage et une guitare, merci.", note: "qu et gu devant e/i : le u est muet ; c devant i = th/s." }
    ],
    pitfalls: [
      "Prononcer le h comme en anglais : il est toujours muet (hospital se dit « ospital »).",
      "Prononcer ge / gi comme en français (« je ») : c'est le son rauque de la jota.",
      "Distinguer b et v : en espagnol c'est le même son.",
      "Prononcer s comme z : le s espagnol est toujours sourd (casa ≠ « caza » à la française) ; x se dit ks (taxi), sauf México où x = j.",
      "Prononcer le u de qu/gu (queso n'est pas « kouéso »)."
    ],
    skills: ["listening", "sentence-building"]
  },
  {
    id: "es-r-accentuation",
    level: "A1",
    group: "Premiers pas",
    order: 2,
    title: "Accentuation et accents écrits",
    summary: "Trois règles simples disent quelle syllabe est accentuée ; l'accent écrit n'apparaît que lorsque la règle n'est pas respectée (ou pour distinguer deux mots).",
    sections: [
      {
        heading: "Où tombe l'accent tonique ?",
        table: {
          head: ["Le mot finit par…", "Accent sur…", "Exemples"],
          rows: [
            ["une voyelle, n ou s", "l'avant-dernière syllabe", "CA-sa, ha-BLAN, LU-nes"],
            ["toute autre consonne", "la dernière syllabe", "ha-BLAR, ciu-DAD, es-pa-ÑOL"]
          ]
        }
      },
      {
        heading: "Quand écrire l'accent ?",
        points: [
          "Quand le mot ne suit pas la règle ci-dessus : café, canción, árbol, lápiz.",
          "Toujours quand l'accent est sur l'antépénultième syllabe : médico, teléfono, síntoma.",
          "Pour casser une diphtongue (hiatus) : día, país, tío, farmacia (sans accent : diphtongue normale).",
          "Les mots interrogatifs et exclamatifs portent toujours l'accent : qué, quién, cómo, dónde, cuándo, cuánto."
        ]
      },
      {
        heading: "Accent diacritique (distingue deux mots)",
        table: {
          head: ["Avec accent", "Sans accent"],
          rows: [
            ["él (il)", "el (le)"],
            ["tú (tu, pronom)", "tu (ton, ta)"],
            ["sí (oui)", "si (si)"],
            ["mí (moi, après préposition)", "mi (mon, ma)"],
            ["sé (je sais ; sois)", "se (pronom)"],
            ["té (thé)", "te (te)"],
            ["más (plus)", "mas (mais, littéraire)"],
            ["qué / cómo / dónde (question)", "que / como / donde (relatif)"]
          ]
        }
      },
      {
        heading: "L'accent bouge avec le pluriel",
        text: "canción → canciones (l'accent disparaît car la règle est respectée), joven → jóvenes (l'accent apparaît), examen → exámenes."
      }
    ],
    examples: [
      { target: "El médico habla con él.", translation: "Le médecin parle avec lui.", note: "médico : accent sur l'antépénultième ; él avec accent = pronom." },
      { target: "¿Dónde está la estación?", translation: "Où est la gare ?", note: "dónde porte l'accent dans la question." },
      { target: "Tú tienes tu libro, sí.", translation: "Toi, tu as ton livre, oui.", note: "tú pronom / tu possessif ; sí = oui." }
    ],
    pitfalls: [
      "Oublier l'accent de qué, cómo, dónde dans les questions (¿Como estás? est faux).",
      "Mettre un accent sur canciones ou sur les mots comme casa : la règle est déjà respectée.",
      "Confondre mi (mon) et mí (moi) : para mí, mais mi casa."
    ],
    skills: ["listening", "sentence-building"]
  },
  {
    id: "es-r-saluer-se-presenter",
    level: "A1",
    group: "Premiers pas",
    order: 3,
    title: "Saluer et se présenter",
    summary: "Quelques formules suffisent pour saluer, remercier et dire qui vous êtes ; choisissez tú (familier) ou usted (poli).",
    sections: [
      {
        heading: "Saluer et prendre congé",
        table: {
          head: ["Espagnol", "Français", "Quand ?"],
          rows: [
            ["Hola", "Salut / Bonjour", "à tout moment, courant"],
            ["Buenos días", "Bonjour", "le matin (jusqu'au déjeuner)"],
            ["Buenas tardes", "Bonjour / Bonsoir", "après le déjeuner, jusqu'au soir"],
            ["Buenas noches", "Bonsoir / Bonne nuit", "le soir et la nuit"],
            ["Adiós", "Au revoir", "général"],
            ["Hasta luego / Hasta mañana", "À tout à l'heure / À demain", "on se reverra"],
            ["Por favor", "S'il vous plaît", "demande"],
            ["Gracias / De nada", "Merci / De rien", "remerciement"],
            ["Perdón / Disculpe", "Pardon / Excusez-moi", "s'excuser, interpeller"]
          ]
        }
      },
      {
        heading: "Se présenter",
        points: [
          "¿Cómo te llamas? (tú) / ¿Cómo se llama usted? : Quel est votre nom ?",
          "Me llamo Ana. Soy Ana. (Je m'appelle Ana.)",
          "Soy de Francia / Soy francés (francesa). Vivo en París.",
          "Soy médico (sans article devant une profession).",
          "Tengo treinta y cinco años. (L'âge se dit avec tener.)",
          "Mucho gusto. / Encantado (homme) / Encantada (femme). (Enchanté.)",
          "¿Cómo estás? / ¿Cómo está usted? — Bien, gracias, ¿y tú?"
        ]
      },
      {
        heading: "Tú ou usted ?",
        text: "Tú s'emploie avec les amis, la famille, les enfants ; usted (avec le verbe à la 3e personne) est la forme polie avec un inconnu, un patient, un supérieur. En cas de doute, commencez par usted."
      }
    ],
    examples: [
      { target: "Buenos días, me llamo Marc y soy médico.", translation: "Bonjour, je m'appelle Marc et je suis médecin.", note: "Pas d'article devant médico." },
      { target: "¿Cómo está usted? — Bien, gracias, ¿y usted?", translation: "Comment allez-vous ? — Bien, merci, et vous ?", note: "Forme polie : usted + 3e personne." },
      { target: "Soy de Lyon, pero vivo en Madrid.", translation: "Je viens de Lyon, mais j'habite à Madrid.", note: "ser de = origine ; vivir en = habiter à." }
    ],
    pitfalls: [
      "Dire « Soy un médico » : sans article pour une profession (sauf adjectif : soy un buen médico).",
      "Dire « Soy 35 años » : l'âge se dit avec tener (tengo 35 años).",
      "Oublier le ¿ et le ¡ d'ouverture."
    ],
    skills: ["introductions", "polite-requests"]
  },
  {
    id: "es-r-nombres-0-100",
    level: "A1",
    group: "Premiers pas",
    order: 4,
    title: "Les nombres de 0 à 100",
    summary: "Les nombres sont réguliers : 0-15 à apprendre, puis 16-29 soudés (dieciséis, veintiuno), puis dizaines + « y » + unité (treinta y uno).",
    sections: [
      {
        heading: "De 0 à 29",
        table: {
          head: ["0-9", "10-19", "20-29"],
          rows: [
            ["0 cero, 1 uno, 2 dos", "10 diez, 11 once, 12 doce", "20 veinte, 21 veintiuno"],
            ["3 tres, 4 cuatro, 5 cinco", "13 trece, 14 catorce, 15 quince", "22 veintidós, 23 veintitrés"],
            ["6 seis, 7 siete, 8 ocho, 9 nueve", "16 dieciséis, 17 diecisiete, 18 dieciocho, 19 diecinueve", "24 veinticuatro, 25 veinticinco, 26 veintiséis, 27 veintisiete, 28 veintiocho, 29 veintinueve"]
          ]
        }
      },
      {
        heading: "Les dizaines et la centaine",
        table: {
          head: ["Nombre", "Espagnol"],
          rows: [
            ["30", "treinta"],
            ["40", "cuarenta"],
            ["50", "cincuenta"],
            ["60", "sesenta"],
            ["70", "setenta"],
            ["80", "ochenta"],
            ["90", "noventa"],
            ["100", "cien (ciento devant un autre nombre : ciento uno)"]
          ]
        }
      },
      {
        heading: "Règles utiles",
        points: [
          "À partir de 31 : dizaine + y + unité, en trois mots : treinta y uno, cuarenta y cinco, noventa y nueve.",
          "Uno devient un devant un nom masculin (un libro, veintiún años) et una devant un nom féminin (una casa, veintiuna personas).",
          "Pas de « soixante-dix » ni de « quatre-vingt-dix » : 70 setenta, 80 ochenta, 90 noventa.",
          "Les nombres sont invariables, sauf uno/una et les centaines (doscientas casas)."
        ]
      }
    ],
    examples: [
      { target: "Tengo veintiún años.", translation: "J'ai vingt et un ans.", note: "uno → un devant le nom masculin años, soudé avec veinti-." },
      { target: "Mi madre tiene setenta y ocho años.", translation: "Ma mère a soixante-dix-huit ans.", note: "70 = setenta : pas de calcul à la française." },
      { target: "Son las tres y cuarto.", translation: "Il est trois heures et quart.", note: "L'heure se dit avec ser au pluriel (es la una, son las tres)." }
    ],
    pitfalls: [
      "Écrire « treinta-uno » ou « treinta uno » : il faut treinta y uno.",
      "Dire « cien uno » : on dit ciento uno.",
      "Dire « sesenta y diez » pour 70 : le mot est setenta."
    ],
    skills: ["numbers"]
  },
  {
    id: "es-r-articles-genre",
    level: "A1",
    group: "Premiers pas",
    order: 5,
    title: "Articles et genre (el / la / un / una)",
    summary: "Tout nom est masculin ou féminin ; les terminaisons -o et -a donnent un bon indice, mais plusieurs mots ont un genre différent du français.",
    sections: [
      {
        heading: "Les articles",
        table: {
          head: ["", "Masculin sing.", "Féminin sing.", "Masculin plur.", "Féminin plur."],
          rows: [
            ["Défini (le, la, les)", "el", "la", "los", "las"],
            ["Indéfini (un, une, des)", "un", "una", "unos", "unas"]
          ]
        }
      },
      {
        heading: "Deviner le genre",
        table: {
          head: ["Masculin", "Féminin"],
          rows: [
            ["-o : el libro, el médico", "-a : la casa, la médica"],
            ["-or : el dolor, el color", "-ción, -sión : la información, la decisión"],
            ["-aje : el viaje, el mensaje", "-dad, -tad, -tud : la ciudad, la libertad, la actitud"],
            ["-ma (mots grecs) : el problema, el síntoma", "-ie, -umbre : la serie, la costumbre"]
          ]
        }
      },
      {
        heading: "Contractions et emplois",
        points: [
          "a + el = al (voy al médico) ; de + el = del (la casa del médico).",
          "L'article défini se met devant les jours : el lunes (lundi), et pour les généralités : me gusta el café.",
          "Pas d'article devant une profession ou une nationalité après ser : soy médico, es francesa.",
          "Pas d'article devant la langue après hablar : hablo español."
        ]
      },
      {
        heading: "Genre différent du français",
        table: {
          head: ["Espagnol", "Français"],
          rows: [
            ["el dolor (masc.)", "la douleur (fém.)"],
            ["el color (masc.)", "la couleur (fém.)"],
            ["la sangre (fém.)", "le sang (masc.)"],
            ["la leche (fém.)", "le lait (masc.)"],
            ["la sal (fém.)", "le sel (masc.)"],
            ["el análisis (masc.)", "l'analyse (fém.)"]
          ]
        }
      }
    ],
    examples: [
      { target: "El médico y la enfermera trabajan en el hospital.", translation: "Le médecin et l'infirmière travaillent à l'hôpital.", note: "Chaque nom a son article masculin ou féminin." },
      { target: "Tengo un dolor fuerte en la cabeza.", translation: "J'ai une forte douleur à la tête.", note: "dolor est masculin (un dolor), contrairement au français." },
      { target: "Vamos al hospital el lunes.", translation: "Nous allons à l'hôpital lundi.", note: "al = a + el ; el lunes avec article." }
    ],
    pitfalls: [
      "Dire « la dolor » ou « la color » par analogie avec le français.",
      "Dire « el sangre » ou « el leche » : sangre et leche sont féminins (la sangre, la leche).",
      "Mettre un article devant une profession : soy el médico veut dire « je suis LE médecin »."
    ],
    skills: ["articles-gender"]
  },
  {
    id: "es-r-pluriel",
    level: "A1",
    group: "Premiers pas",
    order: 6,
    title: "Le pluriel des noms et des adjectifs",
    summary: "On ajoute -s après une voyelle, -es après une consonne, et -z devient -ces ; l'accent écrit peut apparaître ou disparaître.",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Le mot finit par…", "Pluriel", "Exemples"],
          rows: [
            ["une voyelle non accentuée", "+ s", "casa → casas, libro → libros"],
            ["á, é, ó accentués", "+ s", "café → cafés, sofá → sofás"],
            ["une consonne", "+ es", "ciudad → ciudades, español → españoles"],
            ["-z", "z → ces", "lápiz → lápices, vez → veces"],
            ["-s, mot non accentué sur la dernière syllabe", "invariable", "el lunes → los lunes, la crisis → las crisis"],
            ["-í, -ú accentué", "+ es (ou +s)", "iraní → iraníes, tabú → tabúes"]
          ]
        }
      },
      {
        heading: "L'accent écrit change",
        points: [
          "canción → canciones, jardín → jardines (l'accent disparaît).",
          "joven → jóvenes, examen → exámenes, origen → orígenes (l'accent apparaît).",
          "La syllabe accentuée ne change pas de place : lápiz → lápices garde l'accent (comme árbol → árboles)."
        ]
      },
      {
        heading: "Pluriel du groupe nominal",
        text: "L'article, le nom et l'adjectif se mettent tous au pluriel : los libros nuevos, las casas grandes. Un groupe mixte prend le masculin : los hijos (les fils ou les enfants), los padres (les parents), los médicos (médecins hommes et femmes)."
      }
    ],
    examples: [
      { target: "Las ciudades españolas son muy bonitas.", translation: "Les villes espagnoles sont très jolies.", note: "ciudad → ciudades ; article, nom et adjectif au pluriel." },
      { target: "Dos lápices y tres canciones.", translation: "Deux crayons et trois chansons.", note: "lápiz → lápices ; canción → canciones, sans accent." },
      { target: "Mis padres trabajan los sábados.", translation: "Mes parents travaillent le samedi.", note: "sábado → los sábados ; padres = père et mère." }
    ],
    pitfalls: [
      "Écrire « lápizes » ou « vezes » : z devient c devant -es.",
      "Garder l'accent dans « canciónes ».",
      "Oublier d'accorder l'adjectif : « las casas grande » est faux (grandes)."
    ],
    skills: ["articles-gender"]
  },
  {
    id: "es-r-ser-estar",
    level: "A1",
    group: "Premiers pas",
    order: 7,
    title: "Ser et estar (les bases)",
    summary: "Ser dit ce que quelqu'un ou quelque chose EST (identité, origine, profession) ; estar dit où il se trouve et comment il va en ce moment.",
    sections: [
      {
        heading: "Conjugaison au présent",
        table: {
          head: ["", "ser", "estar"],
          rows: [
            ["yo", "soy", "estoy"],
            ["tú", "eres", "estás"],
            ["él / ella / usted", "es", "está"],
            ["nosotros", "somos", "estamos"],
            ["vosotros", "sois", "estáis"],
            ["ellos / ustedes", "son", "están"]
          ]
        }
      },
      {
        heading: "Quand utiliser chaque verbe",
        table: {
          head: ["Ser : ce que c'est", "Estar : où et comment"],
          rows: [
            ["identité : Soy Ana.", "lieu : Estoy en casa."],
            ["origine : Es de Lyon.", "état du moment : Estoy cansado."],
            ["profession : Soy médico.", "résultat : La puerta está abierta."],
            ["caractère : Es amable.", "action en cours : Estoy trabajando."],
            ["matière, possession : Es de madera. Es mío.", "santé : Estoy bien / enfermo."],
            ["heure, date : Son las tres. Es lunes.", "—"]
          ]
        }
      },
      {
        heading: "Adjectifs dont le sens change",
        points: [
          "ser aburrido (ennuyeux) / estar aburrido (s'ennuyer).",
          "ser listo (intelligent) / estar listo (prêt).",
          "ser malo (méchant, mauvais) / estar malo (malade).",
          "ser rico (riche) / estar rico (délicieux)."
        ]
      }
    ],
    examples: [
      { target: "Mi hermana es médica, pero hoy está enferma.", translation: "Ma sœur est médecin, mais aujourd'hui elle est malade.", note: "profession : ser ; état passager : estar." },
      { target: "La fiesta es en mi casa; mi casa está en el centro.", translation: "La fête a lieu chez moi ; ma maison est dans le centre.", note: "Un événement se situe avec ser, un objet avec estar." },
      { target: "Somos de Francia y estamos en Madrid.", translation: "Nous sommes de France et nous sommes à Madrid.", note: "origine : ser ; lieu actuel : estar." }
    ],
    pitfalls: [
      "Dire « soy cansado » : la fatigue est un état, donc estoy cansado.",
      "Dire « estoy médico » : profession = soy médico.",
      "Dire « soy 30 años » : l'âge se dit avec tener (tengo 30 años)."
    ],
    skills: ["ser-estar", "location"]
  },
  {
    id: "es-r-pronoms-sujets",
    level: "A1",
    group: "Premiers pas",
    order: 7.5,
    title: "Les pronoms sujets (tú, usted, vosotros…)",
    summary: "Yo, tú, él/ella/usted, nosotros/as, vosotros/as, ellos/ellas/ustedes : on les omet presque toujours, sauf pour insister ou lever un doute.",
    sections: [
      {
        heading: "Les six personnes",
        table: {
          head: ["Personne", "Espagnol", "Français"],
          rows: [
            ["1re singulier", "yo", "je"],
            ["2e singulier", "tú", "tu (familier)"],
            ["3e singulier", "él / ella / usted", "il / elle / vous (politesse)"],
            ["1re pluriel", "nosotros / nosotras", "nous (masculin ou mixte / féminin)"],
            ["2e pluriel", "vosotros / vosotras", "vous (familier, Espagne)"],
            ["3e pluriel", "ellos / ellas / ustedes", "ils / elles / vous (politesse ; tous les « vous » en Amérique latine)"]
          ]
        }
      },
      {
        heading: "Tú ou usted ?",
        points: [
          "Tú : amis, famille, enfants, collègues proches.",
          "Usted : politesse, inconnus, patients, personnes âgées ; le verbe se conjugue à la 3e personne (usted habla).",
          "Ustedes remplace vosotros en Amérique latine et, en Espagne, pour la politesse."
        ]
      },
      {
        heading: "Omettre le pronom",
        text: "La terminaison du verbe indique déjà la personne : on dit Hablo español, pas Yo hablo español. On ajoute le pronom pour contraster (Yo trabajo, tú descansas) ou quand le verbe est ambigu (él / ella / usted ont la même forme)."
      }
    ],
    examples: [
      { target: "Hablo español y vivo en Francia.", translation: "Je parle espagnol et j'habite en France.", note: "Pas de yo : hablo et vivo suffisent." },
      { target: "¿Usted es médico?", translation: "Vous êtes médecin ?", note: "Usted de politesse, avec es (3e personne)." },
      { target: "Nosotras trabajamos en el hospital.", translation: "Nous (des femmes) travaillons à l'hôpital.", note: "Nosotras si le groupe n'est composé que de femmes." },
      { target: "Él descansa, pero ella trabaja.", translation: "Lui se repose, mais elle travaille.", note: "Les pronoms servent ici à opposer deux personnes." }
    ],
    pitfalls: [
      "Dire Yo soy, Tú eres… à chaque phrase comme en français : l'espagnol les omet presque toujours.",
      "Dire tú à un patient ou à un inconnu : prenez usted tant qu'on ne vous propose pas le tutoiement.",
      "Oublier le féminin : nosotras, vosotras et ellas existent."
    ],
    skills: ["present-tense", "introductions"]
  },
  {
    id: "es-r-present-regulier",
    level: "A1",
    group: "Premiers pas",
    order: 8,
    title: "Le présent des verbes réguliers (-ar, -er, -ir)",
    summary: "Retirez -ar/-er/-ir et ajoutez la terminaison de la personne ; le pronom sujet est le plus souvent omis.",
    sections: [
      {
        heading: "Trois modèles",
        table: {
          head: ["", "hablar (-ar)", "comer (-er)", "vivir (-ir)"],
          rows: [
            ["yo", "hablo", "como", "vivo"],
            ["tú", "hablas", "comes", "vives"],
            ["él / ella / usted", "habla", "come", "vive"],
            ["nosotros", "hablamos", "comemos", "vivimos"],
            ["vosotros", "habláis", "coméis", "vivís"],
            ["ellos / ustedes", "hablan", "comen", "viven"]
          ]
        }
      },
      {
        heading: "Points à retenir",
        points: [
          "Le pronom sujet (yo, tú…) n'est utilisé que pour insister ou lever un doute : la terminaison suffit.",
          "Négation : no devant le verbe (No hablo alemán).",
          "Question : même ordre qu'une phrase ordinaire, avec ¿ ? et l'intonation (¿Hablas español?).",
          "Le présent exprime l'habitude, ce qui se passe maintenant et un futur proche (Mañana trabajo).",
          "Vosotros est surtout employé en Espagne ; en Amérique latine, on dit ustedes + 3e personne du pluriel."
        ]
      },
      {
        heading: "Premiers irréguliers à la 1re personne",
        table: {
          head: ["Infinitif", "yo", "Remarque"],
          rows: [
            ["hacer", "hago", "faire"],
            ["tener", "tengo", "avoir (et tienes, tiene…)"],
            ["salir", "salgo", "sortir"],
            ["poner", "pongo", "mettre"],
            ["saber", "sé", "savoir"],
            ["ver", "veo", "voir"],
            ["dar", "doy", "donner"],
            ["conocer", "conozco", "connaître"]
          ]
        }
      }
    ],
    examples: [
      { target: "Trabajo en un hospital y vivo cerca.", translation: "Je travaille dans un hôpital et j'habite tout près.", note: "Pas de pronom yo : -o suffit." },
      { target: "¿Comes en casa o en el trabajo?", translation: "Tu manges chez toi ou au travail ?", note: "-es à la 2e personne ; pas d'inversion." },
      { target: "Nosotros no hablamos alemán.", translation: "Nous ne parlons pas allemand.", note: "no + verbe ; pas d'article devant la langue." }
    ],
    pitfalls: [
      "Oublier le -s de la 2e personne : tú hablas, tú comes, tú vives.",
      "Utiliser le sujet à chaque phrase comme en français : « yo hablo, yo vivo… » sonne lourd.",
      "Confondre la terminaison -e de comer (él come) avec celle de hablar (él habla)."
    ],
    skills: ["present-tense"]
  },
  {
    id: "es-r-adjectifs-accord-place",
    level: "A1",
    group: "Accords",
    order: 9,
    title: "Adjectifs : accord et place",
    summary: "L'adjectif s'accorde en genre et en nombre avec le nom et se place en général après lui.",
    sections: [
      {
        heading: "Accord",
        table: {
          head: ["Type", "Masc. sing.", "Fém. sing.", "Masc. plur.", "Fém. plur."],
          rows: [
            ["en -o", "blanco", "blanca", "blancos", "blancas"],
            ["en -e (invariable en genre)", "grande", "grande", "grandes", "grandes"],
            ["consonne (invariable en genre)", "fácil", "fácil", "fáciles", "fáciles"],
            ["nationalité en consonne", "español", "española", "españoles", "españolas"],
            ["nationalité en -és", "francés", "francesa", "franceses", "francesas"],
            ["en -or", "trabajador", "trabajadora", "trabajadores", "trabajadoras"]
          ]
        }
      },
      {
        heading: "Place",
        points: [
          "Par défaut, l'adjectif qualificatif se place APRÈS le nom : un coche rojo, una casa grande.",
          "Les adjectifs de quantité et les déterminants se placent avant : mucho tiempo, otro día, primer piso.",
          "Un adjectif avant le nom exprime une qualité évidente ou affective : una bonita casa.",
          "Plusieurs adjectifs : un coche rojo y moderno."
        ]
      },
      {
        heading: "Apocope (forme courte devant un nom masculin singulier)",
        table: {
          head: ["Forme longue", "Forme courte", "Exemple"],
          rows: [
            ["bueno", "buen", "un buen médico"],
            ["malo", "mal", "un mal día"],
            ["primero / tercero", "primer / tercer", "el primer piso"],
            ["grande", "gran (devant tout nom singulier)", "un gran amigo, una gran mujer"],
            ["santo", "san (devant un nom propre)", "San José"]
          ]
        }
      },
      {
        heading: "Le sens change avec la place",
        points: [
          "un gran hombre (un grand homme, de valeur) / un hombre grande (de grande taille).",
          "un viejo amigo (un vieil ami, de longue date) / un amigo viejo (âgé).",
          "pobre : un pobre hombre (qui fait pitié) / un hombre pobre (sans argent)."
        ]
      }
    ],
    examples: [
      { target: "Las casas blancas son muy bonitas.", translation: "Les maisons blanches sont très jolies.", note: "casas blancas : accord fém. plur." },
      { target: "Tengo un buen amigo español.", translation: "J'ai un bon ami espagnol.", note: "buen devant un nom masculin ; español après le nom." },
      { target: "Mi madre es una gran médica.", translation: "Ma mère est un grand médecin.", note: "gran devant un nom féminin aussi." }
    ],
    pitfalls: [
      "Placer la couleur avant le nom : « un rojo coche » est faux.",
      "Dire « un bueno amigo » : on dit un buen amigo.",
      "Oublier l'accord de la nationalité : mi amiga es francés → francesa."
    ],
    skills: ["articles-gender", "sentence-building"]
  },
  {
    id: "es-r-possessifs",
    level: "A1",
    group: "Accords",
    order: 10,
    title: "Les possessifs",
    summary: "Mi, tu, su, nuestro, vuestro, su s'accordent avec la chose possédée, pas avec le possesseur ; les formes longues (mío, tuyo…) suivent le nom.",
    sections: [
      {
        heading: "Devant le nom (formes courtes)",
        table: {
          head: ["Possesseur", "Un objet", "Plusieurs objets"],
          rows: [
            ["yo", "mi libro / mi casa", "mis libros / mis casas"],
            ["tú", "tu libro / tu casa", "tus libros / tus casas"],
            ["él, ella, usted", "su libro / su casa", "sus libros / sus casas"],
            ["nosotros", "nuestro libro / nuestra casa", "nuestros libros / nuestras casas"],
            ["vosotros", "vuestro libro / vuestra casa", "vuestros libros / vuestras casas"],
            ["ellos, ustedes", "su libro / su casa", "sus libros / sus casas"]
          ]
        }
      },
      {
        heading: "Après le nom ou seuls (formes longues)",
        table: {
          head: ["Personne", "Masculin", "Féminin"],
          rows: [
            ["yo", "mío / míos", "mía / mías"],
            ["tú", "tuyo / tuyos", "tuya / tuyas"],
            ["él, ella, usted, ellos", "suyo / suyos", "suya / suyas"],
            ["nosotros", "nuestro / nuestros", "nuestra / nuestras"],
            ["vosotros", "vuestro / vuestros", "vuestra / vuestras"]
          ]
        }
      },
      {
        heading: "Emplois",
        points: [
          "Un amigo mío = un de mes amis ; Este libro es mío ; El mío es azul (article + forme longue).",
          "Su peut signifier son, sa, ses, leur, votre (usted) : pour lever l'ambiguïté on dit el libro de él / de ella / de usted.",
          "Pour les parties du corps et les vêtements, on utilise l'article : Me duele la cabeza ; Me lavo las manos."
        ]
      }
    ],
    examples: [
      { target: "Mi hermano y mis padres viven en Sevilla.", translation: "Mon frère et mes parents habitent à Séville.", note: "mi / mis selon le nombre de la chose possédée." },
      { target: "Esta es nuestra casa y aquella es la suya.", translation: "Voici notre maison et celle-là est la leur.", note: "nuestra s'accorde avec casa ; la suya = la leur." },
      { target: "Me duele la cabeza.", translation: "J'ai mal à la tête (ma tête me fait mal).", note: "article défini avec une partie du corps, pas « mi cabeza »." }
    ],
    pitfalls: [
      "Accorder avec le possesseur : même entre hommes, on dit nuestra casa (casa est féminin).",
      "Dire « un mi amigo » : on dit un amigo mío.",
      "Utiliser mi pour une partie du corps : me lavo las manos."
    ],
    skills: ["articles-gender", "family-vocabulary"]
  },
  {
    id: "es-r-demonstratifs",
    level: "A1",
    group: "Accords",
    order: 11,
    title: "Les démonstratifs",
    summary: "L'espagnol distingue trois distances : este (près de moi), ese (près de toi), aquel (loin de nous deux).",
    sections: [
      {
        heading: "Tableau des formes",
        table: {
          head: ["Distance", "Masc. sing.", "Fém. sing.", "Masc. plur.", "Fém. plur.", "Neutre"],
          rows: [
            ["près de moi (ce…-ci)", "este", "esta", "estos", "estas", "esto"],
            ["près de toi (ce…-là)", "ese", "esa", "esos", "esas", "eso"],
            ["loin (là-bas)", "aquel", "aquella", "aquellos", "aquellas", "aquello"]
          ]
        }
      },
      {
        heading: "Adverbes de lieu associés",
        table: {
          head: ["Adverbe", "Sens"],
          rows: [
            ["aquí (acá)", "ici"],
            ["ahí", "là, près de toi"],
            ["allí (allá)", "là-bas, loin"]
          ]
        }
      },
      {
        heading: "Emplois",
        points: [
          "Le démonstratif s'accorde avec le nom : este médico, esta enfermera, estos días.",
          "Dans le temps : esta mañana, este año (proche) ; aquel día (lointain, passé).",
          "Les formes neutres esto, eso, aquello désignent une chose non identifiée ou une idée : ¿Qué es esto?",
          "Pour dire « ce que » : lo que (Lo que dices es verdad) ; eso que dices = ce que tu dis là."
        ]
      }
    ],
    examples: [
      { target: "Este libro es mío, ese es tuyo y aquel es de Ana.", translation: "Ce livre-ci est à moi, celui-là est à toi et celui là-bas est à Ana.", note: "Trois distances." },
      { target: "¿Qué es esto?", translation: "Qu'est-ce que c'est ?", note: "neutre : on ne connaît pas encore le nom." },
      { target: "Aquellos años fueron difíciles.", translation: "Ces années-là furent difficiles.", note: "aquel pour une époque lointaine." }
    ],
    pitfalls: [
      "Ne pas accorder : « esta libro » est faux (este libro).",
      "Employer ese pour « celui qui est près de moi » : près de moi = este.",
      "Utiliser esto avec un nom : « esto libro » n'existe pas."
    ],
    skills: ["location", "articles-gender"]
  },
  {
    id: "es-r-hay-estar",
    level: "A1",
    group: "Phrases et questions",
    order: 12,
    title: "Hay et estar : dire où se trouvent les choses",
    summary: "Hay présente une chose indéfinie (« il y a ») ; estar situe une chose précise (déterminée) : Hay un banco / El banco está en la calle.",
    sections: [
      {
        heading: "Le choix",
        table: {
          head: ["", "hay", "estar"],
          rows: [
            ["Emploi", "existence : il y a…", "localisation d'un élément connu"],
            ["Nom", "un, una, unos, dos, mucho, algún, ningún, sans article", "el, la, mi, este… (défini)"],
            ["Accord", "invariable (hay un banco, hay dos bancos)", "s'accorde (está, están)"],
            ["Exemple", "Hay un banco cerca.", "El banco está en la calle Mayor."]
          ]
        }
      },
      {
        heading: "Expressions de lieu",
        table: {
          head: ["Espagnol", "Français"],
          rows: [
            ["en / sobre", "dans, sur"],
            ["debajo de", "sous"],
            ["delante de / detrás de", "devant / derrière"],
            ["al lado de", "à côté de"],
            ["cerca de / lejos de", "près de / loin de"],
            ["entre", "entre"],
            ["enfrente de", "en face de"],
            ["a la derecha / a la izquierda", "à droite / à gauche"]
          ]
        }
      },
      {
        heading: "Aussi",
        points: [
          "No hay (il n'y a pas) ; ¿Hay…? (Y a-t-il… ?) ; había (il y avait) ; hubo (il y eut).",
          "Hay que + infinitif : il faut (obligation impersonnelle) : Hay que descansar.",
          "Un événement se situe avec ser : La reunión es en la sala 3."
        ]
      }
    ],
    examples: [
      { target: "En mi barrio hay una farmacia y dos bancos.", translation: "Dans mon quartier, il y a une pharmacie et deux banques.", note: "hay reste invariable devant un pluriel." },
      { target: "La farmacia está al lado del banco.", translation: "La pharmacie est à côté de la banque.", note: "farmacia est déterminée : estar ; al lado de + del." },
      { target: "No hay nadie en la sala; los médicos están en la reunión.", translation: "Il n'y a personne dans la salle ; les médecins sont en réunion.", note: "hay / están." }
    ],
    pitfalls: [
      "Dire « hay el banco » : avec un article défini, on emploie estar.",
      "Mettre hay au pluriel (« hayn ») : il est invariable.",
      "Dire « hay el médico » pour un médecin précis : pour une chose ou une personne déterminée, on dit está."
    ],
    skills: ["location"]
  },
  {
    id: "es-r-tener",
    level: "A1",
    group: "Verbes et temps",
    order: 13,
    title: "Tener : avoir, âge, faim, tener que",
    summary: "Tener sert à dire ce que l'on possède, l'âge et les sensations (faim, soif, froid) ; tener que + infinitif exprime l'obligation.",
    sections: [
      {
        heading: "Conjugaison",
        table: {
          head: ["Personne", "tener"],
          rows: [
            ["yo", "tengo"],
            ["tú", "tienes"],
            ["él / ella / usted", "tiene"],
            ["nosotros", "tenemos"],
            ["vosotros", "tenéis"],
            ["ellos / ustedes", "tienen"]
          ]
        }
      },
      {
        heading: "Expressions avec tener (avoir… en français)",
        table: {
          head: ["Espagnol", "Français"],
          rows: [
            ["tener … años", "avoir … ans"],
            ["tener hambre / sed", "avoir faim / soif"],
            ["tener frío / calor", "avoir froid / chaud"],
            ["tener sueño / miedo / prisa", "avoir sommeil / peur / être pressé"],
            ["tener razón / suerte", "avoir raison / de la chance"],
            ["tener ganas de + inf.", "avoir envie de"],
            ["tener fiebre / tos / dolor de cabeza", "avoir de la fièvre / de la toux / mal à la tête"]
          ]
        }
      },
      {
        heading: "Obligation",
        points: [
          "tener que + infinitif : obligation personnelle (Tengo que irme).",
          "hay que + infinitif : obligation générale, impersonnelle (Hay que beber agua).",
          "deber + infinitif : devoir moral, conseil (Debes descansar).",
          "Avec ces noms, on dit mucho et non muy : tengo mucho frío, mucha hambre."
        ]
      }
    ],
    examples: [
      { target: "Tengo treinta años y mucha hambre.", translation: "J'ai trente ans et très faim.", note: "mucha s'accorde avec hambre." },
      { target: "Mañana tenemos que trabajar.", translation: "Demain nous devons travailler.", note: "tener que + infinitif." },
      { target: "El paciente tiene fiebre y tos.", translation: "Le patient a de la fièvre et de la toux.", note: "Pas d'article : tiene fiebre." }
    ],
    pitfalls: [
      "Dire « soy hambre » ou « estoy hambre » : on dit tengo hambre.",
      "Dire « tengo muy frío » : il faut mucho frío.",
      "Dire « tengo de » ou « tengo a » : la construction est tener que + infinitif."
    ],
    skills: ["present-tense", "obligation"]
  },
  {
    id: "es-r-gustar",
    level: "A1",
    group: "Verbes et temps",
    order: 14,
    title: "Gustar et les verbes construits comme gustar",
    summary: "Gustar se construit à l'envers : la chose qui plaît est le sujet, la personne est un complément (Me gusta el café = le café me plaît).",
    sections: [
      {
        heading: "Structure",
        table: {
          head: ["Personne (insister)", "Pronom", "gusta / gustan"],
          rows: [
            ["A mí", "me", "gusta el café / gustan los gatos"],
            ["A ti", "te", "gusta / gustan"],
            ["A él / ella / usted", "le", "gusta / gustan"],
            ["A nosotros", "nos", "gusta / gustan"],
            ["A vosotros", "os", "gusta / gustan"],
            ["A ellos / ustedes", "les", "gusta / gustan"]
          ]
        }
      },
      {
        heading: "Règles",
        points: [
          "Le verbe s'accorde avec la chose qui plaît : me gusta el té, me gustan los libros.",
          "Devant un verbe à l'infinitif, toujours le singulier : Me gusta leer ; Me gusta leer y escribir.",
          "A mí, a ti… servent à insister ou à comparer ; A Pedro le gusta… : le pronom reste obligatoire.",
          "Aussi/non plus : A mí también / A mí tampoco.",
          "Beaucoup : me gusta mucho (jamais « me gusta muy »)."
        ]
      },
      {
        heading: "Autres verbes sur le même modèle",
        table: {
          head: ["Verbe", "Sens", "Exemple"],
          rows: [
            ["encantar", "adorer", "Me encanta viajar."],
            ["interesar", "intéresser", "Me interesan los idiomas."],
            ["importar", "importer, déranger", "No me importa."],
            ["molestar", "gêner", "Me molesta el ruido."],
            ["doler", "faire mal", "Me duele la cabeza / Me duelen los pies."],
            ["parecer", "sembler", "Me parece bien."],
            ["faltar / quedar", "manquer / rester", "Me falta tiempo. / Me quedan dos."],
            ["apetecer", "avoir envie de", "¿Te apetece un café?"],
            ["preocupar", "préoccuper", "Me preocupa tu salud."]
          ]
        }
      }
    ],
    examples: [
      { target: "A mí me gusta el café, pero a ella le gustan los tés.", translation: "J'aime le café, mais elle aime les thés.", note: "gusta / gustan selon la chose ; a mí / a ella pour contraster." },
      { target: "¿Te gusta viajar? — Sí, me encanta.", translation: "Tu aimes voyager ? — Oui, j'adore.", note: "Infinitif : verbe au singulier." },
      { target: "Me duele la cabeza y me duelen los pies.", translation: "J'ai mal à la tête et aux pieds.", note: "doler suit gustar ; article défini, pas de mi." }
    ],
    pitfalls: [
      "Dire « yo gusto el café » : gustar ne s'utilise pas avec yo comme sujet de cette façon.",
      "Dire « me gusta los libros » : pluriel = gustan.",
      "Oublier le pronom : « a Pedro gusta el café » → a Pedro le gusta."
    ],
    skills: ["object-pronouns", "everyday-vocabulary"]
  },
  {
    id: "es-r-interrogatifs",
    level: "A1",
    group: "Phrases et questions",
    order: 15,
    title: "Les mots interrogatifs et les questions",
    summary: "Les mots interrogatifs portent toujours un accent écrit et la question est encadrée par ¿ ? ; le verbe suit l'interrogatif, sans « est-ce que ».",
    sections: [
      {
        heading: "Tableau",
        table: {
          head: ["Mot", "Sens", "Exemple"],
          rows: [
            ["qué", "que, quoi, quel (+ nom)", "¿Qué haces? ¿Qué libro?"],
            ["quién / quiénes", "qui", "¿Quién es? ¿Quiénes vienen?"],
            ["cuál / cuáles", "lequel, quel (choix)", "¿Cuál prefieres?"],
            ["cuándo", "quand", "¿Cuándo llegas?"],
            ["dónde / adónde", "où / vers où", "¿Dónde vives? ¿Adónde vas?"],
            ["cómo", "comment", "¿Cómo te llamas?"],
            ["cuánto / cuánta / cuántos / cuántas", "combien (s'accorde)", "¿Cuántos años tienes?"],
            ["por qué", "pourquoi", "¿Por qué estudias español?"]
          ]
        }
      },
      {
        heading: "Règles",
        points: [
          "Pas de « est-ce que » : ¿Dónde trabaja Ana? (le verbe passe avant le sujet explicite).",
          "Question fermée : même phrase qu'une affirmation, avec ¿ ? et l'intonation montante : ¿Hablas inglés?",
          "Prépositions avant l'interrogatif : ¿De dónde eres? ¿Con quién vives? ¿A qué hora llegas?",
          "Qué + nom (qué libro) ou définition (¿Qué es?) ; cuál pour choisir parmi plusieurs (¿Cuál es tu número?).",
          "Por qué (question) ≠ porque (parce que) ≠ el porqué (la raison)."
        ]
      },
      {
        heading: "Exclamations",
        points: ["¡Qué bonito! ¡Qué calor! ¡Cuánta gente!"]
      }
    ],
    examples: [
      { target: "¿De dónde eres y cuántos años tienes?", translation: "D'où viens-tu et quel âge as-tu ?", note: "de dónde : préposition + interrogatif ; cuántos s'accorde avec años." },
      { target: "¿Por qué estás cansada? — Porque trabajo mucho.", translation: "Pourquoi es-tu fatiguée ? — Parce que je travaille beaucoup.", note: "por qué / porque." },
      { target: "¿Cuál prefieres, el rojo o el azul?", translation: "Lequel préfères-tu, le rouge ou le bleu ?", note: "cuál pour choisir entre des options." }
    ],
    pitfalls: [
      "Traduire « est-ce que » : l'espagnol n'en a pas, et ¿Dónde tú vives? est maladroit (¿Dónde vives?).",
      "Oublier l'accent : ¿Donde vives? est faux.",
      "Confondre qué et cuál : « ¿Qué es tu nombre? » → ¿Cuál es tu nombre?"
    ],
    skills: ["sentence-building", "polite-requests"]
  },
  {
    id: "es-r-ir-a-infinitif",
    level: "A1",
    group: "Verbes et temps",
    order: 16,
    title: "Ir a + infinitif (futur proche)",
    summary: "Voy a + infinitif traduit « je vais + infinitif » : c'est le futur le plus courant à l'oral.",
    sections: [
      {
        heading: "Conjugaison de ir",
        table: {
          head: ["Personne", "ir", "ir a + infinitif"],
          rows: [
            ["yo", "voy", "voy a comer"],
            ["tú", "vas", "vas a comer"],
            ["él / ella / usted", "va", "va a comer"],
            ["nosotros", "vamos", "vamos a comer"],
            ["vosotros", "vais", "vais a comer"],
            ["ellos / ustedes", "van", "van a comer"]
          ]
        }
      },
      {
        heading: "Emplois et détails",
        points: [
          "La préposition a est obligatoire : voy a estudiar (jamais « voy estudiar »).",
          "Vamos a + infinitif signifie aussi « allons + infinitif » : ¡Vamos a comer!",
          "Ir a + lieu : Voy a Madrid ; ir en + transport : Voy en tren ; ir a pie.",
          "Marqueurs de temps : mañana, esta tarde, la semana próxima, el año que viene.",
          "Pronoms : Voy a comprarlo ou Lo voy a comprar.",
          "Négation : No voy a ir."
        ]
      }
    ],
    examples: [
      { target: "Esta noche voy a cenar con mis padres.", translation: "Ce soir je vais dîner avec mes parents.", note: "voy a + infinitif." },
      { target: "¿Qué vais a hacer el sábado?", translation: "Qu'allez-vous faire samedi ?", note: "vais (vosotros) + a + hacer." },
      { target: "No voy a comprarlo; lo voy a pensar.", translation: "Je ne vais pas l'acheter ; je vais y réfléchir.", note: "Le pronom s'attache à l'infinitif ou précède ir." }
    ],
    pitfalls: [
      "Omettre la préposition a (« voy comer »).",
      "Mélanger ir a + infinitif et le futur simple dans la même phrase sans raison.",
      "Dire « voy en casa » ou « voy a la casa » pour « je rentre » : on dit voy a casa."
    ],
    skills: ["present-tense"]
  },
  {
    id: "es-r-verbes-diphtongue-irreguliers",
    level: "A2",
    group: "Verbes et temps",
    order: 17,
    title: "Verbes à diphtongue et irréguliers",
    summary: "Beaucoup de verbes changent la voyelle du radical quand l'accent tombe dessus (e→ie, o→ue, e→i), sauf à nosotros et vosotros.",
    sections: [
      {
        heading: "Les trois grands changements",
        table: {
          head: ["", "e → ie (querer)", "o → ue (poder)", "e → i (pedir)"],
          rows: [
            ["yo", "quiero", "puedo", "pido"],
            ["tú", "quieres", "puedes", "pides"],
            ["él / ella / usted", "quiere", "puede", "pide"],
            ["nosotros", "queremos", "podemos", "pedimos"],
            ["vosotros", "queréis", "podéis", "pedís"],
            ["ellos / ustedes", "quieren", "pueden", "piden"]
          ]
        }
      },
      {
        heading: "Verbes courants",
        points: [
          "e → ie : pensar, empezar, cerrar, entender, preferir, sentir, perder.",
          "o → ue : volver, dormir, encontrar, contar, costar, recordar, mover.",
          "e → i : pedir, servir, repetir, seguir, decir (digo).",
          "u → ue : jugar (juego, juegas, juega, jugamos, jugáis, juegan)."
        ]
      },
      {
        heading: "Irréguliers à la 1re personne",
        table: {
          head: ["Verbe", "yo", "autres personnes"],
          rows: [
            ["hacer", "hago", "haces, hace…"],
            ["poner", "pongo", "pones…"],
            ["salir", "salgo", "sales…"],
            ["traer", "traigo", "traes…"],
            ["ver", "veo", "ves, ve…"],
            ["saber", "sé", "sabes…"],
            ["conocer", "conozco", "conoces…"],
            ["traducir", "traduzco", "traduces…"],
            ["decir", "digo", "dices, dice… (e→i)"],
            ["venir", "vengo", "vienes, viene… (e→ie)"],
            ["oír", "oigo", "oyes, oye, oímos, oís, oyen"]
          ]
        }
      },
      {
        heading: "Totalement irréguliers",
        text: "ser (soy, eres, es…), estar (estoy, estás…), ir (voy, vas, va…), haber (he, has, ha…), dar (doy, das, da…) : à apprendre par cœur."
      }
    ],
    examples: [
      { target: "Yo quiero un café, pero ella prefiere un té.", translation: "Je veux un café, mais elle préfère un thé.", note: "querer et preferir : e→ie." },
      { target: "Nosotros dormimos ocho horas, pero ellos duermen seis.", translation: "Nous dormons huit heures, mais eux en dorment six.", note: "nosotros : pas de diphtongue." },
      { target: "Hago la cena y pongo la mesa.", translation: "Je fais le dîner et je mets la table.", note: "hago, pongo : 1re personne en -go." }
    ],
    pitfalls: [
      "Diphtonguer à nosotros/vosotros : « puedemos » est faux, on dit podemos.",
      "Dire « quero » ou « podo » au lieu de quiero / puedo.",
      "Dire « hacio » ou « poneo » : la 1re personne est hago, pongo."
    ],
    skills: ["present-tense"]
  },
  {
    id: "es-r-pronoms-cod-coi",
    level: "A2",
    group: "Pronoms",
    order: 18,
    title: "Pronoms COD / COI et leur place",
    summary: "Les pronoms compléments se placent avant le verbe conjugué ou s'attachent à l'infinitif, au gérondif et à l'impératif affirmatif ; avec deux pronoms, le COI précède le COD et le + lo devient se lo.",
    sections: [
      {
        heading: "Tableau des formes",
        table: {
          head: ["Personne", "COD", "COI"],
          rows: [
            ["yo", "me", "me"],
            ["tú", "te", "te"],
            ["él / usted (masc.)", "lo", "le"],
            ["ella / usted (fém.)", "la", "le"],
            ["nosotros", "nos", "nos"],
            ["vosotros", "os", "os"],
            ["ellos / ustedes (masc.)", "los", "les"],
            ["ellas / ustedes (fém.)", "las", "les"]
          ]
        }
      },
      {
        heading: "Place",
        points: [
          "Avant le verbe conjugué : Lo veo. No lo veo.",
          "Attaché à l'infinitif ou au gérondif : Quiero verlo ; Estoy viéndolo (accent écrit sur le gérondif). Ou avant l'auxiliaire : Lo quiero ver ; Lo estoy viendo.",
          "Attaché à l'impératif affirmatif : Dámelo. Avant, à la forme négative : No me lo des.",
          "Avec haber : jamais entre he et le participe : Lo he visto."
        ]
      },
      {
        heading: "Deux pronoms",
        table: {
          head: ["Ordre", "Exemple", "Remarque"],
          rows: [
            ["COI + COD", "Me lo da.", "ordre fixe"],
            ["le / les + lo, la, los, las → se", "Se lo doy (à lui/elle/eux).", "jamais « le lo »"],
            ["attaché à l'infinitif", "Voy a dárselo.", "accent écrit"]
          ]
        }
      },
      {
        heading: "Redoublement et neutre",
        points: [
          "Le COI est presque toujours redoublé : Le doy el libro a María ; A María le doy el libro.",
          "Lo neutre remplace une idée ou un adjectif : No lo sé ; Lo es.",
          "En Espagne, le s'emploie parfois comme COD masculin pour une personne (Le veo) : c'est le « leísmo », toléré."
        ]
      }
    ],
    examples: [
      { target: "¿Las llaves? Las tengo en el bolso.", translation: "Les clés ? Je les ai dans le sac.", note: "las (COD féminin pluriel) avant le verbe." },
      { target: "Le doy el libro a mi madre → Se lo doy.", translation: "Je donne le livre à ma mère → Je le lui donne.", note: "le + lo → se lo." },
      { target: "Quiero comprarlo / Lo quiero comprar.", translation: "Je veux l'acheter.", note: "Deux places possibles pour le pronom." }
    ],
    pitfalls: [
      "Dire « le lo doy » : on dit se lo doy.",
      "Placer le pronom après le verbe conjugué : « veo lo ».",
      "Oublier l'accent en attachant un pronom : dame → dámelo, comprando → comprándolo."
    ],
    skills: ["object-pronouns"]
  },
  {
    id: "es-r-verbes-pronominaux",
    level: "A2",
    group: "Pronoms",
    order: 19,
    title: "Les verbes pronominaux",
    summary: "Les verbes réfléchis se conjuguent avec me, te, se, nos, os, se ; plusieurs verbes pronominaux français ne le sont pas en espagnol, et inversement.",
    sections: [
      {
        heading: "Conjugaison : levantarse",
        table: {
          head: ["Personne", "Pronom + verbe"],
          rows: [
            ["yo", "me levanto"],
            ["tú", "te levantas"],
            ["él / ella / usted", "se levanta"],
            ["nosotros", "nos levantamos"],
            ["vosotros", "os levantáis"],
            ["ellos / ustedes", "se levantan"]
          ]
        }
      },
      {
        heading: "Place et emplois",
        points: [
          "Le pronom précède le verbe conjugué : Me levanto a las siete.",
          "Avec un infinitif : Voy a levantarme ou Me voy a levantar ; Quiero acostarme ou Me quiero acostar.",
          "Parties du corps et vêtements : Me lavo las manos ; Se pone el abrigo (article, pas de possessif).",
          "Verbes courants : llamarse, levantarse, ducharse, acostarse, sentarse, vestirse, sentirse, irse.",
          "Changements d'état : ponerse (nervioso), quedarse (sorprendido), hacerse (médico), volverse (loco)."
        ]
      },
      {
        heading: "Différences avec le français",
        table: {
          head: ["Français", "Espagnol"],
          rows: [
            ["se souvenir de", "acordarse de / recordar"],
            ["s'asseoir", "sentarse"],
            ["se promener", "pasear (non pronominal)"],
            ["se tromper", "equivocarse"],
            ["il s'agit de", "se trata de"],
            ["se mettre à", "ponerse a"],
            ["s'en aller", "irse"]
          ]
        }
      },
      {
        heading: "Se impersonnel et passif",
        points: ["Se habla español. (On parle espagnol.)", "Se venden casas. (Des maisons sont à vendre.)"]
      }
    ],
    examples: [
      { target: "Me levanto a las siete y me ducho.", translation: "Je me lève à sept heures et je prends une douche.", note: "me levanto, me ducho." },
      { target: "Mi hermano se pone nervioso en el examen.", translation: "Mon frère devient nerveux à l'examen.", note: "ponerse + adjectif : changement d'état." },
      { target: "No me acuerdo de su nombre.", translation: "Je ne me souviens pas de son nom.", note: "acordarse de." }
    ],
    pitfalls: [
      "Oublier le pronom : « levanto a las siete » est faux.",
      "Dire « me lavo mis manos » : on dit me lavo las manos.",
      "Dire « me recuerdo de » : on dit me acuerdo de, ou recuerdo (sans pronom)."
    ],
    skills: ["present-tense", "everyday-vocabulary"]
  },
  {
    id: "es-r-por-para",
    level: "A2",
    group: "Prépositions",
    order: 20,
    title: "Por ou para ?",
    summary: "Para regarde vers l'avant (but, destinataire, destination, délai) ; por regarde vers l'origine (cause, moyen, passage, échange).",
    sections: [
      {
        heading: "Para : but, destinataire, destination",
        table: {
          head: ["Emploi", "Exemple"],
          rows: [
            ["but, finalité (+ infinitif)", "Estudio para ser médico."],
            ["destinataire", "Este regalo es para ti."],
            ["destination", "El tren para Sevilla sale a las diez."],
            ["échéance", "Lo necesito para el lunes."],
            ["opinion", "Para mí, es difícil."],
            ["comparaison", "Para su edad, está muy fuerte."],
            ["employeur", "Trabajo para una empresa."]
          ]
        }
      },
      {
        heading: "Por : cause, moyen, passage, échange",
        table: {
          head: ["Emploi", "Exemple"],
          rows: [
            ["cause, raison", "Gracias por tu ayuda."],
            ["moyen", "Hablamos por teléfono."],
            ["passage, lieu approximatif", "Paso por el centro."],
            ["moment, durée", "por la mañana, por la noche"],
            ["échange, prix", "Pago diez euros por el libro."],
            ["agent du passif", "La carta fue escrita por el director."],
            ["à la place de, au nom de", "Hablo por todos."]
          ]
        }
      },
      {
        heading: "Locutions à connaître",
        points: [
          "por favor, por eso (c'est pourquoi), por ejemplo, por fin (enfin), por lo menos (au moins), por supuesto (bien sûr).",
          "para siempre, para nada (pas du tout), estar para (être sur le point de).",
          "Test rapide : « dans le but de » = para ; « à cause de / grâce à » = por."
        ]
      }
    ],
    examples: [
      { target: "Voy a Madrid para trabajar, no por turismo.", translation: "Je vais à Madrid pour travailler, pas pour le tourisme.", note: "para + infinitif : but ; por + nom : motif." },
      { target: "Este libro es para ti; lo compré por diez euros.", translation: "Ce livre est pour toi ; je l'ai acheté dix euros.", note: "destinataire / prix." },
      { target: "Por la mañana paseo por el parque.", translation: "Le matin je me promène dans le parc.", note: "moment / lieu de passage." }
    ],
    pitfalls: [
      "Traduire tous les « pour » français par para.",
      "Dire « gracias para tu ayuda » : on remercie avec por.",
      "Confondre por qué (pourquoi) et para qué (dans quel but)."
    ],
    skills: ["everyday-vocabulary", "hotel-travel-vocabulary"]
  },
  {
    id: "es-r-prepositions-a-en-de",
    level: "A2",
    group: "Prépositions",
    order: 21,
    title: "Les prépositions a, en, de",
    summary: "A marque la direction (et le « a personnel »), en le lieu et le moyen de transport, de l'origine et l'appartenance ; chaque verbe garde sa préposition.",
    sections: [
      {
        heading: "Les trois prépositions de base",
        table: {
          head: ["Préposition", "Emplois", "Exemples"],
          rows: [
            ["a", "direction, heure, prix par unité, a personnel, a pie", "Voy a Madrid. A las tres. Veo a María."],
            ["en", "lieu sans mouvement, mois, année, langue, transport", "Vivo en París. En enero. En español. Voy en tren."],
            ["de", "origine, appartenance, matière, moment", "Soy de Lyon. El libro de Ana. De madera. Las tres de la tarde."]
          ]
        }
      },
      {
        heading: "A personnel",
        text: "Devant un complément d'objet direct désignant une personne déterminée, on ajoute a : Veo a María ; Llamo al médico. Pas de a devant un nom de chose (Veo la casa) ni avec tener (Tengo dos hermanos)."
      },
      {
        heading: "Verbes et prépositions fixes",
        table: {
          head: ["Verbe + préposition", "Sens"],
          rows: [
            ["empezar a + inf.", "commencer à"],
            ["acabar de + inf.", "venir de (Acabo de llegar)"],
            ["terminar de / dejar de + inf.", "finir de / arrêter de"],
            ["pensar en / soñar con", "penser à / rêver de"],
            ["depender de", "dépendre de"],
            ["acordarse de", "se souvenir de"],
            ["casarse con / enamorarse de", "se marier avec / tomber amoureux de"],
            ["tardar en + inf.", "mettre du temps à"]
          ]
        }
      },
      {
        heading: "Autres prépositions utiles",
        points: ["con (avec), sin (sans), desde (depuis), hasta (jusqu'à), hacia (vers), durante (pendant), según (selon)."]
      }
    ],
    examples: [
      { target: "Vivo en Madrid, pero soy de Lyon.", translation: "J'habite à Madrid, mais je viens de Lyon.", note: "en = lieu, de = origine." },
      { target: "Voy a la oficina en metro.", translation: "Je vais au bureau en métro.", note: "a = direction ; en = moyen de transport." },
      { target: "Acabo de ver a tu hermano.", translation: "Je viens de voir ton frère.", note: "acabar de + inf. ; a personnel." }
    ],
    pitfalls: [
      "Dire « vivo a París » : le lieu sans mouvement est en.",
      "Oublier le a personnel : « Veo María » est faux.",
      "Dire « pienso a ti » : pensar en ti."
    ],
    skills: ["location", "hotel-travel-vocabulary"]
  },
  {
    id: "es-r-preterito-indefinido",
    level: "A2",
    group: "Verbes et temps",
    order: 22,
    title: "Le pretérito indefinido",
    summary: "Le pretérito indefinido raconte une action terminée à un moment précis du passé ; il correspond au passé composé ou au passé simple français.",
    sections: [
      {
        heading: "Verbes réguliers",
        table: {
          head: ["Personne", "hablar", "comer", "vivir"],
          rows: [
            ["yo", "hablé", "comí", "viví"],
            ["tú", "hablaste", "comiste", "viviste"],
            ["él / ella / usted", "habló", "comió", "vivió"],
            ["nosotros", "hablamos", "comimos", "vivimos"],
            ["vosotros", "hablasteis", "comisteis", "vivisteis"],
            ["ellos / ustedes", "hablaron", "comieron", "vivieron"]
          ]
        }
      },
      {
        heading: "Irréguliers fréquents",
        table: {
          head: ["Infinitif", "yo", "él / ella", "ellos"],
          rows: [
            ["ser / ir", "fui", "fue", "fueron"],
            ["hacer", "hice", "hizo", "hicieron"],
            ["tener", "tuve", "tuvo", "tuvieron"],
            ["estar", "estuve", "estuvo", "estuvieron"],
            ["poder", "pude", "pudo", "pudieron"],
            ["poner", "puse", "puso", "pusieron"],
            ["querer", "quise", "quiso", "quisieron"],
            ["venir", "vine", "vino", "vinieron"],
            ["decir", "dije", "dijo", "dijeron"],
            ["traer", "traje", "trajo", "trajeron"],
            ["saber", "supe", "supo", "supieron"],
            ["dar", "di", "dio", "dieron"],
            ["ver", "vi", "vio", "vieron"]
          ]
        }
      },
      {
        heading: "Particularités",
        points: [
          "Orthographe de la 1re personne : buscar → busqué, llegar → llegué, empezar → empecé.",
          "Voyelle entre deux voyelles : leer → leyó, leyeron ; oír → oyó.",
          "Verbes en -ir à changement : dormir → durmió, durmieron ; pedir → pidió, pidieron ; sentir → sintió.",
          "Marqueurs : ayer, anoche, el año pasado, hace dos días, en 2019, de repente, una vez."
        ]
      }
    ],
    examples: [
      { target: "Ayer comí con mis padres y después fuimos al cine.", translation: "Hier j'ai mangé avec mes parents et ensuite nous sommes allés au cinéma.", note: "comí / fuimos : actions terminées." },
      { target: "El año pasado viajé a México y llegué en avión.", translation: "L'année dernière j'ai voyagé au Mexique et je suis arrivé en avion.", note: "llegué : g → gu devant é." },
      { target: "De repente sonó el teléfono y Ana contestó.", translation: "Soudain le téléphone a sonné et Ana a répondu.", note: "De repente + indefinido." }
    ],
    pitfalls: [
      "Régulariser les irréguliers : « hací » ou « tenió » au lieu de hice et tuvo.",
      "Oublier l'accent : habló (él) ≠ hablo (yo, présent).",
      "Oublier que fue vient de ser (il fut) et de ir (il est allé) : le contexte décide."
    ],
    skills: ["preterite"]
  },
  {
    id: "es-r-imperfecto",
    level: "A2",
    group: "Verbes et temps",
    order: 23,
    title: "L'imperfecto et son emploi (face à l'indefinido)",
    summary: "L'imperfecto décrit le décor, l'habitude et l'action en cours dans le passé ; l'indefinido raconte l'événement qui se produit.",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Personne", "hablar", "comer / vivir", "ser", "ir", "ver"],
          rows: [
            ["yo", "hablaba", "comía / vivía", "era", "iba", "veía"],
            ["tú", "hablabas", "comías / vivías", "eras", "ibas", "veías"],
            ["él / ella / usted", "hablaba", "comía / vivía", "era", "iba", "veía"],
            ["nosotros", "hablábamos", "comíamos / vivíamos", "éramos", "íbamos", "veíamos"],
            ["vosotros", "hablabais", "comíais / vivíais", "erais", "ibais", "veíais"],
            ["ellos / ustedes", "hablaban", "comían / vivían", "eran", "iban", "veían"]
          ]
        }
      },
      {
        heading: "Imperfecto ou indefinido ?",
        table: {
          head: ["Imperfecto", "Indefinido"],
          rows: [
            ["habitude : Cada verano íbamos a la playa.", "action ponctuelle : El verano pasado fuimos a Cádiz."],
            ["description, état : Era alto y llevaba gafas.", "événement : De repente se cayó."],
            ["action en cours : Leía cuando sonó el teléfono.", "action qui interrompt : …cuando sonó el teléfono."],
            ["heure, âge : Eran las tres. Tenía diez años.", "durée délimitée : Viví tres años en Roma."],
            ["marqueurs : siempre, a menudo, mientras, de niño", "marqueurs : ayer, un día, de repente, en 2019"]
          ]
        }
      },
      {
        heading: "Verbes dont le sens change",
        points: [
          "saber : sabía (je savais) / supe (j'ai appris).",
          "conocer : conocía (je connaissais) / conocí (j'ai fait la connaissance de).",
          "querer : quería (je voulais) / quise (j'ai voulu, j'ai essayé) ; no quise (j'ai refusé)."
        ]
      }
    ],
    examples: [
      { target: "Cuando era niño, vivía en Lyon y jugaba al fútbol.", translation: "Quand j'étais enfant, j'habitais à Lyon et je jouais au football.", note: "habitude et état : imperfecto." },
      { target: "Llovía mucho cuando llegué a casa.", translation: "Il pleuvait beaucoup quand je suis arrivé à la maison.", note: "décor (llovía) / événement (llegué)." },
      { target: "Eran las ocho y Ana todavía dormía.", translation: "Il était huit heures et Ana dormait encore.", note: "heure et action en cours." }
    ],
    pitfalls: [
      "Utiliser l'indefinido pour décrire le décor : on dit Hacía sol et Había mucha gente ; Hizo sol reste correct pour résumer une période close (Ayer hizo sol todo el día).",
      "Dire « ibamos » sans accent : íbamos.",
      "Traduire tous les passés par un seul temps : l'espagnol exige de choisir entre action et décor."
    ],
    skills: ["imperfect", "preterite"]
  },
  {
    id: "es-r-preterito-perfecto",
    level: "B1",
    group: "Verbes et temps",
    order: 24,
    title: "Le pretérito perfecto (he hablado)",
    summary: "Le pretérito perfecto (haber + participe) relie un fait passé au présent : il s'emploie avec hoy, esta semana, ya, todavía no, nunca.",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Personne", "haber", "+ participe (-ado / -ido)"],
          rows: [
            ["yo", "he", "hablado, comido, vivido"],
            ["tú", "has", "hablado…"],
            ["él / ella / usted", "ha", "hablado…"],
            ["nosotros", "hemos", "hablado…"],
            ["vosotros", "habéis", "hablado…"],
            ["ellos / ustedes", "han", "hablado…"]
          ]
        }
      },
      {
        heading: "Participes irréguliers",
        table: {
          head: ["Infinitif", "Participe"],
          rows: [
            ["hacer", "hecho"],
            ["decir", "dicho"],
            ["ver", "visto"],
            ["escribir", "escrito"],
            ["poner", "puesto"],
            ["volver", "vuelto"],
            ["abrir", "abierto"],
            ["romper", "roto"],
            ["morir", "muerto"],
            ["cubrir", "cubierto"]
          ]
        }
      },
      {
        heading: "Quand l'employer ?",
        points: [
          "Période non terminée : hoy, esta mañana, esta semana, este año, últimamente.",
          "Expérience : ¿Has estado en Perú? Nunca he comido paella. Alguna vez, siempre.",
          "Ya / todavía no : Ya he terminado ; Todavía no he comido.",
          "Le participe est invariable avec haber et rien ne s'intercale : No lo he visto.",
          "En Amérique latine, l'indefinido remplace souvent le perfecto : Hoy comí temprano."
        ]
      },
      {
        heading: "Différence avec le français",
        text: "Le passé composé français sert pour tout passé fini ; en espagnol, Ayer comí (indefinido) et Hoy he comido (perfecto). Choisissez selon la période de temps, pas la traduction."
      }
    ],
    examples: [
      { target: "Esta mañana he hablado con el director.", translation: "Ce matin j'ai parlé avec le directeur.", note: "esta mañana → perfecto." },
      { target: "Nunca he visto una película tan larga.", translation: "Je n'ai jamais vu un film aussi long.", note: "nunca + perfecto : expérience." },
      { target: "Todavía no he escrito el informe.", translation: "Je n'ai pas encore écrit le rapport.", note: "participe irrégulier escrito." }
    ],
    pitfalls: [
      "Utiliser le perfecto avec ayer ou el año pasado : « Ayer he comido » est incorrect en Espagne (ayer comí).",
      "Dire « he escribido » : escrito.",
      "Placer un pronom entre he et le participe : on dit Lo he hecho."
    ],
    skills: ["preterite", "duration"]
  },
  {
    id: "es-r-futur-condicional",
    level: "B1",
    group: "Verbes et temps",
    order: 25,
    title: "Le futur simple et le condicional",
    summary: "Futur et conditionnel se forment sur l'infinitif (+ é, ás… ou + ía, ías…) avec quelques radicaux irréguliers communs aux deux temps.",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Personne", "Futur (hablar)", "Condicional (hablar)"],
          rows: [
            ["yo", "hablaré", "hablaría"],
            ["tú", "hablarás", "hablarías"],
            ["él / ella / usted", "hablará", "hablaría"],
            ["nosotros", "hablaremos", "hablaríamos"],
            ["vosotros", "hablaréis", "hablaríais"],
            ["ellos / ustedes", "hablarán", "hablarían"]
          ]
        }
      },
      {
        heading: "Radicaux irréguliers (communs aux deux temps)",
        table: {
          head: ["Infinitif", "Radical", "Exemple futur"],
          rows: [
            ["tener", "tendr-", "tendré"],
            ["venir", "vendr-", "vendré"],
            ["poder", "podr-", "podré"],
            ["querer", "querr-", "querré"],
            ["saber", "sabr-", "sabré"],
            ["haber", "habr-", "habrá"],
            ["poner", "pondr-", "pondré"],
            ["salir", "saldr-", "saldré"],
            ["hacer", "har-", "haré"],
            ["decir", "dir-", "diré"]
          ]
        }
      },
      {
        heading: "Emplois",
        points: [
          "Futur : événement futur, promesse, prévision (Mañana lloverá) ; à l'oral on préfère ir a + infinitif.",
          "Futur de probabilité : Serán las tres. (Il doit être trois heures.)",
          "Condicional de politesse : ¿Podría ayudarme? Me gustaría un café.",
          "Condicional de conseil : Deberías descansar.",
          "Hypothèse : Si tuviera tiempo, viajaría. ; futur dans le passé : Dijo que vendría."
        ]
      }
    ],
    examples: [
      { target: "El año que viene viviré en Madrid.", translation: "L'année prochaine j'habiterai à Madrid.", note: "futur en -é." },
      { target: "¿Podría darme su dirección, por favor?", translation: "Pourriez-vous me donner votre adresse, s'il vous plaît ?", note: "condicional de politesse." },
      { target: "Dijo que vendría a las ocho.", translation: "Il a dit qu'il viendrait à huit heures.", note: "vendría : futur dans le passé." }
    ],
    pitfalls: [
      "Oublier le radical irrégulier : « tenerá » → tendrá.",
      "Utiliser le futur après si : Si lloverá… → Si llueve.",
      "Employer quiero pour demander poliment : préférez quisiera, me gustaría, ¿podría…?"
    ],
    skills: ["polite-requests", "pluperfect-conditional"]
  },
  {
    id: "es-r-imperatif",
    level: "B1",
    group: "Verbes et temps",
    order: 26,
    title: "L'impératif",
    summary: "L'impératif affirmatif de tú reprend la 3e personne du présent ; la forme négative et usted utilisent le subjonctif présent.",
    sections: [
      {
        heading: "Formes",
        table: {
          head: ["", "hablar", "comer", "escribir"],
          rows: [
            ["tú (affirmatif)", "habla", "come", "escribe"],
            ["tú (négatif)", "no hables", "no comas", "no escribas"],
            ["usted", "hable", "coma", "escriba"],
            ["nosotros", "hablemos", "comamos", "escribamos"],
            ["vosotros (affirmatif)", "hablad", "comed", "escribid"],
            ["ustedes", "hablen", "coman", "escriban"]
          ]
        }
      },
      {
        heading: "Tú irréguliers (affirmatif)",
        table: {
          head: ["Infinitif", "tú", "Exemple"],
          rows: [
            ["decir", "di", "Dime la verdad."],
            ["hacer", "haz", "Haz los deberes."],
            ["ir", "ve", "Ve a casa."],
            ["venir", "ven", "Ven aquí."],
            ["poner", "pon", "Pon la mesa."],
            ["salir", "sal", "Sal ahora."],
            ["ser", "sé", "Sé amable."],
            ["tener", "ten", "Ten cuidado."]
          ]
        }
      },
      {
        heading: "Pronoms et accents",
        points: [
          "Affirmatif : pronoms attachés (Dímelo, Siéntate, Levántate) ; accent écrit pour garder la syllabe tonique.",
          "Négatif : pronoms devant le verbe (No me lo digas, No te sientes).",
          "Vosotros pronominal : levantaos, sentaos (le -d tombe), mais idos.",
          "Nosotros : Vamos a + infinitif ou subjonctif : Hablemos."
        ]
      }
    ],
    examples: [
      { target: "Abre la ventana, por favor.", translation: "Ouvre la fenêtre, s'il te plaît.", note: "tú : abre (= 3e personne)." },
      { target: "No hables tan rápido.", translation: "Ne parle pas si vite.", note: "négatif : subjonctif hables." },
      { target: "Siéntese, por favor.", translation: "Asseyez-vous, je vous prie.", note: "usted + pronom attaché + accent." }
    ],
    pitfalls: [
      "Dire « no habla » pour interdire : la forme est no hables.",
      "Oublier l'accent quand le pronom déplace la syllabe tonique : dímelo, siéntese (mais dime sans accent).",
      "Employer l'infinitif à la place de l'impératif de vosotros à l'oral soigné."
    ],
    skills: ["polite-requests", "object-pronouns"]
  },
  {
    id: "es-r-subjonctif-introduction",
    level: "B2",
    group: "Verbes et temps",
    order: 27,
    title: "Le subjonctif présent (introduction)",
    summary: "Le subjonctif exprime le souhait, le doute, l'émotion et ce qui n'est pas certain ; il se forme à partir de la 1re personne du présent en inversant la voyelle (-ar → e, -er/-ir → a).",
    sections: [
      {
        heading: "Formation",
        table: {
          head: ["Personne", "hablar", "comer", "escribir"],
          rows: [
            ["yo", "hable", "coma", "escriba"],
            ["tú", "hables", "comas", "escribas"],
            ["él / ella / usted", "hable", "coma", "escriba"],
            ["nosotros", "hablemos", "comamos", "escribamos"],
            ["vosotros", "habléis", "comáis", "escribáis"],
            ["ellos / ustedes", "hablen", "coman", "escriban"]
          ]
        }
      },
      {
        heading: "Irréguliers principaux",
        points: [
          "Radical de la 1re personne : tengo → tenga, hago → haga, digo → diga, salgo → salga, vengo → venga, pongo → ponga.",
          "Totalement irréguliers : ser → sea, estar → esté, ir → vaya, saber → sepa, haber → haya, dar → dé.",
          "Diphtongue conservée : quiero → quiera, puedo → pueda, mais nosotros : queramos, podamos, durmamos.",
          "Orthographe : buscar → busque, llegar → llegue, empezar → empiece."
        ]
      },
      {
        heading: "Déclencheurs (avec changement de sujet)",
        table: {
          head: ["Idée", "Exemple"],
          rows: [
            ["volonté, ordre, conseil", "Quiero que vengas. Te recomiendo que descanses."],
            ["émotion", "Me alegro de que estés aquí."],
            ["doute, négation de certitude", "Dudo que sea verdad. No creo que venga."],
            ["jugement impersonnel", "Es importante que llegues a tiempo."],
            ["but, restriction", "para que, antes de que, a menos que, sin que"],
            ["futur après cuando", "Cuando llegues, llámame."]
          ]
        }
      },
      {
        heading: "Indicatif ou subjonctif ?",
        text: "Avec une certitude, on garde l'indicatif : Creo que viene. Avec un même sujet, on emploie l'infinitif : Quiero venir (et non « quiero que yo venga »)."
      }
    ],
    examples: [
      { target: "Quiero que vengas conmigo.", translation: "Je veux que tu viennes avec moi.", note: "querer que + subjonctif (sujets différents)." },
      { target: "Es importante que bebas agua.", translation: "Il est important que tu boives de l'eau.", note: "jugement impersonnel." },
      { target: "Cuando llegues, llámame.", translation: "Quand tu arriveras, appelle-moi.", note: "cuando + subjonctif pour un futur." }
    ],
    pitfalls: [
      "Employer l'infinitif quand le sujet change : « Quiero que venir » est faux.",
      "Mettre le subjonctif après creer que affirmatif : Creo que viene.",
      "Oublier l'accord orthographique : « llege » → llegue."
    ],
    skills: ["subjunctive"]
  },
  {
    id: "es-r-formation-mots",
    level: "A2",
    group: "Vocabulaire",
    order: 28,
    title: "Formation des mots : suffixes et cognats français",
    summary: "Beaucoup de mots français ont un équivalent espagnol prévisible : -tion → -ción, -té → -dad, -ment → -mente, -eux → -oso.",
    sections: [
      {
        heading: "Correspondances français → espagnol",
        table: {
          head: ["Français", "Espagnol", "Exemple"],
          rows: [
            ["-tion", "-ción (féminin)", "information → la información"],
            ["-sion", "-sión (féminin)", "décision → la decisión"],
            ["-té", "-dad (féminin)", "université → la universidad ; réalité → la realidad"],
            ["-ment (adverbe)", "-mente", "rapidement → rápidamente"],
            ["-eux", "-oso", "nerveux → nervioso, fameux → famoso"],
            ["-ique", "-ico", "historique → histórico"],
            ["-if / -ive", "-ivo / -iva", "actif → activo"],
            ["-ence / -ance", "-encia / -ancia", "différence → la diferencia"],
            ["-eur (agent)", "-or / -dor", "directeur → director ; travailleur → trabajador"],
            ["-ure", "-ura", "culture → la cultura"],
            ["-isme / -iste", "-ismo / -ista", "optimisme → optimismo ; dentiste → dentista"]
          ]
        }
      },
      {
        heading: "Adverbes en -mente",
        text: "On part de l'adjectif au féminin singulier : rápido → rápidamente, lento → lentamente, fácil → fácilmente (l'accent est conservé). Avec plusieurs adverbes, seul le dernier prend -mente : lenta y cuidadosamente."
      },
      {
        heading: "Autres suffixes utiles",
        table: {
          head: ["Suffixe", "Rôle", "Exemple"],
          rows: [
            ["-ero / -era", "métier, commerçant", "enfermero, camarero"],
            ["-ería", "commerce", "panadería, librería, frutería"],
            ["-ito / -ita", "diminutif, affectif", "casita, un momentito"],
            ["-azo", "augmentatif / coup", "golpazo, perrazo"],
            ["des- / in- / re-", "contraire, négation, répétition", "deshacer, imposible, rehacer"]
          ]
        }
      },
      {
        heading: "Autres adaptations de l'orthographe",
        points: [
          "ph → f : farmacia, fotografía ; th → t : teatro, teoría ; ch → qu : química, esquizofrenia.",
          "Doubles consonnes simplifiées : comisión (commission), adición (addition), aplicar (appliquer).",
          "Vocabulaire médical très proche : inflamación, infección, enfermedad, síntoma, diagnóstico."
        ]
      }
    ],
    examples: [
      { target: "La información es importante para la comunidad.", translation: "L'information est importante pour la communauté.", note: "-ción / -dad : féminin." },
      { target: "El paciente habla lentamente y está nervioso.", translation: "Le patient parle lentement et est nerveux.", note: "lento → lentamente ; nerveux → nervioso." },
      { target: "En la farmacia trabaja un enfermero muy activo.", translation: "À la pharmacie travaille un infirmier très actif.", note: "ph → f ; -if → -ivo." }
    ],
    pitfalls: [
      "Appliquer la règle à tous les mots sans vérifier : certains mots semblent proches mais ont un sens différent (voir la fiche faux amis).",
      "Dire « rapidemente » : on part du féminin (rápidamente).",
      "Donner le mauvais genre : les mots en -ción et -dad sont féminins."
    ],
    skills: ["everyday-vocabulary", "health-vocabulary"]
  },
  {
    id: "es-r-faux-amis",
    level: "B1",
    group: "Vocabulaire",
    order: 29,
    title: "Faux amis français-espagnol",
    summary: "Certains mots espagnols ressemblent à des mots français mais ont un autre sens : embarazada n'est pas « embarrassée », constipado n'est pas « constipé ».",
    sections: [
      {
        heading: "Pièges fréquents",
        table: {
          head: ["Espagnol", "Vrai sens", "Piège (français) → bon mot espagnol"],
          rows: [
            ["embarazada", "enceinte", "embarrassée → avergonzada, incómoda"],
            ["constipado", "enrhumé", "constipé → estreñido"],
            ["largo", "long", "large → ancho"],
            ["librería", "librairie", "bibliothèque → biblioteca"],
            ["ropa", "vêtements", "robe → vestido"],
            ["asistir a", "assister à (être présent)", "assister quelqu'un → ayudar"],
            ["éxito", "succès", "sortie → salida"],
            ["atender", "s'occuper de, recevoir", "attendre → esperar"],
            ["demandar", "poursuivre en justice", "demander → pedir, preguntar"],
            ["pretender", "chercher à, vouloir", "prétendre (affirmer) → afirmar, sostener"],
            ["burro", "âne", "beurre → mantequilla"],
            ["rato", "moment", "rat → rata"]
          ]
        }
      },
      {
        heading: "Pedir, preguntar, demandar",
        points: [
          "pedir : demander quelque chose (Pido un café).",
          "preguntar : poser une question (Pregunto la hora).",
          "demandar : poursuivre en justice."
        ]
      },
      {
        heading: "Méthode",
        text: "Quand un mot espagnol « ressemble trop » au français, vérifiez-le. Pour un contexte médical (patient, ordonnance), la confusion peut être embarrassante ou dangereuse."
      }
    ],
    examples: [
      { target: "Mi hermana está embarazada de seis meses.", translation: "Ma sœur est enceinte de six mois.", note: "embarazada = enceinte." },
      { target: "Estoy constipado y tengo tos.", translation: "Je suis enrhumé et j'ai de la toux.", note: "constipado = enrhumé ; pas de constipation." },
      { target: "La camisa es larga; necesito una más ancha.", translation: "La chemise est longue ; il m'en faut une plus large.", note: "largo = long ; ancho = large." }
    ],
    pitfalls: [
      "Dire « estoy embarazada » pour « je suis embarrassée ».",
      "Dire « una calle larga » pour une rue large : larga = longue, une rue large est ancha.",
      "Traduire attendre par atender : esperar."
    ],
    skills: ["everyday-vocabulary", "health-vocabulary"]
  },
  {
    id: "es-r-genre-difficile",
    level: "B1",
    group: "Genre et articles",
    order: 30,
    title: "Genre difficile : el agua, el problema, la mano",
    summary: "Certains noms ont un genre inattendu : el agua (féminin avec el), el problema (masculin en -ma), la mano (féminin en -o), et quelques mots changent de sens selon l'article.",
    sections: [
      {
        heading: "El agua : féminin avec article masculin",
        text: "Les noms féminins qui commencent par un a- ou ha- accentué prennent el au singulier pour éviter « la a » : el agua, el águila, el hacha, el alma, el hambre. L'adjectif reste féminin : el agua fría ; au pluriel : las aguas. Avec mucho/poco : mucha hambre, poca agua."
      },
      {
        heading: "Noms en -ma masculins (origine grecque)",
        table: {
          head: ["Masculin (grec)", "Féminin (latin)"],
          rows: [
            ["el problema, el tema, el sistema", "la cama, la crema"],
            ["el programa, el idioma, el poema", "la forma, la rama"],
            ["el síntoma, el diagrama, el clima", "la lágrima, la fama"]
          ]
        }
      },
      {
        heading: "Autres exceptions de genre",
        points: [
          "Féminins en -o : la mano, la foto, la moto, la radio.",
          "Masculins en -a : el día, el mapa, el planeta, el programa, el idioma.",
          "Masculins en -ión : el avión, el camión, el sarampión (rougeole).",
          "Noms de métier à une seule forme : el / la dentista, periodista, estudiante, cliente, pianista.",
          "Féminin du métier : el médico / la médica (ou la médico), el presidente / la presidenta."
        ]
      },
      {
        heading: "Un mot, deux genres, deux sens",
        table: {
          head: ["Masculin", "Féminin"],
          rows: [
            ["el capital (l'argent)", "la capital (la ville)"],
            ["el cura (le prêtre)", "la cura (le traitement)"],
            ["el orden (la mise en ordre)", "la orden (l'ordre donné)"],
            ["el cólera (la maladie)", "la cólera (la colère)"],
            ["el frente (le front)", "la frente (le front du visage)"],
            ["el policía (l'agent)", "la policía (la police)"],
            ["el guía (le guide, personne)", "la guía (le guide, livre)"]
          ]
        }
      }
    ],
    examples: [
      { target: "El agua está muy fría y las aguas del río son claras.", translation: "L'eau est très froide et les eaux de la rivière sont claires.", note: "el agua fría ; las aguas." },
      { target: "Tengo mucha hambre y me duele la mano.", translation: "J'ai très faim et ma main me fait mal.", note: "hambre féminin ; la mano." },
      { target: "El problema es un síntoma del sistema.", translation: "Le problème est un symptôme du système.", note: "-ma grecs : masculins." }
    ],
    pitfalls: [
      "Dire « el agua frío » : l'adjectif reste féminin (fría).",
      "Dire « la problema » ou « la idioma » par analogie avec -a.",
      "Dire « el mano » : la mano est féminin même en -o."
    ],
    skills: ["articles-gender"]
  }
];

export const ES_RULES: GrammarRule[] = RULES.map((rule) => ({ language: "es" as const, ...rule }));
