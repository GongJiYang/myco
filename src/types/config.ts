// User configuration types

export interface UserSettings {
  apiKey: string;
  dailyGoal: number;
  defaultDifficulty: DifficultyLevel;
  reviewAlgorithm: ReviewAlgorithm;
  notificationsEnabled: boolean;
  notificationTime: string;
  autoPlayAudio: boolean;
  theme: Theme;
  language: string;
}

export type DifficultyLevel = "easy" | "medium" | "hard";

export type ReviewAlgorithm = "FSRS" | "SM2";

export type Theme = "light" | "dark" | "system";

export interface NotificationSettings {
  enabled: boolean;
  time: string; // HH:MM format
  frequency: "daily" | "weekly";
  onlyDue: boolean;
}

export interface ReviewSettings {
  algorithm: ReviewAlgorithm;
  maxReviewsPerDay: number;
  newCardsPerDay: number;
  ordering: "random" | "due" | "difficulty";
}

export interface DisplaySettings {
  theme: Theme;
  fontSize: number;
  showAnswerAutomatically: boolean;
  showProgress: boolean;
}
