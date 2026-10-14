export type LanguageCode = 'es' | 'de' | 'fr' | 'ko' | 'ja' | 'it';

export interface LanguageInfo {
  id: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Adventurous';
  difficultyStars: number;
  learners: string;
  learnersCount: number;
  themeColor: string;
  greetingPhrase: string;
  greetingMeaning: string;
  localeCode: string;
  description: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'translate'
  | 'match_pairs'
  | 'fill_blank'
  | 'listen_choose'
  | 'arrange_words';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  instruction: string;
  targetPhrase?: string;
  phraseAudioText?: string;
  explanation?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface TranslateQuestion extends BaseQuestion {
  type: 'translate';
  promptSentence: string;
  correctAnswer: string;
  wordBank: string[];
}

export interface MatchPairsQuestion extends BaseQuestion {
  type: 'match_pairs';
  pairs: {
    id: string;
    left: string; // foreign word
    right: string; // english translation
  }[];
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  sentenceBefore: string;
  sentenceAfter: string;
  correctWord: string;
  options: string[];
  translationHint: string;
}

export interface ListenChooseQuestion extends BaseQuestion {
  type: 'listen_choose';
  speechPhrase: string;
  options: string[];
  correctIndex: number;
  translation: string;
}

export interface ArrangeWordsQuestion extends BaseQuestion {
  type: 'arrange_words';
  promptSentence: string;
  scrambledWords: string[];
  correctSentence: string[];
  translation: string;
}

export type LessonQuestion =
  | MultipleChoiceQuestion
  | TranslateQuestion
  | MatchPairsQuestion
  | FillBlankQuestion
  | ListenChooseQuestion
  | ArrangeWordsQuestion;

export interface LessonNode {
  id: string;
  unitId: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  estimatedMinutes: number;
  type: 'lesson' | 'quiz' | 'chest';
  questions: LessonQuestion[];
}

export interface Unit {
  id: string;
  languageId: LanguageCode;
  number: number;
  title: string;
  description: string;
  themeColor: string;
  lessons: LessonNode[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'xp' | 'mastery';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rewardXp: number;
}

export interface UserStats {
  vocabularyMastered: number;
  speakingMinutes: number;
  listeningExercises: number;
  grammarQuizzes: number;
  weeklyActivity: { day: string; xp: number; targetReached: boolean }[];
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  currentLanguage: LanguageCode;
  totalXp: number;
  dailyXp: number;
  dailyGoal: number; // e.g. 30 XP
  streak: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  gems: number;
  completedLessonIds: string[];
  currentLevel: number;
  unlockedBadgeIds: string[];
  soundEnabled: boolean;
  ttsSpeed: number;
  stats: UserStats;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  xp: number;
  streak: number;
  language: LanguageCode;
  isCurrentUser?: boolean;
  rank?: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Sapphire' | 'Ruby' | 'Diamond';
}

export interface VocabCard {
  id: string;
  term: string;
  pronunciation?: string;
  meaning: string;
  exampleSentence: string;
  exampleTranslation: string;
  partOfSpeech: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface ArticleSection {
  id: string;
  heading: string;
  content: string[];
  callout?: {
    type: 'tip' | 'warning' | 'vocab' | 'quote';
    title: string;
    text: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
  bulletPoints?: string[];
}

export interface RecommendedProduct {
  name: string;
  category: string;
  price: string;
  rating: number;
  bestFor: string;
  description: string;
  badge?: string;
  highlights?: string[];
}

export interface ProsAndConsData {
  title: string;
  pros: string[];
  cons: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  summary: string;
  category: 'Beginner Guides' | 'App Reviews' | 'Grammar & Syntax' | 'Study Habits' | 'Comparisons & Culture' | 'Pronunciation';
  targetLanguage?: LanguageCode | 'All';
  coverImage: string;
  imageAlt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readTimeMinutes: number;
  featured?: boolean;
  tags: string[];
  introduction: string[];
  tableOfContents: TableOfContentsItem[];
  sections: ArticleSection[];
  recommendedProducts: RecommendedProduct[];
  prosAndCons: ProsAndConsData;
  faqs: FAQItem[];
  conclusion: {
    text: string[];
    ctaHeadline: string;
    ctaPrompt: string;
  };
  relatedArticleSlugs: string[];
}

