import type { CefrLevel } from "../../types.js";
import type { TopicExercise } from "../types.js";

/** Exercices de grammaire complémentaires, liés aux fiches de règles (24/10/2026). */
interface Row {
  level: CefrLevel;
  type: "multiple-choice" | "fill-gap" | "translation";
  skills: string[];
  focus: string;
  prompt: string;
  choices?: string[];
  answer: string;
  accepted?: string[];
  explanation: string;
  hint: string;
}

const mc = (level: CefrLevel, skills: string[], focus: string, prompt: string, choices: string[], answer: string, explanation: string, hint: string): Row =>
  ({ level, type: "multiple-choice", skills, focus, prompt, choices, answer, explanation, hint });
const fg = (level: CefrLevel, skills: string[], focus: string, prompt: string, answer: string, explanation: string, hint: string): Row =>
  ({ level, type: "fill-gap", skills, focus, prompt, answer, explanation, hint });
const tr = (level: CefrLevel, skills: string[], focus: string, prompt: string, answer: string, accepted: string[], explanation: string, hint: string): Row =>
  ({ level, type: "translation", skills, focus, prompt, answer, accepted, explanation, hint });

const ROWS: Row[] = [
  // A1 (40) : genre et articles
  mc("A1", ["articles-gender"], "Article masculin", "Complétez : ___ libro está en la mesa.", ["El", "La", "Los", "Las"], "El", "Libro est masculin singulier : el libro.", "Les noms en -o sont souvent masculins."),
  mc("A1", ["articles-gender"], "Article indéfini féminin", "Complétez : Tengo ___ amiga española.", ["una", "un", "unos", "el"], "una", "Amiga est féminin singulier : una amiga.", "Un nom en -a, au singulier."),
  mc("A1", ["articles-gender"], "Genre en -dad", "Complétez : ___ ciudad es muy bonita.", ["La", "El", "Los", "Las"], "La", "Les noms en -dad sont féminins : la ciudad.", "Terminaison -dad."),
  fg("A1", ["articles-gender"], "Un ou una", "Complétez : Mi vecino tiene ___ perro grande. (un ou una ?)", "un", "Perro est masculin : un perro.", "Masculin singulier."),
  mc("A1", ["articles-gender"], "Pluriel en -z", "Quel est le pluriel de « el lápiz » ?", ["los lápices", "los lápizes", "las lápices", "los lápiz"], "los lápices", "Le z devient c devant -es : lápiz → lápices.", "z → c."),
  mc("A1", ["articles-gender"], "Pluriel et accent", "Quel est le pluriel de « la canción » ?", ["las canciones", "las canciónes", "los canciones", "las canciónos"], "las canciones", "Au pluriel, l'accent disparaît : canción → canciones.", "Plus d'accent."),
  fg("A1", ["articles-gender"], "La mano", "Complétez : ___ manos están frías. (article défini, majuscule)", "Las", "Mano est féminin (la mano) : las manos.", "Féminin pluriel."),
  tr("A1", ["articles-gender"], "Garçon et fille", "Traduisez : Le garçon et la fille.", "El chico y la chica.", ["El niño y la niña.", "El muchacho y la muchacha."], "Chico/chica ou niño/niña : article el / la.", "Masculin, féminin."),
  // adjectifs (6)
  mc("A1", ["articles-gender"], "Accord de l'adjectif", "Complétez : La casa es ___.", ["blanca", "blanco", "blancas", "blancos"], "blanca", "Casa est féminin singulier : l'adjectif devient blanca.", "Féminin singulier."),
  mc("A1", ["articles-gender"], "Accord au pluriel", "Complétez : Mis amigos son ___. (simpático)", ["simpáticos", "simpático", "simpáticas", "simpática"], "simpáticos", "Amigos est masculin pluriel : simpáticos.", "Masculin pluriel."),
  fg("A1", ["articles-gender"], "Accord de l'adjectif", "Complétez : Las chicas son muy ___. (alto)", "altas", "Chicas est féminin pluriel : altas.", "Féminin pluriel."),
  mc("A1", ["articles-gender"], "Adjectif invariable en genre", "Complétez : Es un coche ___.", ["grande", "grando", "granda", "grandes"], "grande", "Les adjectifs en -e ont la même forme au masculin et au féminin : grande.", "Terminaison -e."),
  mc("A1", ["articles-gender"], "Adjectif au pluriel", "Complétez : Tengo dos hermanas ___. (inteligente)", ["inteligentes", "inteligente", "inteligentas", "inteligentos"], "inteligentes", "Un adjectif en -e prend -s au pluriel : inteligentes.", "Pluriel : +s."),
  mc("A1", ["sentence-building", "articles-gender"], "Place de l'adjectif", "Quelle phrase est correcte ?", ["Tengo un perro negro.", "Tengo un negro perro.", "Tengo negro un perro.", "Tengo un perro negra."], "Tengo un perro negro.", "La couleur se place après le nom et s'accorde avec lui.", "La couleur suit le nom."),
  // ser / estar (4)
  mc("A1", ["ser-estar"], "Ser : origine", "Complétez : Mi padre ___ de Lyon.", ["es", "está", "hay", "son"], "es", "L'origine se dit avec ser : es de Lyon.", "Origine."),
  mc("A1", ["ser-estar"], "Estar : état", "Complétez : Hoy ___ muy contento.", ["estoy", "soy", "tengo", "hay"], "estoy", "Un état d'âme du moment se dit avec estar.", "État passager."),
  fg("A1", ["ser-estar"], "Ser, vosotros", "Complétez : Vosotros ___ médicos. (ser)", "sois", "Ser avec vosotros : sois (profession : ser).", "Soy, eres, es, somos…"),
  tr("A1", ["ser-estar", "introductions"], "Profession", "Traduisez : Je suis médecin.", "Soy médico.", ["Yo soy médico.", "Soy médica.", "Yo soy médica."], "La profession se dit avec ser, sans article.", "Pas d'article."),
  // présent (8)
  fg("A1", ["present-tense"], "Présent en -ar", "Complétez : Nosotros ___ el desayuno a las ocho. (tomar)", "tomamos", "Nosotros des verbes en -ar : -amos.", "Terminaison de nosotros."),
  fg("A1", ["present-tense"], "Présent en -ir", "Complétez : Ellas ___ una carta. (escribir)", "escriben", "Ellas : -en pour les verbes en -er et -ir.", "Troisième personne du pluriel."),
  mc("A1", ["present-tense"], "Présent en -ir", "Complétez : Tú ___ la puerta. (abrir)", ["abres", "abre", "abro", "abras"], "abres", "Tú des verbes en -ir : -es.", "Racine abr-."),
  fg("A1", ["present-tense"], "Beber", "Complétez : Yo ___ mucha agua. (beber)", "bebo", "Yo des verbes en -er : -o.", "Racine beb-."),
  mc("A1", ["present-tense"], "Ver : yo", "Complétez : Yo ___ la televisión. (ver)", ["veo", "vo", "vea", "ve"], "veo", "Ver fait veo à la 1re personne.", "Veo, ves, ve…"),
  mc("A1", ["present-tense"], "Saber : yo", "Complétez : Yo no ___ la respuesta. (saber)", ["sé", "sabo", "sepo", "se"], "sé", "Saber fait sé à la 1re personne (avec accent).", "Forme très irrégulière."),
  fg("A1", ["present-tense"], "Conocer : yo", "Complétez : Yo ___ a tu madre. (conocer)", "conozco", "Conocer fait conozco à la 1re personne.", "Conoz-co."),
  fg("A1", ["present-tense"], "Dormir", "Complétez : Yo ___ ocho horas. (dormir)", "duermo", "Dormir change o en ue : duermo.", "o → ue."),
  mc("A1", ["present-tense"], "Volver : nosotros", "Complétez : Nosotros ___ a casa. (volver)", ["volvemos", "vuelvemos", "volvamos", "vuelven"], "volvemos", "À nosotros, le radical ne change pas : volvemos.", "Pas de diphtongue."),
  // gustar (3)
  mc("A1", ["object-pronouns"], "Gustar : pronom", "Complétez : ___ gusta el té. (à moi)", ["Me", "Yo", "Mi", "Mí"], "Me", "Gustar s'utilise avec un pronom complément : me gusta.", "Pronom d'objet."),
  mc("A1", ["object-pronouns"], "Gustar : nosotros", "Complétez : A nosotros ___ gustan las películas.", ["nos", "nosotros", "les", "se"], "nos", "Le pronom correspondant à nosotros est nos.", "Pluriel : gustan."),
  tr("A1", ["object-pronouns"], "J'aime", "Traduisez : J'aime le chocolat.", "Me gusta el chocolate.", ["A mí me gusta el chocolate."], "Gustar s'accorde avec ce qui plaît (el chocolate : singulier).", "Me gusta + nom."),
  // nombres, interrogatifs, divers (11)
  mc("A1", ["numbers"], "Nombres", "Comment dit-on 30 en espagnol ?", ["treinta", "trece", "tres", "tercero"], "treinta", "30 = treinta.", "Dizaine."),
  fg("A1", ["numbers"], "Nombres", "Complétez : 21 en lettres : ___", "veintiuno", "21 = veintiuno, en un seul mot.", "Veinti + uno."),
  mc("A1", ["numbers"], "Nombres", "Comment dit-on 70 en espagnol ?", ["setenta", "sesenta", "siete", "setecientos"], "setenta", "70 = setenta.", "Pas de calcul."),
  mc("A1", ["sentence-building", "introductions"], "Interrogatif", "Complétez : ¿___ te llamas?", ["Cómo", "Qué", "Cuál", "Dónde"], "Cómo", "¿Cómo te llamas? signifie « Comment t'appelles-tu ? ».", "Comment."),
  mc("A1", ["sentence-building", "introductions"], "Combien", "Complétez : ¿___ años tienes?", ["Cuántos", "Cuántas", "Cuánto", "Qué"], "Cuántos", "Años est masculin pluriel : cuántos.", "Accord."),
  mc("A1", ["present-tense", "obligation"], "Hay", "Complétez : Hay ___ libros en la mesa.", ["tres", "tercero", "tercer", "tercera"], "tres", "Hay + nombre cardinal : hay tres libros.", "Nombre cardinal."),
  tr("A1", ["location"], "Il y a", "Traduisez : Il y a un problème.", "Hay un problema.", ["Hay un problema"], "Hay (invariable) = il y a ; problema est masculin.", "Hay."),
  mc("A1", ["location"], "Hay ou está", "Complétez : En mi barrio ___ una farmacia.", ["hay", "está", "es", "son"], "hay", "Une pharmacie indéfinie : hay.", "Indéfini."),
  fg("A1", ["present-tense"], "Tener au présent", "Complétez : Nosotros ___ sed. (tener)", "tenemos", "Tener : tenemos pour nosotros.", "Tener, tengo, tienes…"),
  mc("A1", ["articles-gender"], "Possessif", "Complétez : Esta es ___ casa. (notre)", ["nuestra", "nuestro", "nuestras", "nosotros"], "nuestra", "Nuestra s'accorde avec casa (féminin singulier).", "Accord avec la chose."),
  // A2 (15)
  mc("A2", ["articles-gender"], "Genre des noms en -a", "Complétez : ___ mapa está en la pared.", ["El", "La", "Los", "Las"], "El", "Mapa est masculin (comme día, planeta).", "Exception en -a."),
  mc("A2", ["articles-gender"], "Genre en -a masculin", "Complétez : ___ día es largo.", ["El", "La", "Los", "Las"], "El", "Día est masculin malgré le -a final.", "Exception à retenir."),
  mc("A2", ["everyday-vocabulary"], "Para : employeur", "Complétez : Trabajo ___ una empresa grande.", ["para", "por", "de", "sobre"], "para", "Trabajar para + employeur.", "Pour une entreprise."),
  mc("A2", ["everyday-vocabulary"], "Por : passage", "Complétez : Pasamos ___ el centro de la ciudad.", ["por", "para", "en", "a"], "por", "Por indique le lieu de passage : à travers le centre.", "À travers."),
  mc("A2", ["everyday-vocabulary"], "Por : moyen", "Complétez : Hablamos ___ teléfono.", ["por", "para", "con", "de"], "por", "Le moyen de communication se dit avec por.", "Moyen."),
  mc("A2", ["object-pronouns"], "COI", "Complétez : ___ doy el regalo a mi madre.", ["Le", "Lo", "La", "Me"], "Le", "À ma mère = COI : le.", "À quelqu'un."),
  fg("A2", ["object-pronouns"], "COD pluriel", "Complétez : ¿Los niños? ___ veo en el parque. (pronom)", "Los", "Los niños est COD masculin pluriel : los.", "Pronom COD."),
  mc("A2", ["object-pronouns"], "Place du pronom", "Quelle phrase est correcte ?", ["Quiero comprarlo.", "Quiero lo comprar.", "Lo quiero comprarlo.", "Quiero comprar lo."], "Quiero comprarlo.", "Le pronom s'attache à l'infinitif (ou précède quiero).", "Pronom attaché."),
  fg("A2", ["present-tense", "everyday-vocabulary"], "Pronominal", "Complétez : Yo ___ levanto a las siete. (pronom)", "me", "Levantarse : me levanto.", "Pronom de la 1re personne."),
  mc("A2", ["present-tense", "introductions"], "Se llama", "Complétez : Ella ___ llama Ana.", ["se", "me", "te", "le"], "se", "Llamarse : ella se llama.", "Pronom de la 3e personne."),
  fg("A2", ["preterite"], "Ver au prétérit", "Complétez : Ayer ellos ___ la película. (ver)", "vieron", "Ver au prétérit : vi, viste, vio, vimos, visteis, vieron.", "Ellos."),
  fg("A2", ["preterite"], "Estar au prétérit", "Complétez : Ayer yo ___ en el hospital. (estar)", "estuve", "Estar au prétérit : estuve.", "Radical estuv-."),
  mc("A2", ["imperfect"], "Imparfait d'habitude", "Complétez : De niña, ella siempre ___ en el jardín. (jugar)", ["jugaba", "jugó", "juega", "jugará"], "jugaba", "Siempre + passé = habitude : imparfait.", "Habitude."),
  fg("A2", ["obligation", "present-tense"], "Tener que", "Complétez : Ellos ___ que salir. (tener)", "tienen", "Tener que + infinitif ; ellos : tienen.", "Tener : e → ie."),
  mc("A2", ["location", "articles-gender"], "Démonstratif éloigné", "Complétez : ___ chicas de allí son mis primas.", ["Aquellas", "Aquellos", "Aquella", "Aquel"], "Aquellas", "De allí = loin : aquellas, féminin pluriel.", "Loin, féminin."),
  // B1 (15)
  mc("B1", ["imperfect"], "Imparfait en cours", "Complétez : Cuando llegué, todos ya ___. (dormir)", ["dormían", "durmieron", "duermen", "dormirán"], "dormían", "Action en cours dans le passé : imparfait.", "Décor."),
  fg("B1", ["preterite", "present-tense"], "Prétérit pronominal", "Complétez : Ayer yo ___ a las ocho. (levantarse)", "me levanté", "Levantarse au prétérit : me levanté.", "Pronom + prétérit."),
  fg("B1", ["preterite"], "Decir au prétérit", "Complétez : Ayer ellos ___ la verdad. (decir)", "dijeron", "Decir au prétérit : dije, dijiste, dijo, dijimos, dijisteis, dijeron.", "Radical dij-."),
  mc("B1", ["preterite"], "Poder au prétérit", "Complétez : Ayer por fin ___ hablar con él. (poder)", ["pude", "podía", "puedo", "podré"], "pude", "Por fin + événement ponctuel : prétérit (pude).", "Événement."),
  fg("B1", ["preterite"], "Participe passé", "Complétez : Esta semana hemos ___ mucho. (trabajar)", "trabajado", "Haber + participe en -ado.", "Participe de trabajar."),
  fg("B1", ["preterite"], "Participe irrégulier", "Complétez : ¿Has ___ la carta? (escribir)", "escrito", "Escribir a un participe irrégulier : escrito.", "Pas escribido."),
  mc("B1", ["preterite", "duration"], "Perfecto", "Complétez : Todavía no ___ el informe. (yo, ver ; usage d'Espagne)", ["he visto", "vi", "veía", "veré"], "he visto", "Todavía no + perfecto : he visto.", "Participe de ver."),
  fg("B1", ["polite-requests"], "Futur simple", "Complétez : Mañana yo ___ a Madrid. (viajar, futur simple)", "viajaré", "Futur simple : infinitif + é.", "Infinitif + é."),
  fg("B1", ["polite-requests"], "Futur irrégulier", "Complétez : Ellos ___ mañana. (venir, futur simple)", "vendrán", "Venir au futur : radical vendr- + án.", "Radical vendr-."),
  mc("B1", ["pluperfect-conditional", "polite-requests"], "Conditionnel", "Complétez : Yo ___ contigo, pero no puedo. (ir)", ["iría", "iba", "iré", "vaya"], "iría", "Le désir irréel s'exprime au conditionnel : iría.", "Condicional."),
  fg("B1", ["polite-requests"], "Impératif tú", "Complétez : ¡___ la puerta, por favor! (tú, cerrar)", "Cierra", "L'impératif de tú reprend la 3e personne : cierra.", "e → ie."),
  mc("B1", ["polite-requests"], "Impératif négatif", "Complétez : No ___ eso, por favor. (tú, hacer)", ["hagas", "haces", "hace", "haz"], "hagas", "Impératif négatif : no + subjonctif (hagas).", "Subjonctif."),
  mc("B1", ["object-pronouns"], "Deux pronoms", "Complétez : ¿Me das el libro? — Sí, ___ doy ahora.", ["te lo", "se lo", "me lo", "lo te"], "te lo", "Je te le donne : te (COI) + lo (COD).", "COI avant COD."),
  mc("B1", ["subjunctive"], "Subjonctif après querer", "Complétez : Quiero que tú ___ conmigo. (venir)", ["vengas", "vienes", "vendrás", "venir"], "vengas", "Querer que + subjonctif.", "Subjonctif de venir."),
  tr("B1", ["object-pronouns", "preterite"], "Pronom COI au passé", "Traduisez : Elle m'a donné le livre.", "Ella me dio el libro.", ["Me dio el libro.", "Ella me ha dado el libro.", "Me ha dado el libro."], "Me (COI) devant le verbe ; dio (prétérit) ou ha dado.", "Pronom devant le verbe."),
  // B2 (10)
  mc("B2", ["pluperfect-conditional"], "Hypothèse", "Complétez : Si tuviera tiempo, ___ a verte.", ["iría", "iré", "iba", "vaya"], "iría", "Si + imparfait du subjonctif → conditionnel.", "Hypothèse."),
  mc("B2", ["subjunctive"], "Doute", "Complétez : Dudo que él ___ la verdad. (saber)", ["sepa", "sabe", "sabrá", "supo"], "sepa", "Dudar que + subjonctif : sepa.", "Subjonctif de saber."),
  fg("B2", ["subjunctive"], "Cuando + subjonctif", "Complétez : Cuando (yo) ___ a casa, te llamo. (llegar)", "llegue", "Cuando + futur → subjonctif : llegue.", "Orthographe gu."),
  mc("B2", ["pluperfect-conditional"], "Hypothèse passée", "Complétez : Si hubiera sabido, no ___.", ["habría venido", "vendría", "vine", "vendré"], "habría venido", "Hypothèse passée : conditionnel passé.", "Haber + participe."),
  mc("B2", ["subjunctive"], "Émotion", "Complétez : Es una lástima que no ___ venir. (poder, ellos)", ["puedan", "pueden", "podrán", "pudieron"], "puedan", "Es una lástima que + subjonctif.", "Subjonctif de poder."),
  mc("B2", ["subjunctive"], "Antécédent inconnu", "Complétez : Busco un médico que ___ alemán. (hablar)", ["hable", "habla", "hablará", "hablaba"], "hable", "Antécédent inconnu : subjonctif.", "Médecin non identifié."),
  mc("B2", ["health-vocabulary"], "Faux ami médical", "« Embarazada » signifie :", ["enceinte", "embarrassée", "empêchée", "enrouée"], "enceinte", "Embarazada = enceinte ; embarrassée = avergonzada.", "Faux ami."),
  fg("B2", ["everyday-vocabulary"], "Adverbe en -mente", "Formez l'adverbe : rápida → ___", "rápidamente", "Adjectif féminin + -mente.", "Féminin + mente."),
  mc("B2", ["articles-gender"], "El agua", "Choisissez la bonne phrase :", ["El agua fría", "El agua frío", "La agua fría", "El agua frías"], "El agua fría", "Agua est féminin mais prend el ; l'adjectif reste féminin.", "Féminin avec el."),
  mc("B2", ["everyday-vocabulary"], "Suffixe -dad", "Le suffixe -dad (universidad) correspond au français :", ["-té", "-tion", "-ment", "-eur"], "-té", "-dad = -té (universidad = université).", "Terminaison.")
];

export const ES_GRAMMAR_EXTRA: TopicExercise[] = ROWS.map((row, index) => ({
  id: `es-g-x-${String(index + 1).padStart(3, "0")}`,
  language: "es",
  level: row.level,
  topic: "grammar",
  type: row.type,
  skillTags: row.skills,
  prompt: row.prompt,
  ...(row.choices ? { choices: row.choices } : {}),
  answer: row.answer,
  ...(row.accepted ? { acceptedAnswers: row.accepted } : {}),
  explanation: row.explanation,
  hint: row.hint,
  focus: row.focus
}));
