// API configuration constants

export const API_CONFIG = {
  CLAUDE: {
    BASE_URL: "https://api.anthropic.com/v1/messages",
    VERSION: "2023-06-01",
    DEFAULT_MODEL: "claude-3-5-sonnet-20241022",
    MAX_TOKENS: 1000,
    TIMEOUT: 30000,
  },
} as const;

export const QUESTION_GENERATION = {
  DEFAULT_COUNT: 3,
  MIN_TEXT_LENGTH: 50,
  MAX_TEXT_LENGTH: 10000,
  DIFFICULTY_WEIGHTS: {
    easy: 0.3,
    medium: 0.5,
    hard: 0.2,
  },
} as const;

export const STORAGE_KEYS = {
  SETTINGS: "settings",
  QUESTIONS: "questions",
  REVIEWS: "reviews",
  STATS: "stats",
  CACHE: "cache",
} as const;
