import type { CefrLevel } from "../../types.js";
import type { ExerciseTopic, VocabSet } from "../types.js";

/**
 * Listes de vocabulaire complémentaires (10/11/2026).
 * ATTENTION : dans VocabItem, le champ `en` contient ici le texte ESPAGNOL (infinitif pour les verbes).
 */
const vocab = (
  id: string, topic: ExerciseTopic, level: CefrLevel, title: string, skill: string, items: Array<[string, string]>
): VocabSet => ({ id, topic, level, title, skill, items: items.map(([en, fr]) => ({ en, fr })) });

export const ES_VOCAB_MORE2: VocabSet[] = [
  vocab("es-v-m2-personnalite", "everyday", "A2", "Adjectifs de personnalité", "everyday-vocabulary", [
    ["simpático", "sympathique"], ["antipático", "antipathique"], ["amable", "aimable"], ["educado", "poli"],
    ["tímido", "timide"], ["trabajador", "travailleur"], ["perezoso", "paresseux"], ["generoso", "généreux"],
    ["egoísta", "égoïste"], ["divertido", "drôle"], ["serio", "sérieux"], ["tranquilo", "calme"],
    ["valiente", "courageux"], ["sincero", "sincère"], ["testarudo", "têtu"]
  ]),
  vocab("es-v-m2-adjectifs", "everyday", "A1", "Adjectifs courants (ser et estar)", "ser-estar", [
    ["grande", "grand"], ["pequeño", "petit"], ["nuevo", "nouveau"], ["viejo", "vieux"],
    ["bonito", "joli"], ["feo", "laid"], ["limpio", "propre"], ["sucio", "sale"],
    ["lleno", "plein"], ["vacío", "vide"], ["cansado", "fatigué"], ["ocupado", "occupé"],
    ["fácil", "facile"], ["difícil", "difficile"], ["rápido", "rapide"]
  ]),
  vocab("es-v-m2-adverbes", "everyday", "A2", "Adverbes courants", "everyday-vocabulary", [
    ["siempre", "toujours"], ["nunca", "jamais"], ["a veces", "parfois"], ["ya", "déjà"],
    ["todavía", "encore (toujours)"], ["ahora", "maintenant"], ["luego", "ensuite"], ["pronto", "bientôt"],
    ["tarde", "tard"], ["temprano", "tôt"], ["casi", "presque"], ["demasiado", "trop"],
    ["bastante", "assez"], ["también", "aussi"], ["tampoco", "non plus"]
  ]),
  vocab("es-v-m2-connecteurs", "everyday", "B1", "Connecteurs logiques", "everyday-vocabulary", [
    ["sin embargo", "cependant"], ["por eso", "c'est pourquoi"], ["aunque", "bien que"], ["porque", "parce que"],
    ["entonces", "alors"], ["además", "de plus"], ["por lo tanto", "donc"], ["mientras", "pendant que"],
    ["de todas formas", "de toute façon"], ["en cambio", "en revanche"], ["sino", "mais (plutôt)"], ["por ejemplo", "par exemple"],
    ["es decir", "c'est-à-dire"], ["a pesar de", "malgré"], ["según", "selon"]
  ]),
  vocab("es-v-m2-expressions", "everyday", "A1", "Expressions courantes", "introductions", [
    ["¿Qué tal?", "Comment ça va ?"], ["Mucho gusto", "Enchanté"], ["De nada", "De rien"], ["Lo siento", "Je suis désolé"],
    ["Con permiso", "Excusez-moi (pour passer)"], ["¡Salud!", "À votre santé !"], ["¡Buen provecho!", "Bon appétit !"], ["¡Buen viaje!", "Bon voyage !"],
    ["¡Enhorabuena!", "Félicitations !"], ["No pasa nada", "Ce n'est pas grave"], ["¡Ánimo!", "Courage !"], ["¡Qué pena!", "Quel dommage !"],
    ["Claro que sí", "Bien sûr"], ["Por favor", "S'il vous plaît"], ["Hasta luego", "À tout à l'heure"]
  ]),
  vocab("es-v-m2-idiomes", "everyday", "B1", "Expressions idiomatiques", "everyday-vocabulary", [
    ["costar un ojo de la cara", "coûter les yeux de la tête"], ["estar en las nubes", "être dans la lune"], ["tomar el pelo", "faire marcher (quelqu'un)"],
    ["dar la lata", "embêter"], ["estar hecho polvo", "être crevé"], ["meter la pata", "faire une gaffe"],
    ["ser pan comido", "être facile comme bonjour"], ["echar una mano", "donner un coup de main"], ["ponerse las pilas", "se mettre au travail"],
    ["no tener ni idea", "n'avoir aucune idée"], ["hablar por los codos", "être bavard comme une pie"], ["estar sin blanca", "être fauché"],
    ["llover a cántaros", "pleuvoir à verse"], ["dormir como un lirón", "dormir comme un loir"], ["ser uña y carne", "être inséparables"]
  ]),
  vocab("es-v-m2-fruits", "everyday", "A1", "Fruits", "everyday-vocabulary", [
    ["la fresa", "la fraise"], ["la naranja", "l'orange"], ["el limón", "le citron"], ["el plátano", "la banane"],
    ["la uva", "le raisin"], ["la pera", "la poire"], ["el melocotón", "la pêche"], ["la sandía", "la pastèque"],
    ["el melón", "le melon"], ["la cereza", "la cerise"], ["el albaricoque", "l'abricot"], ["la piña", "l'ananas"],
    ["el higo", "la figue"], ["la ciruela", "la prune"], ["el aguacate", "l'avocat"]
  ]),
  vocab("es-v-m2-legumes", "everyday", "A1", "Légumes", "everyday-vocabulary", [
    ["la patata", "la pomme de terre"], ["el tomate", "la tomate"], ["la cebolla", "l'oignon"], ["el ajo", "l'ail"],
    ["la zanahoria", "la carotte"], ["la lechuga", "la laitue"], ["el pimiento", "le poivron"], ["el pepino", "le concombre"],
    ["la berenjena", "l'aubergine"], ["el calabacín", "la courgette"], ["la judía verde", "le haricot vert"], ["el champiñón", "le champignon"],
    ["la coliflor", "le chou-fleur"], ["las espinacas", "les épinards"], ["los guisantes", "les petits pois"]
  ]),
  vocab("es-v-m2-viandes-poissons", "everyday", "A2", "Viandes et poissons", "everyday-vocabulary", [
    ["el pollo", "le poulet"], ["el cerdo", "le porc"], ["la ternera", "le veau (le bœuf)"], ["el cordero", "l'agneau"],
    ["el jamón", "le jambon"], ["la salchicha", "la saucisse"], ["el chorizo", "le chorizo"], ["el bistec", "le steak"],
    ["la merluza", "le colin (le merlu)"], ["el salmón", "le saumon"], ["el atún", "le thon"], ["el bacalao", "la morue"],
    ["la gamba", "la crevette"], ["el calamar", "le calmar"], ["el mejillón", "la moule"]
  ]),
  vocab("es-v-m2-tapas", "everyday", "A2", "Tapas et bar", "everyday-vocabulary", [
    ["la tortilla de patatas", "l'omelette aux pommes de terre"], ["las patatas bravas", "les pommes de terre sauce piquante"], ["las croquetas", "les croquettes"], ["las aceitunas", "les olives"],
    ["la paella", "la paella"], ["el gazpacho", "le gaspacho"], ["el pulpo", "le poulpe"], ["las albóndigas", "les boulettes de viande"],
    ["la ración", "la portion (à partager)"], ["la tapa", "la tapa (petite portion)"], ["el pincho", "le pintxo (tapa sur du pain)"], ["el bocadillo", "le sandwich (baguette)"],
    ["el queso", "le fromage"], ["el embutido", "la charcuterie"], ["la tostada", "la tartine grillée"]
  ]),
  vocab("es-v-m2-boissons-desserts", "everyday", "A2", "Boissons et desserts", "everyday-vocabulary", [
    ["el café con leche", "le café au lait"], ["el zumo", "le jus de fruit"], ["la leche", "le lait"], ["el té", "le thé"],
    ["el refresco", "la boisson gazeuse"], ["la caña", "le demi (de bière pression)"], ["la sangría", "la sangria"], ["el helado", "la glace"],
    ["el flan", "le flan"], ["los churros", "les churros"], ["el chocolate", "le chocolat"], ["el pastel", "le gâteau"],
    ["la galleta", "le biscuit"], ["el azúcar", "le sucre"], ["la miel", "le miel"]
  ]),
  vocab("es-v-m2-animaux", "everyday", "A1", "Animaux", "everyday-vocabulary", [
    ["el perro", "le chien"], ["el gato", "le chat"], ["el caballo", "le cheval"], ["la vaca", "la vache"],
    ["la oveja", "la brebis"], ["el pájaro", "l'oiseau"], ["el pez", "le poisson vivant"], ["la gallina", "la poule"],
    ["el conejo", "le lapin"], ["el toro", "le taureau"], ["el lobo", "le loup"], ["el oso", "l'ours"],
    ["la serpiente", "le serpent"], ["la mosca", "la mouche"], ["la abeja", "l'abeille"]
  ]),
  vocab("es-v-m2-couleurs-formes", "everyday", "A1", "Couleurs et formes", "everyday-vocabulary", [
    ["rojo", "rouge"], ["azul", "bleu"], ["verde", "vert"], ["amarillo", "jaune"],
    ["blanco", "blanc"], ["negro", "noir"], ["gris", "gris"], ["rosa", "rose"],
    ["morado", "violet"], ["marrón", "marron"], ["claro", "clair"], ["oscuro", "foncé"],
    ["el círculo", "le cercle"], ["el cuadrado", "le carré"], ["el triángulo", "le triangle"]
  ]),
  vocab("es-v-m2-mesures", "everyday", "A2", "Mesures et quantités", "quantities", [
    ["el kilo", "le kilo"], ["el gramo", "le gramme"], ["el litro", "le litre"], ["la docena", "la douzaine"],
    ["el trozo", "le morceau"], ["la rebanada", "la tranche (de pain)"], ["la lata", "la boîte de conserve"], ["la botella", "la bouteille"],
    ["el paquete", "le paquet"], ["el tarro", "le pot"], ["la loncha", "la tranche fine"], ["el kilómetro", "le kilomètre"],
    ["el centímetro", "le centimètre"], ["el par", "la paire"], ["la mayoría", "la majorité"]
  ]),
  vocab("es-v-m2-jours", "everyday", "A1", "Jours et repères de la semaine", "everyday-vocabulary", [
    ["el lunes", "le lundi"], ["el martes", "le mardi"], ["el miércoles", "le mercredi"], ["el jueves", "le jeudi"],
    ["el viernes", "le vendredi"], ["el sábado", "le samedi"], ["el domingo", "le dimanche"], ["hoy", "aujourd'hui"],
    ["ayer", "hier"], ["mañana", "demain"], ["el fin de semana", "le week-end"], ["la semana", "la semaine"],
    ["el mes", "le mois"], ["el año", "l'année"], ["el día", "le jour"]
  ]),
  vocab("es-v-m2-mois-saisons", "everyday", "A1", "Mois et saisons", "everyday-vocabulary", [
    ["enero", "janvier"], ["febrero", "février"], ["marzo", "mars"], ["abril", "avril"],
    ["mayo", "mai"], ["junio", "juin"], ["julio", "juillet"], ["agosto", "août"],
    ["septiembre", "septembre"], ["octubre", "octobre"], ["noviembre", "novembre"], ["diciembre", "décembre"],
    ["la primavera", "le printemps"], ["el verano", "l'été"], ["el otoño", "l'automne"], ["el invierno", "l'hiver"]
  ]),
  vocab("es-v-m2-expressions-temps", "everyday", "A2", "Expressions de temps", "everyday-vocabulary", [
    ["por la mañana", "le matin"], ["por la tarde", "l'après-midi (le soir)"], ["por la noche", "la nuit (le soir)"], ["al mediodía", "à midi"],
    ["esta noche", "ce soir"], ["la semana que viene", "la semaine prochaine"], ["el año pasado", "l'année dernière"], ["hace dos días", "il y a deux jours"],
    ["dentro de una semana", "dans une semaine"], ["de vez en cuando", "de temps en temps"], ["todos los días", "tous les jours"], ["a menudo", "souvent"],
    ["de repente", "soudain"], ["hoy en día", "de nos jours"], ["últimamente", "dernièrement"]
  ]),
  vocab("es-v-m2-relations", "everyday", "A2", "Couple et famille élargie", "family-vocabulary", [
    ["la pareja", "le couple (le partenaire)"], ["el novio", "le petit ami"], ["la novia", "la petite amie"], ["el conocido", "la connaissance"],
    ["el suegro", "le beau-père"], ["la suegra", "la belle-mère"], ["el cuñado", "le beau-frère"], ["la cuñada", "la belle-sœur"],
    ["el sobrino", "le neveu"], ["la sobrina", "la nièce"], ["el nieto", "le petit-fils"], ["la nieta", "la petite-fille"],
    ["el gemelo", "le jumeau"], ["el divorcio", "le divorce"], ["el matrimonio", "le mariage (le couple marié)"]
  ]),
  vocab("es-v-m2-metiers", "everyday", "A2", "Métiers", "work-vocabulary", [
    ["el abogado", "l'avocat"], ["el ingeniero", "l'ingénieur"], ["el albañil", "le maçon"], ["el fontanero", "le plombier"],
    ["el electricista", "l'électricien"], ["el cocinero", "le cuisinier"], ["el panadero", "le boulanger"], ["el peluquero", "le coiffeur"],
    ["el policía", "le policier"], ["el bombero", "le pompier"], ["el periodista", "le journaliste (homme)"], ["el conductor", "le conducteur"],
    ["el agricultor", "l'agriculteur"], ["el arquitecto", "l'architecte"], ["el dependiente", "le vendeur"]
  ]),
  vocab("es-v-m2-societe", "everyday", "B1", "Société et politique", "everyday-vocabulary", [
    ["el gobierno", "le gouvernement"], ["el presidente", "le président"], ["las elecciones", "les élections"], ["el voto", "le vote"],
    ["el parlamento", "le parlement"], ["la ley", "la loi"], ["el ciudadano", "le citoyen"], ["la huelga", "la grève"],
    ["la manifestación", "la manifestation"], ["el derecho", "le droit"], ["el alcalde", "le maire"], ["la sociedad", "la société"],
    ["la pobreza", "la pauvreté"], ["la inmigración", "l'immigration"], ["el sindicato", "le syndicat"]
  ]),
  vocab("es-v-m2-travail-argent", "everyday", "B1", "Travail et argent", "work-vocabulary", [
    ["el empleo", "l'emploi"], ["el paro", "le chômage"], ["la nómina", "la fiche de paie"], ["el currículum", "le CV"],
    ["el puesto", "le poste"], ["el autónomo", "le travailleur indépendant"], ["la jubilación", "la retraite"], ["el ascenso", "la promotion"],
    ["la baja", "l'arrêt maladie"], ["los gastos", "les dépenses"], ["los ingresos", "les revenus"], ["el presupuesto", "le budget"],
    ["la hipoteca", "le prêt immobilier"], ["la propina", "le pourboire"], ["la tarifa", "le tarif"]
  ]),
  vocab("es-v-m2-demarches", "everyday", "B1", "Démarches pour s'installer", "work-vocabulary", [
    ["el empadronamiento", "l'inscription au registre municipal"], ["la residencia", "la résidence (le titre de séjour)"], ["la nacionalidad", "la nationalité"], ["la tarjeta sanitaria", "la carte d'assurance maladie"],
    ["la colegiación", "l'inscription à l'ordre professionnel"], ["la homologación", "l'équivalence (d'un diplôme)"], ["el traductor jurado", "le traducteur assermenté"], ["la Seguridad Social", "la Sécurité sociale"],
    ["el requisito", "la condition requise"], ["el expediente", "le dossier"], ["la gestoría", "le cabinet de formalités"], ["los antecedentes penales", "le casier judiciaire"],
    ["la apostilla", "l'apostille"], ["el poder notarial", "la procuration notariée"], ["el notario", "le notaire"]
  ]),
  vocab("es-v-m2-plage", "travel", "A2", "À la plage", "hotel-travel-vocabulary", [
    ["la playa", "la plage"], ["la arena", "le sable"], ["la ola", "la vague"], ["el mar", "la mer"],
    ["la sombrilla", "le parasol"], ["el bañador", "le maillot de bain"], ["la crema solar", "la crème solaire"], ["la orilla", "le bord de l'eau"],
    ["la marea", "la marée"], ["la concha", "le coquillage"], ["la medusa", "la méduse"], ["el socorrista", "le maître-nageur"],
    ["la tumbona", "le transat"], ["el chiringuito", "la buvette de plage"], ["el puerto", "le port"]
  ]),
  vocab("es-v-m2-montagne-camping", "travel", "A2", "Montagne et camping", "hotel-travel-vocabulary", [
    ["la cima", "le sommet"], ["el sendero", "le sentier"], ["la mochila", "le sac à dos"], ["la tienda de campaña", "la tente"],
    ["el saco de dormir", "le sac de couchage"], ["la hoguera", "le feu de camp"], ["la linterna", "la lampe torche"], ["el camping", "le camping"],
    ["el senderismo", "la randonnée"], ["la cuerda", "la corde"], ["la cueva", "la grotte"], ["el refugio", "le refuge"],
    ["la pendiente", "la pente"], ["la brújula", "la boussole"], ["el esquí", "le ski"]
  ]),
  vocab("es-v-m2-dermatologie", "medical", "B1", "Dermatologie", "health-vocabulary", [
    ["el sarpullido", "l'éruption cutanée"], ["el picor", "la démangeaison"], ["el eccema", "l'eczéma"], ["la mancha", "la tache"],
    ["el lunar", "le grain de beauté"], ["la verruga", "la verrue"], ["el acné", "l'acné"], ["la ampolla", "l'ampoule (la cloque)"],
    ["la urticaria", "l'urticaire"], ["la psoriasis", "le psoriasis"], ["el moratón", "l'hématome (le bleu)"], ["la costra", "la croûte"],
    ["el quiste", "le kyste"], ["el melanoma", "le mélanome"], ["la micosis", "la mycose"]
  ]),
  vocab("es-v-m2-orl", "medical", "B1", "ORL", "health-vocabulary", [
    ["el oído", "l'oreille (l'ouïe)"], ["la oreja", "l'oreille (externe)"], ["la nariz", "le nez"], ["la amígdala", "l'amygdale"],
    ["la sinusitis", "la sinusite"], ["la faringitis", "la pharyngite"], ["la laringitis", "la laryngite"], ["la afonía", "l'extinction de voix"],
    ["el tapón de cera", "le bouchon de cérumen"], ["la sordera", "la surdité"], ["el zumbido", "le bourdonnement (l'acouphène)"], ["el vértigo", "le vertige"],
    ["la ronquera", "l'enrouement"], ["el ronquido", "le ronflement"], ["el moco", "le mucus"]
  ]),
  vocab("es-v-m2-ophtalmologie", "medical", "B1", "Ophtalmologie", "health-vocabulary", [
    ["la vista", "la vue"], ["el párpado", "la paupière"], ["la pupila", "la pupille"], ["la retina", "la rétine"],
    ["la córnea", "la cornée"], ["el cristalino", "le cristallin"], ["la catarata", "la cataracte"], ["el glaucoma", "le glaucome"],
    ["la conjuntivitis", "la conjonctivite"], ["la miopía", "la myopie"], ["el astigmatismo", "l'astigmatisme"], ["la lágrima", "la larme"],
    ["la lentilla", "la lentille de contact"], ["el colirio", "le collyre"], ["la presbicia", "la presbytie"]
  ]),
  vocab("es-v-m2-gynecologie", "medical", "B1", "Gynécologie et grossesse", "health-vocabulary", [
    ["el embarazo", "la grossesse"], ["embarazada", "enceinte"], ["el parto", "l'accouchement"], ["la cesárea", "la césarienne"],
    ["la regla", "les règles"], ["la menopausia", "la ménopause"], ["el ovario", "l'ovaire"], ["el útero", "l'utérus"],
    ["el anticonceptivo", "le contraceptif"], ["la píldora", "la pilule"], ["la mamografía", "la mammographie"], ["la citología", "le frottis"],
    ["la matrona", "la sage-femme"], ["la contracción", "la contraction"], ["el aborto espontáneo", "la fausse couche"]
  ]),
  vocab("es-v-m2-gastro", "medical", "B1", "Gastro-entérologie", "health-vocabulary", [
    ["el estreñimiento", "la constipation"], ["la diarrea", "la diarrhée"], ["las náuseas", "les nausées"], ["la acidez", "les brûlures d'estomac"],
    ["la gastritis", "la gastrite"], ["la úlcera", "l'ulcère"], ["el reflujo", "le reflux"], ["la vesícula", "la vésicule biliaire"],
    ["el intestino", "l'intestin"], ["la colonoscopia", "la coloscopie"], ["la endoscopia", "l'endoscopie"], ["la hernia", "la hernie"],
    ["la hinchazón", "le gonflement (le ballonnement)"], ["el apéndice", "l'appendice"], ["las hemorroides", "les hémorroïdes"]
  ]),
  vocab("es-v-m2-urologie", "medical", "B1", "Urologie", "health-vocabulary", [
    ["la vejiga", "la vessie"], ["la uretra", "l'urètre"], ["el uréter", "l'uretère"], ["la próstata", "la prostate"],
    ["el cálculo renal", "le calcul rénal"], ["el cólico nefrítico", "la colique néphrétique"], ["la cistitis", "la cystite"], ["la incontinencia", "l'incontinence"],
    ["la sonda", "la sonde"], ["la diálisis", "la dialyse"], ["el testículo", "le testicule"], ["la micción", "la miction"],
    ["orinar", "uriner"], ["la infección urinaria", "l'infection urinaire"], ["el catéter", "le cathéter"]
  ]),
  vocab("es-v-m2-endocrinologie", "medical", "B1", "Endocrinologie et nutrition", "health-vocabulary", [
    ["la diabetes", "le diabète"], ["la insulina", "l'insuline"], ["la glucosa", "le glucose"], ["la glándula tiroides", "la thyroïde"],
    ["el hipotiroidismo", "l'hypothyroïdie"], ["el hipertiroidismo", "l'hyperthyroïdie"], ["la hormona", "l'hormone"], ["la obesidad", "l'obésité"],
    ["el peso", "le poids"], ["la glándula", "la glande"], ["el páncreas", "le pancréas"], ["la hipoglucemia", "l'hypoglycémie"],
    ["la hiperglucemia", "l'hyperglycémie"], ["el sobrepeso", "le surpoids"], ["la dieta", "le régime"]
  ]),
  vocab("es-v-m2-orthopedie", "medical", "B1", "Orthopédie et traumatologie", "health-vocabulary", [
    ["la articulación", "l'articulation"], ["el esguince", "l'entorse"], ["la luxación", "la luxation"], ["el ligamento", "le ligament"],
    ["el tendón", "le tendon"], ["la tendinitis", "la tendinite"], ["la escayola", "le plâtre"], ["las muletas", "les béquilles"],
    ["el menisco", "le ménisque"], ["la columna vertebral", "la colonne vertébrale"], ["la artrosis", "l'arthrose"], ["la cadera", "la hanche"],
    ["el tobillo", "la cheville"], ["el codo", "le coude"], ["la muñeca", "le poignet"]
  ]),
  vocab("es-v-m2-anesthesie", "medical", "B2", "Anesthésie et réanimation", "health-vocabulary", [
    ["la anestesia general", "l'anesthésie générale"], ["la anestesia local", "l'anesthésie locale"], ["la epidural", "la péridurale"], ["el anestesista", "l'anesthésiste (homme)"],
    ["la sedación", "la sédation"], ["la mascarilla", "le masque"], ["la intubación", "l'intubation"], ["la vía", "la voie veineuse"],
    ["el suero fisiológico", "le sérum physiologique"], ["el gotero", "le goutte-à-goutte"], ["el respirador", "le respirateur"], ["el monitor", "le moniteur"],
    ["el despertar", "le réveil"], ["el consentimiento informado", "le consentement éclairé"], ["la premedicación", "la prémédication"]
  ]),
  vocab("es-v-m2-infectiologie", "medical", "B1", "Infectiologie", "health-vocabulary", [
    ["el virus", "le virus"], ["la bacteria", "la bactérie"], ["la gripe", "la grippe"], ["el contagio", "la contagion"],
    ["la neumonía", "la pneumonie"], ["la tuberculosis", "la tuberculose"], ["la hepatitis", "l'hépatite"], ["la sepsis", "le sepsis"],
    ["el absceso", "l'abcès"], ["la cuarentena", "la quarantaine"], ["el aislamiento", "l'isolement"], ["el cultivo", "la culture (bactériologique)"],
    ["el brote", "la flambée (le foyer épidémique)"], ["la epidemia", "l'épidémie"], ["el paludismo", "le paludisme"]
  ]),
  vocab("es-v-m2-dentisterie", "medical", "A2", "Dentiste", "health-vocabulary", [
    ["el diente", "la dent"], ["la muela", "la molaire"], ["la encía", "la gencive"], ["la caries", "la carie"],
    ["el empaste", "le plombage"], ["la corona", "la couronne"], ["el dentista", "le dentiste (homme)"], ["la ortodoncia", "l'orthodontie"],
    ["el sarro", "le tartre"], ["el flúor", "le fluor"], ["el cepillo de dientes", "la brosse à dents"], ["la pasta de dientes", "le dentifrice"],
    ["la extracción", "l'extraction"], ["la muela del juicio", "la dent de sagesse"], ["el hilo dental", "le fil dentaire"]
  ]),
  vocab("es-v-m2-mauvaise-nouvelle", "medical", "B1", "Consultation : annoncer une mauvaise nouvelle", "health-vocabulary", [
    ["la mala noticia", "la mauvaise nouvelle"], ["el pronóstico", "le pronostic"], ["el cáncer", "le cancer"], ["el tumor", "la tumeur"],
    ["benigno", "bénin"], ["maligno", "malin"], ["la metástasis", "la métastase"], ["la quimioterapia", "la chimiothérapie"],
    ["la radioterapia", "la radiothérapie"], ["los cuidados paliativos", "les soins palliatifs"], ["la segunda opinión", "le deuxième avis"], ["la remisión", "la rémission"],
    ["el familiar", "le proche (homme)"], ["el duelo", "le deuil"], ["el fallecimiento", "le décès"]
  ]),
  vocab("es-v-m2-verbes-vocaliques", "everyday", "B1", "Verbes à changement vocalique", "present-tense", [
    ["comenzar", "commencer"], ["defender", "défendre"], ["divertirse", "s'amuser"], ["mostrar", "montrer"],
    ["recomendar", "recommander"], ["rogar", "prier (supplier)"], ["resolver", "résoudre"], ["servir", "servir"],
    ["medir", "mesurer"], ["corregir", "corriger"], ["advertir", "avertir"], ["soler", "avoir l'habitude de"],
    ["calentar", "chauffer"], ["morder", "mordre"], ["apretar", "serrer"]
  ]),
  vocab("es-v-m2-verbes-reflechis", "everyday", "A2", "Verbes pronominaux", "everyday-vocabulary", [
    ["afeitarse", "se raser"], ["peinarse", "se coiffer"], ["maquillarse", "se maquiller"], ["bañarse", "se baigner"],
    ["quitarse", "enlever (un vêtement)"], ["probarse", "essayer (un vêtement)"], ["cuidarse", "prendre soin de soi"], ["darse prisa", "se dépêcher"],
    ["equivocarse", "se tromper"], ["acordarse", "se souvenir"], ["enterarse", "être mis au courant (apprendre une nouvelle)"], ["atreverse", "oser"],
    ["negarse", "refuser"], ["casarse", "se marier"], ["fijarse", "remarquer"]
  ]),
  vocab("es-v-m2-verbes-prepositions", "everyday", "B1", "Verbes à préposition", "everyday-vocabulary", [
    ["depender de", "dépendre de"], ["acabar de", "venir de"], ["dejar de", "arrêter de"], ["tardar en", "mettre du temps à"],
    ["consistir en", "consister en"], ["contar con", "compter sur"], ["enamorarse de", "tomber amoureux de"], ["darse cuenta de", "se rendre compte de"],
    ["ocuparse de", "s'occuper de"], ["tener ganas de", "avoir envie de"], ["quedar en", "convenir de"], ["carecer de", "manquer de"],
    ["basarse en", "se baser sur"], ["participar en", "participer à"], ["aspirar a", "aspirer à"]
  ]),
  vocab("es-v-m2-verbes-irreguliers", "everyday", "B1", "Verbes irréguliers fréquents", "present-tense", [
    ["traer", "apporter"], ["oír", "entendre"], ["caer", "tomber"], ["traducir", "traduire"],
    ["construir", "construire"], ["ofrecer", "offrir (proposer)"], ["merecer", "mériter"], ["obtener", "obtenir"],
    ["andar", "marcher"], ["caber", "tenir (dans)"], ["valer", "valoir"], ["sonreír", "sourire"],
    ["detener", "arrêter (interpeller)"], ["producir", "produire"], ["atraer", "attirer"]
  ])
];
