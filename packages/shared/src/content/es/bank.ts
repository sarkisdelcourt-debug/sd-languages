import type { CefrLevel } from "../../types.js";
import type { ExerciseTopic, HandwrittenExercise, SentenceItem, VocabSet } from "../types.js";

/**
 * Banque d'espagnol (22/10/2026) : vocabulaire, phrases modèles et grammaire rédigée.
 * ATTENTION : dans VocabItem et SentenceItem, le champ `en` contient ici le texte ESPAGNOL.
 * RÈGLE D'OR : un `id` publié ne change jamais ; on ajoute à la fin, on ne réordonne pas.
 */
const vocab = (
  id: string, topic: ExerciseTopic, level: CefrLevel, title: string, skill: string, items: Array<[string, string]>
): VocabSet => ({ id, topic, level, title, skill, items: items.map(([en, fr]) => ({ en, fr })) });

export const ES_VOCAB: VocabSet[] = [
  vocab("es-v-numeros-heures", "everyday", "A1", "Nombres et heures", "numbers", [
    ["uno", "un"], ["dos", "deux"], ["tres", "trois"], ["cuatro", "quatre"], ["cinco", "cinq"],
    ["diez", "dix"], ["veinte", "vingt"], ["treinta", "trente"], ["cien", "cent"], ["mil", "mille"],
    ["la hora", "l'heure"], ["el minuto", "la minute"], ["la mitad", "la moitié"], ["el reloj", "l'horloge"]
  ]),
  vocab("es-v-famille", "everyday", "A1", "La famille", "family-vocabulary", [
    ["el padre", "le père"], ["la madre", "la mère"], ["el hijo", "le fils"], ["la hija", "la fille"],
    ["el hermano", "le frère"], ["la hermana", "la sœur"], ["el abuelo", "le grand-père"], ["la abuela", "la grand-mère"],
    ["el tío", "l'oncle"], ["la tía", "la tante"], ["el primo", "le cousin"], ["el marido", "le mari"],
    ["la mujer", "la femme"], ["los padres", "les parents"], ["el amigo", "l'ami"]
  ]),
  vocab("es-v-nourriture-restaurant", "travel", "A1", "Nourriture et restaurant", "everyday-vocabulary", [
    ["el pan", "le pain"], ["el agua", "l'eau"], ["el vino", "le vin"], ["la carne", "la viande"],
    ["el pescado", "le poisson"], ["la ensalada", "la salade"], ["el postre", "le dessert"], ["la cuenta", "l'addition"],
    ["la carta", "le menu"], ["el camarero", "le serveur"], ["la mesa", "la table"], ["el cuchillo", "le couteau"],
    ["el tenedor", "la fourchette"], ["la cerveza", "la bière"]
  ]),
  vocab("es-v-transports", "travel", "A1", "Transports", "hotel-travel-vocabulary", [
    ["el tren", "le train"], ["el autobús", "le bus"], ["el avión", "l'avion"], ["el taxi", "le taxi"],
    ["el billete", "le billet"], ["la estación", "la gare"], ["el aeropuerto", "l'aéroport"], ["la parada", "l'arrêt"],
    ["el andén", "le quai"], ["la maleta", "la valise"], ["el metro", "le métro"], ["el retraso", "le retard"],
    ["la salida", "le départ, la sortie"], ["el coche", "la voiture"]
  ]),
  vocab("es-v-hotel", "travel", "A2", "À l'hôtel", "hotel-travel-vocabulary", [
    ["la habitación", "la chambre"], ["la llave", "la clé"], ["el desayuno", "le petit-déjeuner"], ["la reserva", "la réservation"],
    ["la recepción", "la réception"], ["el ascensor", "l'ascenseur"], ["la cama", "le lit"], ["la toalla", "la serviette"],
    ["el baño", "la salle de bains"], ["la ducha", "la douche"], ["el wifi", "le wifi"], ["la planta", "l'étage"],
    ["el pasaporte", "le passeport"], ["la habitación doble", "la chambre double"]
  ]),
  vocab("es-v-achats-marche", "everyday", "A2", "Achats et marché", "everyday-vocabulary", [
    ["la tienda", "le magasin"], ["el mercado", "le marché"], ["el precio", "le prix"], ["barato", "bon marché"],
    ["caro", "cher"], ["la talla", "la taille"], ["el dinero", "l'argent"], ["el efectivo", "les espèces"],
    ["la tarjeta", "la carte bancaire"], ["el descuento", "la réduction"], ["la bolsa", "le sac"], ["el recibo", "le reçu"],
    ["las rebajas", "les soldes"], ["el cambio", "la monnaie"]
  ]),
  vocab("es-v-sante-symptomes", "medical", "A2", "Santé et symptômes", "health-vocabulary", [
    ["el dolor", "la douleur"], ["la fiebre", "la fièvre"], ["la tos", "la toux"], ["el médico", "le médecin"],
    ["la farmacia", "la pharmacie"], ["la receta", "l'ordonnance"], ["el resfriado", "le rhume"], ["el estómago", "l'estomac"],
    ["la cabeza", "la tête"], ["la garganta", "la gorge"], ["el medicamento", "le médicament"], ["la alergia", "l'allergie"],
    ["la cita", "le rendez-vous"], ["el pecho", "la poitrine"], ["mareado", "pris de vertiges"]
  ]),
  vocab("es-v-travail-bureau", "everyday", "B1", "Travail et bureau", "work-vocabulary", [
    ["la oficina", "le bureau"], ["la reunión", "la réunion"], ["el jefe", "le chef"], ["el compañero", "le collègue"],
    ["el correo", "le courriel"], ["el horario", "l'horaire"], ["el sueldo", "le salaire"], ["el contrato", "le contrat"],
    ["la empresa", "l'entreprise"], ["el ordenador", "l'ordinateur"], ["la llamada", "l'appel"], ["el informe", "le rapport"],
    ["las vacaciones", "les vacances"], ["el plazo", "le délai"], ["la jornada", "la journée de travail"]
  ]),
  vocab("es-v-ville-indications", "travel", "A1", "Ville et indications", "everyday-vocabulary", [
    ["la calle", "la rue"], ["la plaza", "la place"], ["la esquina", "le coin"], ["el semáforo", "le feu"],
    ["el puente", "le pont"], ["el banco", "la banque"], ["el museo", "le musée"], ["la iglesia", "l'église"],
    ["el ayuntamiento", "la mairie"], ["a la derecha", "à droite"], ["a la izquierda", "à gauche"], ["todo recto", "tout droit"],
    ["cerca", "près"], ["lejos", "loin"], ["el mapa", "la carte"]
  ]),
  vocab("es-v-verbes-courants", "everyday", "A2", "Verbes courants", "everyday-vocabulary", [
    ["ir", "aller"], ["venir", "venir"], ["tener", "avoir"], ["hacer", "faire"], ["poder", "pouvoir"],
    ["querer", "vouloir"], ["saber", "savoir"], ["ver", "voir"], ["decir", "dire"], ["dar", "donner"],
    ["poner", "mettre"], ["salir", "sortir"], ["llegar", "arriver"], ["comprar", "acheter"],
    ["necesitar", "avoir besoin de"], ["esperar", "attendre"]
  ])
];

type S = [CefrLevel, ExerciseTopic, string, string, string[], string];
const SENTENCE_ROWS: S[] = [
  // A1
  ["A1", "everyday", "Me llamo Pablo y soy médico.", "Je m'appelle Pablo et je suis médecin.", ["introductions", "ser-estar"], "Avec ser, la profession se dit sans article : soy médico."],
  ["A1", "everyday", "Soy francés y vivo en Lyon.", "Je suis français et j'habite à Lyon.", ["introductions", "present-tense"], "Les nationalités ne prennent pas de majuscule en espagnol : francés."],
  ["A1", "everyday", "Mucho gusto, soy el doctor Martín.", "Enchanté, je suis le docteur Martin.", ["introductions"], "Devant doctor, on met l'article el quand on se présente : soy el doctor."],
  ["A1", "everyday", "¿De dónde eres, Marta?", "D'où es-tu, Marta ?", ["ser-estar", "introductions"], "L'origine se dit avec ser : ¿de dónde eres ?"],
  ["A1", "everyday", "Tengo cuarenta años y dos hijos.", "J'ai quarante ans et deux enfants.", ["present-tense", "numbers"], "L'âge se dit avec tener : tengo cuarenta años, jamais avec ser."],
  ["A1", "everyday", "Mi hermana vive en Madrid.", "Ma sœur habite à Madrid.", ["present-tense", "articles-gender"], "Vivir signifie habiter ; mi ne change pas au féminin."],
  ["A1", "everyday", "Ellos son mis padres.", "Ce sont mes parents.", ["ser-estar", "introductions"], "Padres désigne les parents ; mis s'accorde avec le pluriel."],
  ["A1", "everyday", "Hablo un poco de español.", "Je parle un peu d'espagnol.", ["present-tense", "introductions"], "Un poco de se traduit par un peu de ; on garde hablo sans pronom sujet."],
  ["A1", "everyday", "No entiendo, ¿puede repetir, por favor?", "Je ne comprends pas, pouvez-vous répéter, s'il vous plaît ?", ["polite-requests"], "Puede est la forme de politesse (usted) du verbe poder."],
  ["A1", "travel", "Una mesa para dos, por favor.", "Une table pour deux, s'il vous plaît.", ["polite-requests", "numbers"], "Pour indique le nombre de personnes : para dos."],
  ["A1", "travel", "Quiero una ensalada y agua.", "Je veux une salade et de l'eau.", ["present-tense", "everyday-vocabulary"], "Agua est féminin même si on dit el agua au singulier."],
  ["A1", "travel", "La cuenta, por favor.", "L'addition, s'il vous plaît.", ["polite-requests", "everyday-vocabulary"], "Attention au faux ami : cuenta est l'addition, pas le conte."],
  ["A1", "travel", "¿Hay menú del día?", "Y a-t-il un menu du jour ?", ["everyday-vocabulary", "location"], "Hay signifie il y a ; en Espagne, le menú del día est une formule à prix fixe."],
  ["A1", "medical", "Soy alérgico a los frutos secos.", "Je suis allergique aux fruits à coque.", ["ser-estar", "health-vocabulary"], "Alérgico a se construit avec la préposition a ; al féminin, alérgica."],
  ["A1", "travel", "El pescado está muy bueno.", "Le poisson est très bon.", ["ser-estar", "everyday-vocabulary"], "Estar exprime le goût du moment : está bueno (c'est bon), alors que es bueno veut dire qu'il est de qualité."],
  ["A1", "travel", "Tengo una reserva a nombre de Ruiz.", "J'ai une réservation au nom de Ruiz.", ["hotel-travel-vocabulary", "present-tense"], "On dit a nombre de pour au nom de."],
  ["A1", "travel", "¿A qué hora es el desayuno?", "À quelle heure est le petit-déjeuner ?", ["hotel-travel-vocabulary", "ser-estar"], "Pour un événement ou une heure, on utilise ser : ¿a qué hora es ?"],
  ["A1", "travel", "La habitación está en la tercera planta.", "La chambre est au troisième étage.", ["location", "hotel-travel-vocabulary"], "Planta désigne l'étage ; tercera s'accorde avec planta au féminin."],
  ["A1", "travel", "¿Dónde está el ascensor?", "Où est l'ascenseur ?", ["location", "hotel-travel-vocabulary"], "Pour situer un objet, on emploie estar : ¿dónde está... ?"],
  ["A1", "travel", "Necesito una toalla más.", "J'ai besoin d'une serviette de plus.", ["present-tense", "hotel-travel-vocabulary"], "Necesitar se construit sans préposition, contrairement au français avoir besoin de."],
  ["A1", "travel", "La llave no funciona.", "La clé ne fonctionne pas.", ["hotel-travel-vocabulary", "articles-gender"], "Llave est féminin : la llave ; no se place juste avant le verbe."],
  ["A1", "travel", "Un billete para Sevilla, por favor.", "Un billet pour Séville, s'il vous plaît.", ["polite-requests", "hotel-travel-vocabulary"], "Billete est le ticket de transport ; para Sevilla indique la destination."],
  ["A1", "travel", "¿A qué hora sale el tren?", "À quelle heure part le train ?", ["hotel-travel-vocabulary", "numbers"], "Salir signifie partir ou sortir : sale pour il part."],
  ["A1", "travel", "El autobús llega a las nueve.", "Le bus arrive à neuf heures.", ["numbers", "present-tense"], "Pour l'heure, on dit a las nueve (a las + nombre) ; a la una pour une heure."],
  ["A1", "travel", "¿Dónde está la estación?", "Où est la gare ?", ["location"], "Estación est féminin et prend un accent : la estación."],
  ["A1", "travel", "Voy al aeropuerto en taxi.", "Je vais à l'aéroport en taxi.", ["present-tense", "hotel-travel-vocabulary"], "A + el se contracte en al ; en taxi : en s'emploie pour le moyen de transport."],
  ["A1", "travel", "Mi maleta no está aquí.", "Ma valise n'est pas ici.", ["location", "hotel-travel-vocabulary"], "Estar pour la place d'un objet ; maleta est féminin."],
  ["A1", "everyday", "¿Cuánto cuesta este jersey?", "Combien coûte ce pull ?", ["quantities", "everyday-vocabulary"], "Jersey se prononce comme en français-anglais ; este est masculin."],
  ["A1", "everyday", "Es demasiado caro para mí.", "C'est trop cher pour moi.", ["ser-estar", "everyday-vocabulary"], "Après une préposition, le pronom est mí avec accent : para mí."],
  ["A1", "everyday", "Busco una talla más grande.", "Je cherche une taille plus grande.", ["everyday-vocabulary", "articles-gender"], "Buscar n'est pas suivi de préposition : busco una talla."],
  ["A1", "everyday", "¿Puedo pagar con tarjeta?", "Puis-je payer par carte ?", ["polite-requests", "everyday-vocabulary"], "Pagar con tarjeta se dit avec la préposition con, pas par."],
  ["A1", "everyday", "Quiero dos kilos de naranjas.", "Je veux deux kilos d'oranges.", ["quantities", "numbers"], "Après une quantité, on emploie de : dos kilos de naranjas."],
  ["A1", "travel", "¿Dónde está el banco, por favor?", "Où est la banque, s'il vous plaît ?", ["location", "polite-requests"], "El banco est aussi le banc ; le contexte précise le sens."],
  ["A1", "travel", "Gire a la derecha en el semáforo.", "Tournez à droite au feu.", ["location", "polite-requests"], "Gire est l'impératif de politesse (usted) du verbe girar."],
  ["A1", "travel", "Siga todo recto hasta la plaza.", "Continuez tout droit jusqu'à la place.", ["location", "polite-requests"], "Siga vient de seguir ; todo recto veut dire tout droit."],
  ["A1", "travel", "El museo está cerca de aquí.", "Le musée est près d'ici.", ["location", "ser-estar"], "Cerca de se construit avec de ; la situation se dit avec estar."],
  ["A1", "travel", "¿Está lejos de aquí?", "Est-ce loin d'ici ?", ["location", "ser-estar"], "Lejos de aquí : on garde la préposition de ; estar pour la distance."],
  ["A1", "medical", "Me duele la cabeza.", "J'ai mal à la tête.", ["health-vocabulary", "object-pronouns"], "Doler fonctionne comme gustar : me duele la cabeza (au pluriel, me duelen)."],
  ["A1", "medical", "Tengo fiebre desde ayer.", "J'ai de la fièvre depuis hier.", ["health-vocabulary", "duration"], "Fiebre s'emploie sans article ici ; desde indique le point de départ."],
  ["A1", "medical", "Necesito una cita con el médico.", "J'ai besoin d'un rendez-vous avec le médecin.", ["health-vocabulary", "present-tense"], "Cita signifie rendez-vous ; el médico prend l'article défini."],
  // A2
  ["A2", "everyday", "Esta tarde tengo una reunión con mi jefe.", "Cet après-midi j'ai une réunion avec mon chef.", ["work-vocabulary", "present-tense"], "Reunión prend un accent sur le o ; con mi jefe se place en fin de phrase."],
  ["A2", "everyday", "Trabajo en un hospital desde hace tres años.", "Je travaille dans un hôpital depuis trois ans.", ["duration", "work-vocabulary"], "Desde hace + durée, avec le verbe au présent, traduit depuis."],
  ["A2", "everyday", "¿Puede enviarme el informe mañana?", "Pouvez-vous m'envoyer le rapport demain ?", ["object-pronouns", "work-vocabulary"], "Le pronom se soude à l'infinitif : enviarme."],
  ["A2", "everyday", "Tengo que terminar este trabajo hoy.", "Je dois terminer ce travail aujourd'hui.", ["obligation", "work-vocabulary"], "Tener que + infinitif exprime l'obligation personnelle."],
  ["A2", "everyday", "Mis compañeros son muy amables.", "Mes collègues sont très aimables.", ["ser-estar", "work-vocabulary"], "Compañero désigne le collègue ou le camarade ; amable est invariable au genre."],
  ["A2", "everyday", "Voy a llamar al cliente ahora.", "Je vais appeler le client maintenant.", ["present-tense", "work-vocabulary"], "Ir a + infinitif exprime le futur proche ; llamar a une personne demande la préposition a."],
  ["A2", "travel", "Ayer fuimos a un restaurante italiano.", "Hier nous sommes allés dans un restaurant italien.", ["preterite"], "Fuimos est le prétérit de ir (et de ser) : fui, fuiste, fue, fuimos."],
  ["A2", "everyday", "Anoche cenamos en casa de Ana.", "Hier soir nous avons dîné chez Ana.", ["preterite"], "En casa de signifie chez ; cenamos est le prétérit de cenar."],
  ["A2", "travel", "El año pasado viajé a Portugal.", "L'année dernière j'ai voyagé au Portugal.", ["preterite"], "Les noms de pays n'ont pas d'article ici : a Portugal. Viajé prend un accent final."],
  ["A2", "travel", "¿Me trae un vaso de agua, por favor?", "Vous m'apportez un verre d'eau, s'il vous plaît ?", ["object-pronouns", "polite-requests"], "Le pronom me précède le verbe conjugué : ¿me trae... ?"],
  ["A2", "everyday", "Lo compro si es barato.", "Je l'achète si c'est bon marché.", ["object-pronouns", "everyday-vocabulary"], "Lo remplace un objet masculin et se place avant le verbe."],
  ["A2", "everyday", "¿Dónde puedo comprarlo hoy?", "Où puis-je l'acheter aujourd'hui ?", ["object-pronouns", "everyday-vocabulary"], "Avec un infinitif, le pronom s'attache à la fin : comprarlo."],
  ["A2", "everyday", "Me gusta mucho la cocina española.", "J'aime beaucoup la cuisine espagnole.", ["object-pronouns", "everyday-vocabulary"], "Gustar s'accorde avec ce qui plaît : me gusta la cocina, me gustan los platos."],
  ["A2", "travel", "A mi hermano no le gustan los mariscos.", "Mon frère n'aime pas les fruits de mer.", ["object-pronouns", "everyday-vocabulary"], "Le pronom le renvoie à mi hermano ; gustan est au pluriel car mariscos l'est."],
  ["A2", "travel", "Prefiero la habitación con vistas al mar.", "Je préfère la chambre avec vue sur la mer.", ["hotel-travel-vocabulary", "present-tense"], "Preferir change son e en ie : prefiero. On dit vistas au pluriel."],
  ["A2", "travel", "Hay un supermercado al lado del hotel.", "Il y a un supermarché à côté de l'hôtel.", ["location", "everyday-vocabulary"], "Hay introduit un élément indéfini ; l'objet défini se situe avec está."],
  ["A2", "travel", "La farmacia está enfrente del banco.", "La pharmacie est en face de la banque.", ["location", "health-vocabulary"], "Enfrente de signifie en face de ; de + el donne del."],
  ["A2", "medical", "Llevo tres días con dolor de garganta.", "Depuis trois jours j'ai mal à la gorge.", ["duration", "health-vocabulary"], "Llevar + durée exprime depuis combien de temps on est dans un état."],
  ["A2", "medical", "Hace dos semanas que no duermo bien.", "Ça fait deux semaines que je ne dors pas bien.", ["duration", "health-vocabulary"], "Hace + durée + que + présent : ça fait... que. Dormir change o en ue."],
  ["A2", "medical", "El médico me recetó un antibiótico.", "Le médecin m'a prescrit un antibiotique.", ["preterite", "health-vocabulary"], "Recetar vient de receta, l'ordonnance ; le prétérit se traduit par un passé composé."],
  ["A2", "medical", "Debe tomar una pastilla cada ocho horas.", "Vous devez prendre un comprimé toutes les huit heures.", ["obligation", "health-vocabulary"], "Debe est la forme de politesse ; cada + durée signifie toutes les."],
  ["A2", "everyday", "Cuando era niño, vivía en Marsella.", "Quand j'étais enfant, je vivais à Marseille.", ["imperfect"], "Era et vivía sont à l'imparfait, qui décrit une situation passée habituelle."],
  ["A2", "everyday", "Antes fumaba, pero ahora no.", "Avant je fumais, mais maintenant non.", ["imperfect"], "Antes introduit une habitude passée, donc l'imparfait : fumaba."],
  ["A2", "travel", "Mientras esperábamos el tren, llovía mucho.", "Pendant que nous attendions le train, il pleuvait beaucoup.", ["imperfect"], "Deux actions en cours dans le passé s'expriment à l'imparfait ; esperábamos prend un accent."],
  ["A2", "travel", "¿Cuánto tiempo se tarda en llegar?", "Combien de temps faut-il pour arriver ?", ["duration", "hotel-travel-vocabulary"], "Tardar en + infinitif exprime le temps que prend une action."],
  ["A2", "travel", "El tren a Barcelona sale del andén cinco.", "Le train pour Barcelone part du quai cinq.", ["numbers", "hotel-travel-vocabulary"], "De + el donne del ; andén est le quai de gare."],
  ["A2", "travel", "Perdone, ¿sabe dónde hay una farmacia?", "Excusez-moi, savez-vous où il y a une pharmacie ?", ["polite-requests", "location"], "Perdone attire l'attention poliment ; dónde porte un accent même dans une question indirecte."],
  ["A2", "travel", "Vamos a visitar el museo mañana.", "Nous allons visiter le musée demain.", ["present-tense", "everyday-vocabulary"], "Vamos a + infinitif exprime le futur proche (nous allons)."],
  ["A2", "travel", "Mi vuelo sale a las siete y media.", "Mon vol part à sept heures et demie.", ["numbers", "hotel-travel-vocabulary"], "Y media signifie et demie ; vuelo est le vol, et volar le verbe voler."],
  ["A2", "travel", "Quisiera cambiar de habitación, por favor.", "Je voudrais changer de chambre, s'il vous plaît.", ["polite-requests", "hotel-travel-vocabulary"], "Quisiera est la forme polie de je voudrais ; cambiar de se construit avec de."],
  ["A2", "travel", "No puedo dormir porque hay mucho ruido.", "Je ne peux pas dormir parce qu'il y a beaucoup de bruit.", ["quantities", "everyday-vocabulary"], "Mucho s'accorde avec le nom : mucho ruido, mucha gente."],
  ["A2", "travel", "Somos cuatro y queremos una mesa fuera.", "Nous sommes quatre et nous voulons une table dehors.", ["numbers", "present-tense"], "Pour dire le nombre de personnes, on emploie ser : somos cuatro."],
  ["A2", "travel", "¿Me puede dar un poco más de pan?", "Pouvez-vous me donner un peu plus de pain ?", ["quantities", "object-pronouns"], "Un poco más de + nom signifie un peu plus de."],
  ["A2", "everyday", "Tengo que hablar con el director.", "Je dois parler avec le directeur.", ["obligation", "work-vocabulary"], "Hablar con signifie parler avec ; director est masculin."],
  ["A2", "everyday", "Estoy cansado porque trabajo mucho.", "Je suis fatigué parce que je travaille beaucoup.", ["ser-estar", "work-vocabulary"], "Estar pour un état passager comme la fatigue ; porque ne s'écrit pas en deux mots."],
  // B1
  ["B1", "everyday", "Hace un mes que vivo en Valencia.", "Cela fait un mois que j'habite à Valence.", ["duration"], "Hace + durée + que + présent traduit cela fait... que ; le verbe reste au présent."],
  ["B1", "travel", "Llevaba una hora esperando cuando llegó el autobús.", "J'attendais depuis une heure quand le bus est arrivé.", ["imperfect", "preterite"], "L'imparfait llevaba pose le décor, le prétérit llegó marque l'événement qui interrompt."],
  ["B1", "medical", "Ayer me dolía el estómago y no fui a trabajar.", "Hier j'avais mal à l'estomac et je ne suis pas allé travailler.", ["imperfect", "health-vocabulary"], "Dolía (imparfait) décrit la douleur qui durait ; fui (prétérit) est l'action ponctuelle."],
  ["B1", "travel", "Cuando llegamos al hotel, la recepción estaba cerrada.", "Quand nous sommes arrivés à l'hôtel, la réception était fermée.", ["preterite", "imperfect"], "Llegamos est l'action, estaba cerrada l'état ; cerrada s'accorde avec recepción."],
  ["B1", "travel", "Es necesario reservar con dos días de antelación.", "Il faut réserver deux jours à l'avance.", ["obligation", "numbers"], "Es necesario + infinitif exprime une nécessité générale."],
  ["B1", "everyday", "No tuve tiempo de comer antes de la reunión.", "Je n'ai pas eu le temps de manger avant la réunion.", ["preterite", "work-vocabulary"], "Tuve est le prétérit irrégulier de tener ; tiempo de + infinitif signifie le temps de."],
  ["B1", "everyday", "Me alegro mucho de verte.", "Je suis très content de te voir.", ["object-pronouns", "everyday-vocabulary"], "Alegrarse de est un verbe pronominal ; te s'attache à l'infinitif : verte."],
  ["B1", "medical", "Estuvimos dos horas esperando el resultado.", "Nous avons passé deux heures à attendre le résultat.", ["preterite", "duration"], "Estuvimos (prétérit de estar) + durée + gérondif décrit une action qui a duré."],
  ["B1", "everyday", "Debería descansar un poco más.", "Je devrais me reposer un peu plus.", ["obligation", "quantities"], "Debería est le conditionnel de deber et sert à donner un conseil."],
  ["B1", "everyday", "Cuando era joven, jugaba al fútbol todos los días.", "Quand j'étais jeune, je jouais au football tous les jours.", ["imperfect"], "Jugar a + sport ; todos los días indique une habitude, donc l'imparfait."],
  ["B1", "travel", "Ayer perdí mi pasaporte en el tren.", "Hier j'ai perdu mon passeport dans le train.", ["preterite", "hotel-travel-vocabulary"], "Perdí est le prétérit de perder, avec accent sur la dernière syllabe."],
  ["B1", "medical", "El paciente lleva una semana sin fiebre.", "Le patient est sans fièvre depuis une semaine.", ["duration", "health-vocabulary"], "Llevar + durée + sin + nom : depuis combien de temps il manque quelque chose."],
  ["B1", "everyday", "Mientras trabajaba en Madrid, conocí a mi mujer.", "Pendant que je travaillais à Madrid, j'ai rencontré ma femme.", ["imperfect", "preterite"], "Conocer au prétérit signifie faire la connaissance de, avec la préposition a devant une personne."],
  ["B1", "everyday", "¿Podría explicarme otra vez el horario?", "Pourriez-vous m'expliquer à nouveau l'horaire ?", ["polite-requests", "object-pronouns"], "Podría est le conditionnel de politesse ; otra vez signifie à nouveau."],
  ["B1", "travel", "Tuvimos que cambiar de tren en Zaragoza.", "Nous avons dû changer de train à Saragosse.", ["preterite", "obligation"], "Tener que au prétérit (tuvimos que) indique que l'obligation a bien été remplie."]
];

export const ES_SENTENCES: SentenceItem[] = SENTENCE_ROWS.map(([level, topic, en, fr, skills, note], index) => ({
  id: `es-s-${String(index + 1).padStart(3, "0")}`, topic, level, en, fr, skills, note
}));

type GType = "multiple-choice" | "fill-gap" | "translation";
interface G {
  level: CefrLevel;
  type: GType;
  skills: string[];
  focus: string;
  prompt: string;
  answer: string;
  explanation: string;
  hint: string;
  choices?: string[];
  accepted?: string[];
}
const mc = (level: CefrLevel, skills: string[], focus: string, prompt: string, choices: string[], answer: string, explanation: string, hint: string): G =>
  ({ level, type: "multiple-choice", skills, focus, prompt, choices, answer, explanation, hint });
const fg = (level: CefrLevel, skills: string[], focus: string, prompt: string, answer: string, explanation: string, hint: string): G =>
  ({ level, type: "fill-gap", skills, focus, prompt, answer, explanation, hint });
const tr = (level: CefrLevel, skills: string[], focus: string, prompt: string, answer: string, accepted: string[], explanation: string, hint: string): G =>
  ({ level, type: "translation", skills, focus, prompt, answer, accepted, explanation, hint });

const GRAMMAR_ROWS: G[] = [
  // A1 (25)
  mc("A1", ["ser-estar"], "Ser ou estar", "Complétez : Madrid ___ la capital de España.", ["es", "está", "hay", "son"], "es", "On identifie ou on définit avec ser : Madrid es la capital.", "Définition : ser."),
  mc("A1", ["ser-estar", "location"], "Estar pour la place", "Complétez : Mi madre ___ en la cocina.", ["está", "es", "hay", "son"], "está", "La position d'une personne se dit avec estar.", "Où se trouve-t-elle ?"),
  fg("A1", ["ser-estar"], "Ser au présent", "Complétez : Nosotros ___ de Francia. (ser)", "somos", "Ser au présent : soy, eres, es, somos, sois, son. L'origine se dit avec ser.", "Première personne du pluriel."),
  fg("A1", ["ser-estar"], "Estar au présent", "Complétez : Ella ___ muy cansada hoy. (estar)", "está", "La fatigue est un état passager : estar. Troisième personne : está.", "Estoy, estás, está…"),
  mc("A1", ["articles-gender"], "Articles définis", "Complétez : ___ casa es grande.", ["La", "El", "Los", "Las"], "La", "Casa est féminin singulier, donc la casa.", "Les noms en -a sont souvent féminins."),
  fg("A1", ["present-tense"], "Verbes en -ar", "Complétez : Yo ___ español. (hablar)", "hablo", "Au présent, la terminaison de yo pour les verbes en -ar est -o : hablo.", "Racine habl- + terminaison."),
  fg("A1", ["present-tense"], "Verbes en -er", "Complétez : Tú ___ pan por la mañana. (comer)", "comes", "Pour tú, les verbes en -er prennent -es : comes.", "Racine com- + -es."),
  fg("A1", ["present-tense"], "Verbes en -ir", "Complétez : Ellos ___ en Barcelona. (vivir)", "viven", "Ellos demande la terminaison -en pour les verbes en -ir : viven.", "Troisième personne du pluriel."),
  mc("A1", ["present-tense"], "Ir au présent", "Complétez : Yo ___ al mercado.", ["voy", "va", "vas", "vamos"], "voy", "Ir est irrégulier : voy, vas, va, vamos, vais, van.", "Première personne du singulier."),
  fg("A1", ["present-tense"], "Ir au présent", "Complétez : Nosotros ___ al cine. (ir)", "vamos", "Ir : vamos pour nosotros. Ce verbe est très irrégulier, il faut l'apprendre par cœur.", "Nous allons."),
  fg("A1", ["present-tense"], "Tener au présent", "Complétez : Ella ___ dos hermanos. (tener)", "tiene", "Tener devient tiene à la troisième personne (e → ie).", "Tengo, tienes, tiene…"),
  mc("A1", ["present-tense", "numbers"], "Tener et l'âge", "Complétez : Yo ___ veinte años.", ["tengo", "soy", "estoy", "hago"], "tengo", "L'âge se dit avec tener : tengo veinte años, jamais avec ser.", "En français aussi : j'ai vingt ans."),
  fg("A1", ["present-tense"], "Hacer au présent", "Complétez : Yo ___ la compra los sábados. (hacer)", "hago", "Hacer est irrégulier à la première personne : hago.", "Ce g apparaît seulement avec yo."),
  mc("A1", ["present-tense"], "Querer au présent", "Complétez : ¿___ un café? (tú)", ["Quieres", "Quiero", "Quiere", "Queres"], "Quieres", "Querer change e en ie : quiero, quieres, quiere. Avec tú : quieres.", "Question adressée à tú."),
  fg("A1", ["present-tense", "polite-requests"], "Poder, politesse", "Complétez : ¿___ ayudarme? (usted, poder)", "puede", "Poder change o en ue : puedo, puedes, puede. Avec usted, on emploie puede.", "Troisième personne du singulier."),
  mc("A1", ["location"], "Hay ou está", "Complétez : ___ un banco cerca de aquí.", ["Hay", "Está", "Es", "Son"], "Hay", "Hay introduit quelque chose d'indéfini (un banco) : il y a.", "Un banco quelconque : élément indéfini, donc hay."),
  mc("A1", ["location"], "Hay ou está", "Complétez : El banco ___ en la calle Mayor.", ["está", "hay", "es", "son"], "está", "Avec un élément défini (el banco), on situe avec estar.", "Un banco précis (el banco) : estar."),
  mc("A1", ["object-pronouns"], "Gustar au pluriel", "Complétez : Me ___ los gatos.", ["gustan", "gusta", "gusto", "gustas"], "gustan", "Gustar s'accorde avec ce qui plaît : los gatos est pluriel, donc gustan.", "Qui est le sujet réel ?"),
  fg("A1", ["object-pronouns"], "Gustar au singulier", "Complétez : A él le ___ el café. (gustar)", "gusta", "Le sujet réel est el café (singulier) : gusta.", "Un seul café."),
  mc("A1", ["numbers"], "Les nombres", "Comment dit-on 15 en espagnol ?", ["quince", "cinco", "quinientos", "cincuenta"], "quince", "Quince = 15 ; cinco = 5 ; cincuenta = 50 ; quinientos = 500.", "Pensez à quinze."),
  mc("A1", ["numbers"], "Dire l'heure", "Il est trois heures : ___ las tres.", ["Son", "Es", "Está", "Hay"], "Son", "Pour l'heure, on emploie ser au pluriel (son las tres), mais es la una.", "Las tres est au pluriel."),
  tr("A1", ["present-tense"], "Tener faim", "Traduisez : J'ai faim.", "Tengo hambre.", ["Yo tengo hambre."], "Faim se dit avec tener : tengo hambre, comme tengo sed (soif) ou tengo frío.", "Verbe tener."),
  tr("A1", ["location"], "Où est…", "Traduisez : Où est la gare ?", "¿Dónde está la estación?", ["Dónde está la estación?", "¿Dónde está la estación"], "Pour situer un lieu défini, on emploie estar ; dónde porte un accent.", "Dónde porte un accent."),
  mc("A1", ["polite-requests"], "Politesse", "Quelle phrase est la plus polie ?", ["Quisiera un café, por favor.", "Quiero un café.", "Dame un café.", "Café ya."], "Quisiera un café, por favor.", "Quisiera (conditionnel de politesse) + por favor est la formule la plus courtoise.", "Cherchez je voudrais."),
  mc("A1", ["articles-gender"], "Pluriel des articles", "Complétez : ___ amigos de Pedro son simpáticos.", ["Los", "Las", "El", "La"], "Los", "Amigos est masculin pluriel, donc los amigos.", "Genre et nombre."),
  // A2 (25)
  mc("A2", ["articles-gender"], "Genre : mots en -ma", "Choisissez : ___ problema es difícil.", ["El", "La", "Los", "Las"], "El", "Beaucoup de mots en -ma viennent du grec et sont masculins : el problema, el tema, el idioma.", "Piège : on attendrait un féminin."),
  mc("A2", ["ser-estar"], "Estar : état", "Complétez : La sopa ___ fría.", ["está", "es", "hay", "son"], "está", "Une température ou un état du moment se dit avec estar.", "État passager."),
  mc("A2", ["ser-estar"], "Ser : profession", "Complétez : Mi hermano ___ médico.", ["es", "está", "hay", "tiene"], "es", "La profession se dit avec ser : es médico.", "Identité."),
  fg("A2", ["ser-estar"], "Estar et gérondif", "Complétez : Los niños ___ jugando en el parque. (estar)", "están", "Estar + gérondif exprime une action en cours ; sujet pluriel : están.", "Ils jouent en ce moment."),
  mc("A2", ["object-pronouns"], "Pronom COD", "Complétez : Compro el billete → ___ compro.", ["Lo", "La", "Los", "Le"], "Lo", "Le pronom COD masculin singulier est lo ; il se place avant le verbe.", "El billete est masculin."),
  fg("A2", ["object-pronouns"], "Pronom COD féminin", "Complétez : ¿Las llaves? Sí, ___ tengo aquí.", "las", "Las llaves est féminin pluriel : le pronom est las, placé avant le verbe.", "Genre et nombre de llaves."),
  mc("A2", ["object-pronouns"], "Pronoms COD", "Elle m'appelle tous les jours : Ella ___ llama todos los días.", ["me", "yo", "mí", "mi"], "me", "Le pronom COD de la première personne est me, devant le verbe.", "Pronom court avant le verbe."),
  mc("A2", ["preterite"], "Prétérit en -er", "Complétez : Ayer yo ___ pasta.", ["comí", "como", "comeré", "comía"], "comí", "Hier : prétérit. Verbes en -er : comí, comiste, comió…", "Terminaison accentuée."),
  fg("A2", ["preterite"], "Prétérit en -ar", "Complétez : El año pasado nosotros ___ a Roma. (viajar)", "viajamos", "Au prétérit, nosotros des verbes en -ar fait -amos, comme au présent : viajamos.", "Le contexte (l'année dernière) donne le temps."),
  fg("A2", ["preterite"], "Prétérit, troisième personne", "Complétez : Ayer ella ___ a casa temprano. (llegar)", "llegó", "Prétérit de llegar à la 3e personne du singulier : llegó, avec accent.", "Accent sur le o."),
  mc("A2", ["preterite"], "Prétérit de ir", "Complétez : Anoche ellos ___ al cine.", ["fueron", "iban", "van", "fueran"], "fueron", "Le prétérit de ir est irrégulier : fui, fuiste, fue, fuimos, fuisteis, fueron.", "Action terminée hier soir."),
  fg("A2", ["preterite"], "Hacer au prétérit", "Complétez : ¿Qué ___ tú ayer? (hacer)", "hiciste", "Hacer au prétérit : hice, hiciste, hizo, hicimos, hicisteis, hicieron.", "Pas d accent sur hiciste."),
  mc("A2", ["present-tense"], "Futur proche", "Complétez : Mañana nosotros ___ a visitar el museo.", ["vamos", "vemos", "vayamos", "íbamos"], "vamos", "Ir a + infinitif exprime le futur proche : vamos a visitar.", "Nous allons."),
  fg("A2", ["present-tense"], "Ir a + infinitif", "Complétez : Esta tarde voy ___ comprar pan.", "a", "Ir a + infinitif : la préposition a est obligatoire.", "Petit mot de une lettre."),
  mc("A2", ["everyday-vocabulary"], "Por ou para : destinataire", "Complétez : Este regalo es ___ ti.", ["para", "por", "de", "a"], "para", "Para indique le destinataire ou le but : un cadeau para ti.", "Pour qui ?"),
  mc("A2", ["everyday-vocabulary"], "Por ou para : cause", "Complétez : Gracias ___ tu ayuda.", ["por", "para", "a", "en"], "por", "Gracias por + nom exprime la cause : merci pour ton aide.", "On remercie à cause de quoi ?"),
  mc("A2", ["hotel-travel-vocabulary"], "Para : destination", "Complétez : El tren ___ Sevilla sale a las diez.", ["para", "por", "en", "de"], "para", "Para + lieu indique la destination : el tren para Sevilla.", "Direction."),
  fg("A2", ["duration"], "Desde hace", "Complétez : Vivo en Lyon ___ hace tres años.", "desde", "Desde hace + durée avec le présent traduit depuis : vivo desde hace tres años.", "Depuis."),
  mc("A2", ["duration"], "Hace + que", "Complétez : ___ dos horas que espero.", ["Hace", "Hacen", "Desde", "Hay"], "Hace", "Hace + durée + que + présent : cela fait deux heures que j'attends. Hace reste invariable.", "Verbe hacer au singulier."),
  mc("A2", ["obligation"], "Tener que", "Complétez : Mañana ___ levantarme temprano.", ["tengo que", "tengo de", "tengo a", "tengo para"], "tengo que", "L'obligation se dit tener que + infinitif.", "Je dois…"),
  fg("A2", ["obligation"], "Deber", "Complétez : Usted ___ descansar. (deber)", "debe", "Deber + infinitif exprime un devoir ou un conseil ferme ; avec usted : debe.", "Troisième personne."),
  mc("A2", ["quantities"], "Comparatif", "Complétez : Mi hermano es ___ alto que yo.", ["más", "mucho", "muy", "tan"], "más", "Comparatif de supériorité : más + adjectif + que.", "Plus grand que moi."),
  fg("A2", ["quantities"], "Égalité", "Complétez : Este hotel es tan caro ___ el otro.", "como", "Tan + adjectif + como exprime l'égalité : aussi cher que.", "Mot de liaison."),
  tr("A2", ["present-tense"], "Futur proche", "Traduisez : Nous allons à la plage.", "Vamos a la playa.", ["Nosotros vamos a la playa."], "Ir a + lieu signifie aller à ; le pronom nosotros est facultatif.", "Verbe ir, première personne du pluriel."),
  tr("A2", ["health-vocabulary", "present-tense"], "Necesitar", "Traduisez : J'ai besoin d'un médecin.", "Necesito un médico.", ["Yo necesito un médico."], "Necesitar se construit sans préposition : necesito un médico.", "Pas de de."),
  // B1 (10)
  mc("B1", ["ser-estar"], "Ser : nature", "Choisissez : Ese profesor ___ aburrido. (il est ennuyeux par nature)", ["es", "está", "hay", "ha"], "es", "Avec ser, aburrido décrit la nature de la personne (ennuyeux) ; avec estar, il décrit un état (ennuyé).", "Caractère durable."),
  mc("B1", ["ser-estar"], "Estar : état", "Complétez : Hoy ___ muy aburrido porque no tengo nada que hacer.", ["estoy", "soy", "tengo", "hay"], "estoy", "Estoy aburrido veut dire je m'ennuie : estar donne le sens d'état passager.", "Aburrido ici : je m'ennuie."),
  mc("B1", ["imperfect"], "Imparfait descriptif", "Complétez : Cuando ___ niño, vivía en Lyon.", ["era", "fui", "soy", "seré"], "era", "Cuando era niño décrit une période passée : imparfait era.", "Même temps que vivía."),
  fg("B1", ["imperfect"], "Imparfait en cours", "Complétez : Cuando sonó el teléfono, yo ___ la cena. (preparar, action en cours)", "preparaba", "L'action en cours quand un événement arrive se met à l'imparfait : preparaba.", "Terminaison en -aba."),
  mc("B1", ["preterite"], "Prétérit : événement", "Complétez : De repente ___ un ruido muy fuerte.", ["sonó", "sonaba", "suena", "sonará"], "sonó", "De repente annonce un événement ponctuel : prétérit sonó.", "Action brusque."),
  fg("B1", ["preterite", "obligation"], "Tener que au passé", "Complétez : El año pasado ___ que cambiar de trabajo. (tener, yo)", "tuve", "Tener est irrégulier au prétérit : tuve, tuviste, tuvo…", "Racine tuv-."),
  mc("B1", ["duration"], "Hace + présent", "Complétez : Hace tres días que no ___ bien.", ["duermo", "dormí", "dormía", "dormiré"], "duermo", "Hace + durée + que : le verbe reste au présent (duermo) car la situation dure encore.", "Situation toujours vraie."),
  fg("B1", ["object-pronouns"], "Se lo", "Complétez : ¿El libro? ___ lo doy a Marta mañana.", "se", "Quand le et lo se suivent, le devient se : se lo doy.", "Ne dites pas le lo."),
  mc("B1", ["everyday-vocabulary"], "Para : but", "Complétez : Estudio español ___ trabajar en Madrid.", ["para", "por", "de", "a"], "para", "Para + infinitif exprime le but : afin de.", "Pour quoi faire ?"),
  tr("B1", ["duration"], "Hace + que", "Traduisez : Cela fait deux ans que j'habite à Madrid.", "Hace dos años que vivo en Madrid.", ["Vivo en Madrid desde hace dos años.", "Hace dos años que vivo en Madrid"], "Hace + durée + que + présent, ou desde hace + durée : les deux structures sont équivalentes.", "Hace + durée…")
];

export const ES_GRAMMAR: HandwrittenExercise[] = GRAMMAR_ROWS.map((g, index) => ({
  id: `es-hw-g-${String(index + 1).padStart(3, "0")}`,
  language: "es",
  level: g.level,
  topic: "grammar",
  type: g.type,
  skillTags: g.skills,
  prompt: g.prompt,
  ...(g.choices ? { choices: g.choices } : {}),
  answer: g.answer,
  ...(g.accepted ? { acceptedAnswers: g.accepted } : {}),
  explanation: g.explanation,
  hint: g.hint,
  focus: g.focus
}));
