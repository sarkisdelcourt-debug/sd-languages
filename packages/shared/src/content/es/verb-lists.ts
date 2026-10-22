import type { CefrLevel } from "../../types.js";
import type { ExerciseTopic, VocabSet } from "../types.js";

/**
 * Listes de verbes (22/10/2026).
 * ATTENTION : dans VocabItem, le champ `en` contient ici l'infinitif ESPAGNOL.
 */
const vocab = (
  id: string, topic: ExerciseTopic, level: CefrLevel, title: string, skill: string, items: Array<[string, string]>
): VocabSet => ({ id, topic, level, title, skill, items: items.map(([en, fr]) => ({ en, fr })) });

export const ES_VERB_SETS: VocabSet[] = [
  vocab("es-v-verbs-essentiels", "everyday", "A1", "Verbes : les indispensables", "everyday-vocabulary", [
    ["ser", "être"], ["estar", "être (lieu, état)"], ["haber", "avoir (auxiliaire)"], ["vivir", "vivre"], ["hablar", "parler"],
    ["comer", "manger"], ["beber", "boire"], ["gustar", "plaire"], ["llamarse", "s'appeler"], ["trabajar", "travailler"],
    ["estudiar", "étudier"], ["llevar", "porter"], ["dejar", "laisser"], ["ayudar", "aider"], ["parecer", "sembler"]
  ]),
  vocab("es-v-verbs-quotidien", "everyday", "A1", "Verbes : la vie quotidienne", "everyday-vocabulary", [
    ["levantarse", "se lever"], ["despertarse", "se réveiller"], ["ducharse", "se doucher"], ["vestirse", "s'habiller"], ["lavarse", "se laver"],
    ["desayunar", "prendre le petit-déjeuner"], ["cenar", "dîner"], ["descansar", "se reposer"], ["acostarse", "se coucher"], ["limpiar", "nettoyer"],
    ["abrir", "ouvrir"], ["cerrar", "fermer"], ["usar", "utiliser"], ["mirar", "regarder"], ["escuchar", "écouter"]
  ]),
  vocab("es-v-verbs-voyage", "travel", "A2", "Verbes : mouvement et voyage", "hotel-travel-vocabulary", [
    ["viajar", "voyager"], ["volar", "voler (en avion)"], ["caminar", "marcher"], ["subir", "monter"], ["bajar", "descendre"],
    ["entrar", "entrer"], ["regresar", "rentrer"], ["quedarse", "rester"], ["irse", "s'en aller"], ["alojarse", "loger"],
    ["reservar", "réserver"], ["visitar", "visiter"], ["recorrer", "parcourir"], ["despegar", "décoller"], ["aterrizar", "atterrir"]
  ]),
  vocab("es-v-verbs-communication", "everyday", "A2", "Verbes : communiquer", "everyday-vocabulary", [
    ["preguntar", "poser une question"], ["pedir", "demander"], ["contar", "raconter"], ["explicar", "expliquer"], ["llamar", "appeler"],
    ["escribir", "écrire"], ["discutir", "se disputer, débattre"], ["repetir", "répéter"], ["interrumpir", "interrompre"], ["avisar", "prévenir"],
    ["saludar", "saluer"], ["prometer", "promettre"], ["gritar", "crier"], ["mentir", "mentir"], ["agradecer", "remercier"]
  ]),
  vocab("es-v-verbs-pensee-emotion", "everyday", "B1", "Verbes : pensée et émotion", "everyday-vocabulary", [
    ["pensar", "penser"], ["creer", "croire"], ["recordar", "se souvenir"], ["olvidar", "oublier"], ["imaginar", "imaginer"],
    ["dudar", "douter"], ["sentir", "ressentir"], ["preocuparse", "s'inquiéter"], ["alegrarse", "se réjouir"], ["enfadarse", "se fâcher"],
    ["temer", "craindre"], ["soñar", "rêver"], ["odiar", "détester"], ["amar", "aimer"], ["sorprenderse", "s'étonner"]
  ]),
  vocab("es-v-verbs-travail", "everyday", "B1", "Verbes : le travail", "work-vocabulary", [
    ["contratar", "embaucher"], ["despedir", "licencier"], ["cobrar", "toucher (un salaire)"], ["ganar", "gagner"], ["jubilarse", "prendre sa retraite"],
    ["dirigir", "diriger"], ["organizar", "organiser"], ["entregar", "remettre"], ["firmar", "signer"], ["gestionar", "gérer"],
    ["solicitar", "postuler"], ["ascender", "être promu"], ["renunciar", "renoncer, démissionner"], ["atender", "s'occuper de (clients)"], ["reunirse", "se réunir"]
  ]),
  vocab("es-v-verbs-medecine", "medical", "B1", "Verbes : médecine et soin", "health-vocabulary", [
    ["doler", "avoir mal"], ["toser", "tousser"], ["sangrar", "saigner"], ["respirar", "respirer"], ["vomitar", "vomir"],
    ["tratar", "traiter"], ["recetar", "prescrire"], ["examinar", "examiner"], ["vendar", "bander"], ["vacunar", "vacciner"],
    ["diagnosticar", "diagnostiquer"], ["recuperarse", "se rétablir"], ["empeorar", "empirer"], ["desmayarse", "s'évanouir"], ["estornudar", "éternuer"]
  ]),
  vocab("es-v-verbs-diphtongue", "everyday", "A2", "Verbes : diphtongues et irréguliers", "everyday-vocabulary", [
    ["dormir", "dormir"], ["volver", "revenir"], ["encontrar", "trouver"], ["empezar", "commencer"], ["entender", "comprendre"],
    ["preferir", "préférer"], ["sentarse", "s'asseoir"], ["costar", "coûter"], ["mover", "bouger"], ["jugar", "jouer"],
    ["almorzar", "déjeuner"], ["devolver", "rendre"], ["probar", "essayer"], ["morir", "mourir"], ["conseguir", "obtenir"]
  ]),
  vocab("es-v-verbs-changement", "everyday", "B1", "Verbes : changement et résultat", "everyday-vocabulary", [
    ["cambiar", "changer"], ["crecer", "grandir"], ["aumentar", "augmenter"], ["disminuir", "diminuer"], ["mejorar", "améliorer"],
    ["lograr", "réussir"], ["fracasar", "échouer"], ["resultar", "s'avérer"], ["terminar", "terminer"], ["aparecer", "apparaître"],
    ["desaparecer", "disparaître"], ["ocurrir", "se produire"], ["convertirse", "se transformer"], ["aprender", "apprendre"], ["ponerse", "devenir (état)"]
  ])
];
