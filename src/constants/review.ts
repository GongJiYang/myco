// Review interval configuration

export const REVIEW_INTERVALS = {
  FSRS: {
    MINIMUM_INTERVAL: 1, // day
    MAXIMUM_INTERVAL: 36500, // ~100 years
    DEFAULT_EASE_FACTOR: 2.5,
    MINIMUM_EASE_FACTOR: 1.3,
  },
  SM2: {
    INITIAL_INTERVAL: 1,
    SECOND_INTERVAL: 6,
    MAXIMUM_INTERVAL: 36500,
    DEFAULT_EASE_FACTOR: 2.5,
    MINIMUM_EASE_FACTOR: 1.3,
  },
} as const;

export const REVIEW_QUALITY = {
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
} as const;

export const REVIEW_SCHEDULE = {
  DEFAULT_DAILY_GOAL: 20,
  DEFAULT_NEW_CARDS_PER_DAY: 10,
  MAX_REVIEWS_PER_SESSION: 100,
  REVIEW_REMINDER_INTERVAL: 60, // minutes
} as const;

export const CARD_STATE = {
  NEW: "new",
  LEARNING: "learning",
  REVIEW: "review",
  RELEARNING: "relearning",
} as const;
