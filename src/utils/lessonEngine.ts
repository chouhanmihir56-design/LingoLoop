import {
  LanguageCode,
  LessonNode,
  LessonQuestion,
  Unit,
  ProficiencyStage,
  PracticeTopic,
  UserMistake,
  MultipleChoiceQuestion,
  TranslateQuestion,
  MatchPairsQuestion,
  FillBlankQuestion,
  ListenChooseQuestion,
  ArrangeWordsQuestion,
} from '../types';
import { LANGUAGE_CURRICULA, LANGUAGES } from '../data/languages';

// Topic display metadata
export interface TopicMeta {
  id: PracticeTopic;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export const PRACTICE_TOPICS: TopicMeta[] = [
  {
    id: 'all',
    title: 'Adaptive Mix',
    icon: 'Sparkles',
    description: 'Smart balanced mix of all skills, vocabulary, and grammar.',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'greetings',
    title: 'Greetings & Introductions',
    icon: 'Hand',
    description: 'Polite greetings, meeting new people, and conversation openers.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'food',
    title: 'Food & Dining Out',
    icon: 'Utensils',
    description: 'Ordering meals, ingredients, cafe culture, and tasting notes.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'travel',
    title: 'Travel & Navigation',
    icon: 'Compass',
    description: 'Transit, asking directions, hotels, and airport essentials.',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'shopping',
    title: 'Shopping & Commerce',
    icon: 'ShoppingBag',
    description: 'Prices, bargaining, clothing, sizes, and market etiquette.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'daily',
    title: 'Everyday Routines',
    icon: 'Calendar',
    description: 'Daily schedules, habits, home items, and time expressions.',
    color: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'work',
    title: 'Work & Professional',
    icon: 'Briefcase',
    description: 'Office talk, meetings, emails, tech terms, and careers.',
    color: 'from-cyan-500 to-sky-600',
  },
  {
    id: 'social',
    title: 'Social & Opinions',
    icon: 'MessageCircle',
    description: 'Expressing thoughts, agreeing, hobbies, and making plans.',
    color: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'grammar',
    title: 'Grammar & Syntax',
    icon: 'BookOpen',
    description: 'Verb conjugations, sentence structure, prepositions, and tenses.',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'slang',
    title: 'Idioms & Colloquialisms',
    icon: 'Flame',
    description: 'Authentic local expressions, casual banter, and culture notes.',
    color: 'from-orange-500 to-red-600',
  },
];

// Rich validated seed repository for exercise generation across languages & stages
interface SeedContent {
  foreign: string;
  translation: string;
  options: string[];
  explanation: string;
  topic: PracticeTopic;
  stage: ProficiencyStage;
  pairs?: { left: string; right: string }[];
  scrambled?: string[];
  sentenceBefore?: string;
  sentenceAfter?: string;
  correctWord?: string;
  blankOptions?: string[];
}

const EXERCISE_SEEDS: Record<LanguageCode, SeedContent[]> = {
  es: [
    // A1
    {
      foreign: '¿Dónde está la estación de tren?',
      translation: 'Where is the train station?',
      options: ['Where is the bus stop?', 'Where is the train station?', 'How much is the ticket?', 'When does the train arrive?'],
      explanation: '“¿Dónde está...?” is the standard question for location. “La estación de tren” means the train station.',
      topic: 'travel',
      stage: 'A1',
      scrambled: ['¿Dónde', 'está', 'la', 'estación', 'de', 'tren?'],
      sentenceBefore: 'Perdón, ¿dónde',
      sentenceAfter: 'la estación de tren?',
      correctWord: 'está',
      blankOptions: ['está', 'eres', 'tengo', 'vamos'],
    },
    {
      foreign: 'Una mesa para dos personas, por favor.',
      translation: 'A table for two people, please.',
      options: ['Can we see the menu?', 'A table for two people, please.', 'We would like the check, please.', 'Do you have vegetarian food?'],
      explanation: '“Una mesa” is a table, and “para dos personas” means for two people.',
      topic: 'food',
      stage: 'A1',
      scrambled: ['Una', 'mesa', 'para', 'dos', 'personas,', 'por', 'favor.'],
      sentenceBefore: 'Quisiera una mesa',
      sentenceAfter: 'dos personas.',
      correctWord: 'para',
      blankOptions: ['para', 'con', 'sin', 'por'],
    },
    {
      foreign: '¿Cuánto cuesta esta chaqueta?',
      translation: 'How much does this jacket cost?',
      options: ['What size is this jacket?', 'How much does this jacket cost?', 'Do you have this in blue?', 'Can I try this on?'],
      explanation: '“¿Cuánto cuesta...?” is the universal way to ask prices in Spanish.',
      topic: 'shopping',
      stage: 'A1',
      scrambled: ['¿Cuánto', 'cuesta', 'esta', 'chaqueta?'],
      sentenceBefore: 'Disculpe, ¿cuánto',
      sentenceAfter: 'esta camisa?',
      correctWord: 'cuesta',
      blankOptions: ['cuesta', 'gusta', 'tiene', 'hace'],
    },
    {
      foreign: 'Me llamo Sofía y vivo en Madrid.',
      translation: 'My name is Sofia and I live in Madrid.',
      options: ['I am Sofia and I am from Mexico.', 'My name is Sofia and I live in Madrid.', 'Sofia is my friend from Madrid.', 'I work with Sofia in Madrid.'],
      explanation: '“Me llamo” means my name is; “vivo” is the first-person singular of vivir (to live).',
      topic: 'greetings',
      stage: 'A1',
      scrambled: ['Me', 'llamo', 'Sofía', 'y', 'vivo', 'en', 'Madrid.'],
    },
    // A2
    {
      foreign: 'Todos los días me levanto a las siete de la mañana.',
      translation: 'Every day I wake up at seven in the morning.',
      options: ['I went to bed at seven last night.', 'Every day I wake up at seven in the morning.', 'I leave for work at seven.', 'I have breakfast at seven.'],
      explanation: 'Reflexive verb “levantarse”: “me levanto” means I wake up/get up.',
      topic: 'daily',
      stage: 'A2',
      scrambled: ['Todos', 'los', 'días', 'me', 'levanto', 'a', 'las', 'siete.'],
      sentenceBefore: 'Normalmente me',
      sentenceAfter: 'a las siete.',
      correctWord: 'levanto',
      blankOptions: ['levanto', 'despierta', 'duermo', 'salgo'],
    },
    {
      foreign: 'Ayer fui al mercado y compré frutas frescas.',
      translation: 'Yesterday I went to the market and bought fresh fruits.',
      options: ['Tomorrow I will go to the supermarket.', 'Yesterday I went to the market and bought fresh fruits.', 'I like buying fresh fruit at the bakery.', 'We went to the restaurant last night.'],
      explanation: 'Preterite past tense: “fui” (I went, from ir) and “compré” (I bought, from comprar).',
      topic: 'grammar',
      stage: 'A2',
      sentenceBefore: 'Ayer',
      sentenceAfter: 'al supermercado.',
      correctWord: 'fui',
      blankOptions: ['fui', 'iba', 'voy', 'iría'],
    },
    // B1
    {
      foreign: 'Si tuviera más tiempo libre, viajaría por toda América Latina.',
      translation: 'If I had more free time, I would travel across all of Latin America.',
      options: ['When I have free time, I travel often.', 'If I had more free time, I would travel across all of Latin America.', 'I traveled around South America last year.', 'I plan to study Spanish next summer.'],
      explanation: 'Second conditional with imperfect subjunctive (“tuviera”) + conditional (“viajaría”).',
      topic: 'grammar',
      stage: 'B1',
      sentenceBefore: 'Si yo tuviera dinero,',
      sentenceAfter: 'más a menudo.',
      correctWord: 'viajaría',
      blankOptions: ['viajaría', 'viajo', 'viajé', 'viajando'],
    },
    {
      foreign: 'Tenemos una reunión de equipo para revisar el proyecto a las diez.',
      translation: 'We have a team meeting to review the project at ten.',
      options: ['The client sent the project feedback.', 'We have a team meeting to review the project at ten.', 'The deadline is scheduled for tomorrow.', 'Can you review the presentation slides?'],
      explanation: '“Reunión de equipo” is standard professional Spanish for team meeting.',
      topic: 'work',
      stage: 'B1',
    },
    // B2 / C1 Slang & Advanced
    {
      foreign: '¡No pasa nada, tío! Está chupado.',
      translation: "No worries, mate! It's super easy.",
      options: ['Hurry up, we are late!', "No worries, mate! It's super easy.", 'Be careful with that.', 'I am really exhausted today.'],
      explanation: 'In Spain, “está chupado” is a common colloquialism meaning something is a piece of cake / very easy.',
      topic: 'slang',
      stage: 'B2',
    },
    {
      foreign: 'Aunque parezca paradójico, el silencio a menudo comunica más que las palabras.',
      translation: 'Although it may seem paradoxical, silence often communicates more than words.',
      options: ['Silence is always better than talking.', 'Although it may seem paradoxical, silence often communicates more than words.', 'Words are essential for clear teamwork.', 'He remained completely silent during the debate.'],
      explanation: 'Subjunctive after concessive conjunction “aunque parezca” (even though it may appear).',
      topic: 'social',
      stage: 'C1',
    },
  ],

  fr: [
    // A1
    {
      foreign: 'Où se trouve la pharmacie la plus proche ?',
      translation: 'Where is the nearest pharmacy?',
      options: ['Is the pharmacy still open?', 'Where is the nearest pharmacy?', 'Do you have medicine for headache?', 'How far is the hospital?'],
      explanation: '“Où se trouve...” is a polite way to ask where a place is located. “La plus proche” means the nearest.',
      topic: 'travel',
      stage: 'A1',
      scrambled: ['Où', 'se', 'trouve', 'la', 'pharmacie', 'la', 'plus', 'proche ?'],
      sentenceBefore: 'Pardon monsieur, où',
      sentenceAfter: 'la pharmacie ?',
      correctWord: 'se trouve',
      blankOptions: ['se trouve', 'va', 'est-ce', 'fais'],
    },
    {
      foreign: "L'addition, s'il vous plaît.",
      translation: 'The bill, please.',
      options: ['The menu, please.', 'The bill, please.', 'A glass of water, please.', 'Can we order dessert?'],
      explanation: '“L’addition” is the restaurant bill in French-speaking countries.',
      topic: 'food',
      stage: 'A1',
      scrambled: ["L'addition,", "s'il", 'vous', 'plaît.'],
    },
    {
      foreign: 'Je voudrais deux croissants et un café au lait.',
      translation: 'I would like two croissants and a coffee with milk.',
      options: ['Two coffees without sugar please.', 'I would like two croissants and a coffee with milk.', 'Do you serve fresh pastries?', 'A bottle of sparkling water please.'],
      explanation: '“Je voudrais” (conditional of vouloir) is the polite standard: "I would like".',
      topic: 'food',
      stage: 'A1',
      sentenceBefore: 'Bonjour, je',
      sentenceAfter: 'un café au lait.',
      correctWord: 'voudrais',
      blankOptions: ['voudrais', 'veux', 'aime', 'prends'],
    },
    // A2
    {
      foreign: 'Ce matin, le train avait dix minutes de retard.',
      translation: 'This morning, the train was ten minutes late.',
      options: ['The train arrived early today.', 'This morning, the train was ten minutes late.', 'I missed my morning flight.', 'The platform has changed.'],
      explanation: '“Avoir du retard” is the idiomatic expression for being delayed/late.',
      topic: 'daily',
      stage: 'A2',
    },
    // B1 / B2
    {
      foreign: 'Il faut que nous finissions cette présentation avant midi.',
      translation: 'We must finish this presentation before noon.',
      options: ['We started the presentation this morning.', 'We must finish this presentation before noon.', 'Can you email the slides to the team?', 'The presentation was postponed to Friday.'],
      explanation: '“Il faut que...” triggers the subjunctive mood: “nous finissions” (finir).',
      topic: 'grammar',
      stage: 'B1',
      sentenceBefore: 'Il faut que vous',
      sentenceAfter: 'ce travail rapidement.',
      correctWord: 'fassiez',
      blankOptions: ['fassiez', 'faites', 'ferez', 'faisiez'],
    },
    {
      foreign: "Laisse tomber, c'est pas la mer à boire !",
      translation: "Drop it / forget it, it's not the end of the world!",
      options: ['Drink some water, you look tired.', "Drop it / forget it, it's not the end of the world!", 'Be careful with that glass.', 'We need to hurry right now.'],
      explanation: '“Ce n’est pas la mer à boire” is a beloved French idiom meaning "it is not impossible / no big deal".',
      topic: 'slang',
      stage: 'B2',
    },
  ],

  de: [
    // A1
    {
      foreign: 'Entschuldigung, wo ist der nächste Bahnhof?',
      translation: 'Excuse me, where is the nearest train station?',
      options: ['Where can I buy a ticket?', 'Excuse me, where is the nearest train station?', 'Does this train go to Berlin?', 'What time does the bus leave?'],
      explanation: '“Entschuldigung” means excuse me. “Der Bahnhof” is the train station.',
      topic: 'travel',
      stage: 'A1',
      scrambled: ['Entschuldigung,', 'wo', 'ist', 'der', 'nächste', 'Bahnhof?'],
      sentenceBefore: 'Entschuldigung, wo',
      sentenceAfter: 'der Supermarkt?',
      correctWord: 'ist',
      blankOptions: ['ist', 'hat', 'bist', 'sind'],
    },
    {
      foreign: 'Ich hätte gern ein Mineralwasser ohne Kohlensäure.',
      translation: 'I would like still mineral water.',
      options: ['Can we get another beer?', 'I would like still mineral water.', 'Is sparkling water included?', 'Bring us two coffees please.'],
      explanation: '“Ich hätte gern...” is the polite subjunctive standard: "I would like...". “Ohne Kohlensäure” means still (without carbonation).',
      topic: 'food',
      stage: 'A1',
    },
    // A2
    {
      foreign: 'Jeden Samstag gehe ich mit meinen Freunden im Park spazieren.',
      translation: 'Every Saturday I go for a walk in the park with my friends.',
      options: ['I stay home every weekend.', 'Every Saturday I go for a walk in the park with my friends.', 'My friends and I play soccer on Sundays.', 'We meet at the restaurant after work.'],
      explanation: 'Separable verb / verbal construction “spazieren gehen” (to go for a walk). Note German TeKaMoLo time-first word order.',
      topic: 'daily',
      stage: 'A2',
    },
    // B1 / B2
    {
      foreign: 'Obwohl es geregnet hat, haben wir den Ausflug genossen.',
      translation: 'Although it rained, we enjoyed the excursion.',
      options: ['Because it rained, we canceled our trip.', 'Although it rained, we enjoyed the excursion.', 'The weather forecast predicts heavy storm.', 'We stayed inside all afternoon.'],
      explanation: 'Subordinating conjunction “obwohl” sends the inflected verb “hat” to the end of the subordinate clause.',
      topic: 'grammar',
      stage: 'B1',
      sentenceBefore: 'Ich lerne Deutsch,',
      sentenceAfter: 'ich in Deutschland arbeiten möchte.',
      correctWord: 'weil',
      blankOptions: ['weil', 'obwohl', 'trotzdem', 'deshalb'],
    },
    {
      foreign: 'Ich drücke dir die Daumen für das Vorstellungsgespräch!',
      translation: 'I am keeping my fingers crossed for your job interview!',
      options: ['Good luck on your driving test!', 'I am keeping my fingers crossed for your job interview!', 'Did you receive the offer letter?', 'Let me review your resume.'],
      explanation: 'German idiom: “die Daumen drücken” (literally: press the thumbs) means to wish someone good luck / cross fingers.',
      topic: 'slang',
      stage: 'B2',
    },
  ],

  ja: [
    // A1
    {
      foreign: 'すみません、駅はどこですか？',
      translation: 'Excuse me, where is the station?',
      options: ['How much is the subway fare?', 'Excuse me, where is the station?', 'Is this train heading to Shinjuku?', 'Where is the restroom?'],
      explanation: '“Sumimasen” is polite for excuse me/sorry. “Eki wa doko desu ka?” asks where the station is.',
      topic: 'travel',
      stage: 'A1',
      scrambled: ['すみません、', '駅は', 'どこ', 'ですか？'],
      sentenceBefore: 'すみません、トイレは',
      sentenceAfter: 'ですか？',
      correctWord: 'どこ',
      blankOptions: ['どこ', 'だれ', 'いつ', 'なに'],
    },
    {
      foreign: 'これを一つください。',
      translation: 'One of this, please.',
      options: ['Where is this made?', 'One of this, please.', 'Can I pay with credit card?', 'Do you have another color?'],
      explanation: '“Kore o hitotsu kudasai” is the essential phrase when pointing to an item on a menu or in a store.',
      topic: 'shopping',
      stage: 'A1',
    },
    // A2
    {
      foreign: '毎朝七時に起きて、朝ご飯を食べます。',
      translation: 'I wake up at seven every morning and eat breakfast.',
      options: ['I leave for school at eight.', 'I wake up at seven every morning and eat breakfast.', 'I usually skip breakfast on weekdays.', 'My family eats dinner together at seven.'],
      explanation: 'Connecting verb actions using the Te-form: “okite” (waking up) + “tabemasu” (eat).',
      topic: 'daily',
      stage: 'A2',
    },
    // B1 / B2
    {
      foreign: '雨が降っても、明日のハイキングは予定通り行います。',
      translation: 'Even if it rains, tomorrow’s hike will take place as planned.',
      options: ['If it rains tomorrow, we will stay home.', 'Even if it rains, tomorrow’s hike will take place as planned.', 'The weather forecast is clear for tomorrow.', 'Please bring an umbrella just in case.'],
      explanation: 'Grammar pattern: “~temo” expresses "even if / even though".',
      topic: 'grammar',
      stage: 'B1',
    },
    {
      foreign: 'お疲れ様でした！今日も一日頑張りましたね。',
      translation: 'Great work today! You worked really hard.',
      options: ['Welcome to our office!', 'Great work today! You worked really hard.', 'Let’s start the morning meeting.', 'Have a safe trip tomorrow!'],
      explanation: '“Otsukaresama deshita” is an indispensable Japanese cultural phrase acknowledging someone’s hard work.',
      topic: 'work',
      stage: 'B1',
    },
  ],

  ko: [
    // A1
    {
      foreign: '화장실이 어디에 있어요?',
      translation: 'Where is the restroom?',
      options: ['Where is the nearest subway station?', 'Where is the restroom?', 'How much does this cost?', 'What time do you close?'],
      explanation: '“Hwajangsil” is bathroom/restroom. “Eodie isseoyo?” means where is it?',
      topic: 'travel',
      stage: 'A1',
      scrambled: ['화장실이', '어디에', '있어요?'],
      sentenceBefore: '실례합니다, 지하철역이',
      sentenceAfter: '있어요?',
      correctWord: '어디에',
      blankOptions: ['어디에', '언제', '누구', '무엇'],
    },
    {
      foreign: '이거 얼마예요?',
      translation: 'How much is this?',
      options: ['What is this item?', 'How much is this?', 'Can I try this on?', 'Do you have other sizes?'],
      explanation: '“Igeo eolmayeyo?” is the essential shopping phrase in Korea.',
      topic: 'shopping',
      stage: 'A1',
    },
    // A2
    {
      foreign: '한국 음식을 좋아해서 자주 비빔밥을 먹어요.',
      translation: 'I like Korean food, so I often eat bibimbap.',
      options: ['Bibimbap is too spicy for me.', 'I like Korean food, so I often eat bibimbap.', 'I want to learn how to cook Korean dishes.', 'We ordered fried chicken for dinner.'],
      explanation: 'Cause & effect connector “-aseo/-eoseo” (because / so).',
      topic: 'food',
      stage: 'A2',
    },
    // B1 / B2
    {
      foreign: '다음 주 회의 일정을 이메일로 보내 드리겠습니다.',
      translation: 'I will send you the schedule for next week’s meeting by email.',
      options: ['Please review the attached presentation slides.', 'I will send you the schedule for next week’s meeting by email.', 'The meeting has been rescheduled to Friday.', 'Can we meet at the lobby cafe?'],
      explanation: 'High-polite business honorific form “-eodeurida” (to do something for someone respectfully).',
      topic: 'work',
      stage: 'B1',
    },
    {
      foreign: '대박! 진짜 시험에 합격했어?',
      translation: 'Awesome / Wow! Did you really pass the exam?',
      options: ['Study harder for next semester.', 'Awesome / Wow! Did you really pass the exam?', 'I forgot to register for the test.', 'The questions were very challenging.'],
      explanation: '“Daebak” is one of Korea’s most famous modern exclamations expressing shock, praise, or excitement.',
      topic: 'slang',
      stage: 'B2',
    },
  ],

  it: [
    // A1
    {
      foreign: 'Un cappuccino e un cornetto, per favore.',
      translation: 'A cappuccino and a croissant, please.',
      options: ['Can we have the bill please?', 'A cappuccino and a croissant, please.', 'Where is the nearest cafe?', 'A bottle of sparkling water please.'],
      explanation: 'The classic Italian breakfast order at any bar: “un cappuccino e un cornetto”.',
      topic: 'food',
      stage: 'A1',
      scrambled: ['Un', 'cappuccino', 'e', 'un', 'cornetto,', 'per', 'favore.'],
      sentenceBefore: 'Per favore, un',
      sentenceAfter: 'al banco.',
      correctWord: 'caffè',
      blankOptions: ['caffè', 'pasta', 'tavolo', 'conto'],
    },
    {
      foreign: 'Dov’è la fermata dell’autobus più vicina?',
      translation: 'Where is the nearest bus stop?',
      options: ['When does the next train arrive?', 'Where is the nearest bus stop?', 'How much is a metro ticket?', 'Does this bus go to the colosseum?'],
      explanation: '“La fermata dell’autobus” is the bus stop; “più vicina” means nearest.',
      topic: 'travel',
      stage: 'A1',
    },
    // A2
    {
      foreign: 'Ieri sera abbiamo mangiato una pizza deliziosa in centro.',
      translation: 'Last night we ate a delicious pizza downtown.',
      options: ['Tomorrow we will make pasta at home.', 'Last night we ate a delicious pizza downtown.', 'This pizzeria is closed on Mondays.', 'We reserved a table for four people.'],
      explanation: 'Passato prossimo: “abbiamo mangiato” with auxiliary verb avere + past participle.',
      topic: 'daily',
      stage: 'A2',
    },
    // B1 / B2
    {
      foreign: 'Penso che questa città sia meravigliosa di notte.',
      translation: 'I think that this city is wonderful at night.',
      options: ['The monuments are crowded during daytime.', 'I think that this city is wonderful at night.', 'We took a long walk along the river.', 'Public transport runs all night long.'],
      explanation: 'Expressions of opinion (“penso che...”) require the subjunctive mood in Italian: “sia” (congiuntivo presente of essere).',
      topic: 'grammar',
      stage: 'B1',
      sentenceBefore: 'Credo che lui',
      sentenceAfter: 'ragione.',
      correctWord: 'abbia',
      blankOptions: ['abbia', 'ha', 'avrà', 'avere'],
    },
    {
      foreign: 'In bocca al lupo! — Crepi il lupo!',
      translation: 'Good luck! — Thank you / May the wolf die!',
      options: ['Have a great weekend! — You too!', 'Good luck! — Thank you / May the wolf die!', 'Where are you heading? — To the university.', 'Be careful out there! — I will!'],
      explanation: 'The quintessential Italian response to wishing good luck: to “In bocca al lupo” one replies “Crepi!” or “Crepi il lupo!”.',
      topic: 'slang',
      stage: 'B2',
    },
  ],
};

// Vocabulary pairs by language for Match Pairs questions
const VOCAB_PAIRS_REPO: Record<LanguageCode, { left: string; right: string }[]> = {
  es: [
    { left: 'El desayuno', right: 'Breakfast' },
    { left: 'La biblioteca', right: 'Library' },
    { left: 'El billete', right: 'Ticket' },
    { left: 'La cuenta', right: 'The bill' },
    { left: 'Siempre', right: 'Always' },
    { left: 'Nunca', right: 'Never' },
    { left: 'Ayer', right: 'Yesterday' },
    { left: 'Mañana', right: 'Tomorrow' },
    { left: 'El trabajo', right: 'Work / Job' },
    { left: 'La comida', right: 'Food / Meal' },
    { left: 'Cansado', right: 'Tired' },
    { left: 'Feliz', right: 'Happy' },
  ],
  fr: [
    { left: 'Le petit déjeuner', right: 'Breakfast' },
    { left: 'La gare', right: 'Train station' },
    { left: 'Le billet', right: 'Ticket' },
    { left: "L'addition", right: 'The bill' },
    { left: 'Toujours', right: 'Always' },
    { left: 'Jamais', right: 'Never' },
    { left: 'Hier', right: 'Yesterday' },
    { left: 'Demain', right: 'Tomorrow' },
    { left: 'Le travail', right: 'Work / Job' },
    { left: 'La nourriture', right: 'Food' },
    { left: 'Fatigué', right: 'Tired' },
    { left: 'Heureux', right: 'Happy' },
  ],
  de: [
    { left: 'Das Frühstück', right: 'Breakfast' },
    { left: 'Der Bahnhof', right: 'Train station' },
    { left: 'Die Fahrkarte', right: 'Ticket' },
    { left: 'Die Rechnung', right: 'The bill' },
    { left: 'Immer', right: 'Always' },
    { left: 'Nie', right: 'Never' },
    { left: 'Gestern', right: 'Yesterday' },
    { left: 'Morgen', right: 'Tomorrow' },
    { left: 'Die Arbeit', right: 'Work / Job' },
    { left: 'Das Essen', right: 'Food / Meal' },
    { left: 'Müde', right: 'Tired' },
    { left: 'Glücklich', right: 'Happy' },
  ],
  ja: [
    { left: '朝ご飯 (asagohan)', right: 'Breakfast' },
    { left: '駅 (eki)', right: 'Train station' },
    { left: '切符 (kippu)', right: 'Ticket' },
    { left: 'お会計 (okaikei)', right: 'The bill' },
    { left: 'いつも (itsumo)', right: 'Always' },
    { left: '決して (kesshite)', right: 'Never' },
    { left: '昨日 (kinou)', right: 'Yesterday' },
    { left: '明日 (ashita)', right: 'Tomorrow' },
    { left: '仕事 (shigoto)', right: 'Work / Job' },
    { left: '食べ物 (tabemono)', right: 'Food' },
    { left: '疲れた (tsukareta)', right: 'Tired' },
    { left: '嬉しい (ureshii)', right: 'Happy' },
  ],
  ko: [
    { left: '아침식사 (achim)', right: 'Breakfast' },
    { left: '기차역 (gichayeok)', right: 'Train station' },
    { left: '표 (pyo)', right: 'Ticket' },
    { left: '계산서 (gyesanseo)', right: 'The bill' },
    { left: '항상 (hangsang)', right: 'Always' },
    { left: '절대로 (jeoldaero)', right: 'Never' },
    { left: '어제 (eoje)', right: 'Yesterday' },
    { left: '내일 (naeil)', right: 'Tomorrow' },
    { left: '일 / 직업 (il)', right: 'Work / Job' },
    { left: '음식 (eumsik)', right: 'Food' },
    { left: '피곤한 (pigonhan)', right: 'Tired' },
    { left: '행복한 (haengbokhan)', right: 'Happy' },
  ],
  it: [
    { left: 'La colazione', right: 'Breakfast' },
    { left: 'La stazione', right: 'Train station' },
    { left: 'Il biglietto', right: 'Ticket' },
    { left: 'Il conto', right: 'The bill' },
    { left: 'Sempre', right: 'Always' },
    { left: 'Mai', right: 'Never' },
    { left: 'Ieri', right: 'Yesterday' },
    { left: 'Domani', right: 'Tomorrow' },
    { left: 'Il lavoro', right: 'Work / Job' },
    { left: 'Il cibo', right: 'Food' },
    { left: 'Stanco', right: 'Tired' },
    { left: 'Felice', right: 'Happy' },
  ],
};

/**
 * Validates that an exercise object is strictly formed without missing fields or crash hazards
 */
export function validateQuestion(q: LessonQuestion): boolean {
  if (!q || !q.id || !q.type || !q.instruction) return false;

  switch (q.type) {
    case 'multiple_choice':
      return (
        typeof q.prompt === 'string' &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.correctIndex === 'number' &&
        q.correctIndex >= 0 &&
        q.correctIndex < q.options.length
      );
    case 'translate':
      return (
        typeof q.promptSentence === 'string' &&
        typeof q.correctAnswer === 'string' &&
        Array.isArray(q.wordBank) &&
        q.wordBank.length >= 2
      );
    case 'match_pairs':
      return Array.isArray(q.pairs) && q.pairs.length >= 2 && q.pairs.every((p) => p.left && p.right);
    case 'fill_blank':
      return (
        typeof q.correctWord === 'string' &&
        Array.isArray(q.options) &&
        q.options.includes(q.correctWord)
      );
    case 'listen_choose':
      return (
        typeof q.speechPhrase === 'string' &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.correctIndex === 'number' &&
        q.correctIndex >= 0 &&
        q.correctIndex < q.options.length
      );
    case 'arrange_words':
      return (
        typeof q.promptSentence === 'string' &&
        Array.isArray(q.scrambledWords) &&
        Array.isArray(q.correctSentence) &&
        q.correctSentence.length > 0
      );
    default:
      return true;
  }
}

/**
 * Generate a single validated question from seed data
 */
function createQuestionFromSeed(
  seed: SeedContent,
  variantIndex: number,
  typeOverride?: LessonQuestion['type']
): LessonQuestion | null {
  const qId = `gen-${seed.stage}-${seed.topic}-${Math.random().toString(36).substring(2, 9)}`;

  // Determine which exercise type to produce
  const typesAvailable: LessonQuestion['type'][] = ['multiple_choice', 'listen_choose'];
  if (seed.scrambled && seed.scrambled.length > 0) typesAvailable.push('arrange_words', 'translate');
  if (seed.sentenceBefore && seed.correctWord && seed.blankOptions) typesAvailable.push('fill_blank');

  const chosenType = typeOverride || typesAvailable[variantIndex % typesAvailable.length];

  if (chosenType === 'fill_blank' && seed.sentenceBefore && seed.correctWord && seed.blankOptions) {
    const q: FillBlankQuestion = {
      id: qId,
      type: 'fill_blank',
      instruction: 'Select the missing word to complete the sentence:',
      sentenceBefore: seed.sentenceBefore,
      sentenceAfter: seed.sentenceAfter || '',
      correctWord: seed.correctWord,
      options: [...seed.blankOptions].sort(() => 0.5 - Math.random()),
      translationHint: seed.translation,
      explanation: seed.explanation,
      targetPhrase: seed.foreign,
      phraseAudioText: seed.foreign,
    };
    return validateQuestion(q) ? q : null;
  }

  if (chosenType === 'arrange_words' && seed.scrambled) {
    const scrambled = [...seed.scrambled].sort(() => 0.5 - Math.random());
    const q: ArrangeWordsQuestion = {
      id: qId,
      type: 'arrange_words',
      instruction: 'Arrange the words in the correct grammatical order:',
      promptSentence: seed.translation,
      scrambledWords: scrambled,
      correctSentence: seed.scrambled,
      translation: seed.translation,
      explanation: seed.explanation,
      targetPhrase: seed.foreign,
      phraseAudioText: seed.foreign,
    };
    return validateQuestion(q) ? q : null;
  }

  if (chosenType === 'translate' && seed.scrambled) {
    // Collect words and add distractors
    const wordsInAnswer = seed.translation.replace(/[.,?!]/g, '').split(' ');
    const distractors = ['never', 'always', 'today', 'tomorrow', 'please', 'great', 'friend'];
    const wordBank = [...new Set([...wordsInAnswer, ...distractors.slice(0, 3)])].sort(
      () => 0.5 - Math.random()
    );

    const q: TranslateQuestion = {
      id: qId,
      type: 'translate',
      instruction: 'Translate this phrase into English:',
      promptSentence: seed.foreign,
      correctAnswer: seed.translation,
      wordBank,
      explanation: seed.explanation,
      targetPhrase: seed.foreign,
      phraseAudioText: seed.foreign,
    };
    return validateQuestion(q) ? q : null;
  }

  if (chosenType === 'listen_choose') {
    const correctIdx = Math.floor(Math.random() * seed.options.length);
    const shuffledOptions = [...seed.options];
    // Put correct translation at correctIdx
    const otherOptions = seed.options.filter((o) => o !== seed.translation);
    otherOptions.sort(() => 0.5 - Math.random());
    shuffledOptions[correctIdx] = seed.translation;
    let otherPtr = 0;
    for (let i = 0; i < shuffledOptions.length; i++) {
      if (i !== correctIdx) {
        shuffledOptions[i] = otherOptions[otherPtr++] || 'None of the above';
      }
    }

    const q: ListenChooseQuestion = {
      id: qId,
      type: 'listen_choose',
      instruction: 'Listen carefully to the audio and select the correct translation:',
      speechPhrase: seed.foreign,
      options: shuffledOptions,
      correctIndex: correctIdx,
      translation: seed.translation,
      explanation: seed.explanation,
      targetPhrase: seed.foreign,
      phraseAudioText: seed.foreign,
    };
    return validateQuestion(q) ? q : null;
  }

  // Fallback to multiple_choice
  const correctIdx = seed.options.indexOf(seed.translation);
  const q: MultipleChoiceQuestion = {
    id: qId,
    type: 'multiple_choice',
    instruction: 'What is the correct meaning of this sentence?',
    prompt: `“${seed.foreign}”`,
    options: seed.options,
    correctIndex: correctIdx >= 0 ? correctIdx : 0,
    explanation: seed.explanation,
    targetPhrase: seed.foreign,
    phraseAudioText: seed.foreign,
  };
  return validateQuestion(q) ? q : null;
}

/**
 * Generate a dynamic Match Pairs question from the vocabulary bank
 */
function createMatchPairsQuestion(language: LanguageCode): MatchPairsQuestion | null {
  const bank = VOCAB_PAIRS_REPO[language] || VOCAB_PAIRS_REPO.es;
  const shuffled = [...bank].sort(() => 0.5 - Math.random()).slice(0, 4);

  if (shuffled.length < 3) return null;

  const pairs = shuffled.map((item, idx) => ({
    id: `pair-${idx}-${Math.random().toString(36).substring(2, 6)}`,
    left: item.left,
    right: item.right,
  }));

  const q: MatchPairsQuestion = {
    id: `gen-match-${Math.random().toString(36).substring(2, 8)}`,
    type: 'match_pairs',
    instruction: 'Tap matching pairs to connect foreign words with their English translations:',
    pairs,
    explanation: 'Awesome work reinforcing core vocabulary pairs!',
  };

  return validateQuestion(q) ? q : null;
}

export interface GeneratorParams {
  language: LanguageCode;
  topic?: PracticeTopic;
  stage?: ProficiencyStage;
  count?: number;
  recentMistakes?: UserMistake[];
  prioritizeMistakes?: boolean;
}

/**
 * Produces a full round of questions adaptively tailored to user preferences, mistakes, and language
 */
export function generatePracticeRound(params: GeneratorParams): LessonQuestion[] {
  const {
    language,
    topic = 'all',
    stage,
    count = 6,
    recentMistakes = [],
    prioritizeMistakes = false,
  } = params;

  const resultQuestions: LessonQuestion[] = [];
  const seedsPool = EXERCISE_SEEDS[language] || EXERCISE_SEEDS.es;

  // 1. If user has unresolved mistakes and requested mistake review, weave them in first!
  const unresolvedMistakes = recentMistakes.filter(
    (m) => !m.resolved && m.language === language && validateQuestion(m.question)
  );

  if (prioritizeMistakes && unresolvedMistakes.length > 0) {
    const mistakesToTake = unresolvedMistakes.slice(0, Math.min(count, unresolvedMistakes.length));
    mistakesToTake.forEach((m) => {
      // Create a fresh clone of the mistake question with a review indicator
      resultQuestions.push({
        ...m.question,
        id: `review-${m.question.id}-${Date.now()}`,
        instruction: `Mistake Review: ${m.question.instruction}`,
      });
    });
  }

  // 2. Filter seeds by topic and stage if provided
  let filteredSeeds = seedsPool.filter((s) => {
    if (topic !== 'all' && s.topic !== topic) return false;
    if (stage && s.stage !== stage) return false;
    return true;
  });

  if (filteredSeeds.length === 0) {
    // Fallback to all seeds for the language if filter too narrow
    filteredSeeds = seedsPool;
  }

  // 3. Generate varied question types
  const shuffledSeeds = [...filteredSeeds].sort(() => 0.5 - Math.random());
  let seedIndex = 0;

  while (resultQuestions.length < count && seedIndex < shuffledSeeds.length * 2) {
    const seed = shuffledSeeds[seedIndex % shuffledSeeds.length];
    const q = createQuestionFromSeed(seed, seedIndex);
    if (q && !resultQuestions.some((existing) => existing.targetPhrase === q.targetPhrase)) {
      resultQuestions.push(q);
    }
    seedIndex++;
  }

  // 4. Always ensure at least 1 Match Pairs question in a standard round for variety
  if (resultQuestions.length < count || !resultQuestions.some((q) => q.type === 'match_pairs')) {
    const matchPairsQ = createMatchPairsQuestion(language);
    if (matchPairsQ) {
      if (resultQuestions.length >= count) {
        resultQuestions[resultQuestions.length - 1] = matchPairsQ;
      } else {
        resultQuestions.push(matchPairsQ);
      }
    }
  }

  // Shuffle order so different question formats alternate smoothly
  return resultQuestions.sort(() => 0.5 - Math.random());
}

/**
 * Thematic curriculum cycles covering CEFR stages A1 through C2
 */
const INFINITE_CURRICULUM_CYCLES: {
  titleSuffix: string;
  description: string;
  topic: PracticeTopic;
  stage: ProficiencyStage;
  themeColor: string;
}[] = [
  {
    titleSuffix: 'Essential Greetings & Introductions',
    description: 'Master polite phrases, greetings, name introductions, and welcoming small talk.',
    topic: 'greetings',
    stage: 'A1',
    themeColor: 'from-indigo-500 to-purple-600',
  },
  {
    titleSuffix: 'Everyday Routines & Timekeeping',
    description: 'Daily schedules, home life, morning habits, telling time, and day-to-day conversation.',
    topic: 'daily',
    stage: 'A1',
    themeColor: 'from-sky-500 to-indigo-600',
  },
  {
    titleSuffix: 'Dining Out, Cafes & Regional Cuisine',
    description: 'Order authentic meals, cafe beverages, ask for the bill, and express culinary tastes.',
    topic: 'food',
    stage: 'A2',
    themeColor: 'from-emerald-500 to-teal-600',
  },
  {
    titleSuffix: 'City Navigation, Maps & Urban Transit',
    description: 'Ask for directions, buy subway and train tickets, and navigate unfamiliar streets.',
    topic: 'travel',
    stage: 'A2',
    themeColor: 'from-blue-500 to-cyan-600',
  },
  {
    titleSuffix: 'Shopping, Boutiques & Currency',
    description: 'Inquire about prices, try on clothing, sizes, colors, and market bargaining.',
    topic: 'shopping',
    stage: 'A2',
    themeColor: 'from-rose-500 to-pink-600',
  },
  {
    titleSuffix: 'Travel Adventures, Hotels & Bookings',
    description: 'Hotel check-ins, flight inquiries, airport terminals, and transit connections.',
    topic: 'travel',
    stage: 'B1',
    themeColor: 'from-amber-500 to-orange-600',
  },
  {
    titleSuffix: 'Modern Careers, Tech & Workplace',
    description: 'Team meetings, professional correspondence, digital tech vocabulary, and job interviews.',
    topic: 'work',
    stage: 'B1',
    themeColor: 'from-blue-600 to-indigo-700',
  },
  {
    titleSuffix: 'Social Connections, Feelings & Opinions',
    description: 'Express emotions, share hobbies, debate cultural topics, and tell personal stories.',
    topic: 'social',
    stage: 'B1',
    themeColor: 'from-purple-600 to-pink-600',
  },
  {
    titleSuffix: 'Grammar Deep Dive & Subjunctive Mastery',
    description: 'Complex subjunctive mood, hypothetical conditionals, indirect discourse, and connectors.',
    topic: 'grammar',
    stage: 'B2',
    themeColor: 'from-rose-600 to-amber-600',
  },
  {
    titleSuffix: 'Authentic Colloquialisms & Street Slang',
    description: 'Speak like an authentic local with regional idioms, humor, casual banter, and slang.',
    topic: 'slang',
    stage: 'B2',
    themeColor: 'from-orange-500 to-red-600',
  },
  {
    titleSuffix: 'Debate, Media & Persuasive Discourse',
    description: 'Defend viewpoints, analyze current affairs, construct arguments, and articulate nuances.',
    topic: 'social',
    stage: 'C1',
    themeColor: 'from-violet-600 to-indigo-800',
  },
  {
    titleSuffix: 'Spontaneous Native Dialogue & Rapid Listening',
    description: 'High-speed native cadence comprehension, subtle ironies, and idiom mastery.',
    topic: 'slang',
    stage: 'C1',
    themeColor: 'from-pink-600 to-rose-700',
  },
  {
    titleSuffix: 'Cultural Heritage, Lore & Literature',
    description: 'Historical narratives, literary turns of phrase, cultural heritage, and deep context.',
    topic: 'social',
    stage: 'C2',
    themeColor: 'from-teal-600 to-emerald-800',
  },
  {
    titleSuffix: 'High-Stakes Precision & Diplomatic Fluency',
    description: 'Stylistic precision, professional conferences, and sophisticated linguistic command.',
    topic: 'work',
    stage: 'C2',
    themeColor: 'from-indigo-600 to-violet-900',
  },
  {
    titleSuffix: 'Astral Linguistic Summit & Intuitive Command',
    description: 'Flawless spontaneous fluency, dialect switching, and instinctual native mastery.',
    topic: 'all',
    stage: 'C2',
    themeColor: 'from-purple-700 to-pink-600',
  },
  {
    titleSuffix: 'Cosmic Polyglot Benchmark',
    description: 'The pinnacle of bilingual expression, rapid translation, and cultural intuition.',
    topic: 'all',
    stage: 'C2',
    themeColor: 'from-emerald-600 to-cyan-600',
  },
];

/**
 * Generate a single procedural unit for any language and unit number
 */
export function generateProceduralUnit(languageId: LanguageCode, unitNumber: number): Unit {
  const cycleIndex = (unitNumber - 1) % INFINITE_CURRICULUM_CYCLES.length;
  const cycleTier = Math.floor((unitNumber - 1) / INFINITE_CURRICULUM_CYCLES.length) + 1;
  const template = INFINITE_CURRICULUM_CYCLES[cycleIndex];

  const tierPrefix = cycleTier > 1 ? `Mastery Tier ${cycleTier}: ` : '';
  const unitTitle = `Unit ${unitNumber}: ${tierPrefix}${template.titleSuffix}`;
  const unitId = `${languageId}-u${unitNumber}`;

  const lesson1: LessonNode = {
    id: `${unitId}-l1`,
    unitId,
    title: `${template.stage} Core Concepts: ${template.titleSuffix.split(' & ')[0]}`,
    description: `Master high-yield vocabulary and core structures for ${template.topic}.`,
    icon: 'BookOpen',
    xpReward: 25,
    estimatedMinutes: 4,
    type: 'lesson',
    stage: template.stage,
    topic: template.topic,
    questions: generatePracticeRound({
      language: languageId,
      topic: template.topic,
      stage: template.stage,
      count: 5,
    }),
  };

  const lesson2: LessonNode = {
    id: `${unitId}-l2`,
    unitId,
    title: `Conversational Fluency: Real-World Scenarios`,
    description: `Practice sentence construction, rapid listening, and dialogue responses.`,
    icon: 'MessageCircle',
    xpReward: 30,
    estimatedMinutes: 5,
    type: 'lesson',
    stage: template.stage,
    topic: template.topic,
    questions: generatePracticeRound({
      language: languageId,
      topic: template.topic,
      stage: template.stage,
      count: 5,
    }),
  };

  const lesson3: LessonNode = {
    id: `${unitId}-l3`,
    unitId,
    title: `Checkpoint Challenge: ${template.stage} Mastery`,
    description: `Timed multi-skill challenge testing mixed listening, translation, and grammar.`,
    icon: 'Trophy',
    xpReward: 40,
    estimatedMinutes: 5,
    type: 'quiz',
    stage: template.stage,
    topic: template.topic,
    questions: generatePracticeRound({
      language: languageId,
      topic: template.topic,
      stage: template.stage,
      count: 6,
    }),
  };

  const chest: LessonNode = {
    id: `${unitId}-chest`,
    unitId,
    title: `Milestone Chest: Unit ${unitNumber}`,
    description: `Claim +50 Gems & +40 XP reward for completing Unit ${unitNumber}!`,
    icon: 'Gift',
    xpReward: 40,
    estimatedMinutes: 1,
    type: 'chest',
    questions: [],
  };

  return {
    id: unitId,
    languageId,
    number: unitNumber,
    title: unitTitle,
    description: template.description,
    themeColor: template.themeColor,
    stage: template.stage,
    lessons: [lesson1, lesson2, lesson3, chest],
  };
}

/**
 * Returns dynamic curriculum that extends infinitely as the user completes units and levels.
 * Guaranteed to generate at least minUnits (default 16) out of the box for EVERY language.
 */
export function getFullCurriculum(
  languageId: LanguageCode,
  userLevel: number = 1,
  completedLessonIds: string[] = [],
  minUnits: number = 16
): Unit[] {
  // Base pre-curated units
  const baseUnits: Unit[] = (LANGUAGE_CURRICULA[languageId] || LANGUAGE_CURRICULA.es).map((u) => ({
    ...u,
    lessons: [...u.lessons],
  }));

  // Target unit count: at least minUnits (16), or user's level + 8
  const targetCount = Math.max(minUnits, userLevel + 8);

  // Procedurally generate subsequent units up to targetCount
  for (let uNum = baseUnits.length + 1; uNum <= targetCount; uNum++) {
    baseUnits.push(generateProceduralUnit(languageId, uNum));
  }

  return baseUnits;
}
