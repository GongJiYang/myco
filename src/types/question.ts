// Question data types

export interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
  createdAt: string;
  updatedAt: string;
  nextReview: string;
  interval: number;
  easeFactor: number;
  state: QuestionState;
  sourceText?: string;
  sourceUrl?: string;
  tags: string[];
  metadata?: QuestionMetadata;
}

export type DifficultyLevel = "easy" | "medium" | "hard";

export type QuestionState = "new" | "learning" | "review" | "relearning";

export interface QuestionMetadata {
  generationTime?: number;
  reviewCount: number;
  lastReviewQuality?: number;
  averageQuality?: number;
  lapses: number;
  totalReviews: number;
}

export interface GeneratedQuestionRequest {
  text: string;
  difficulty?: DifficultyLevel;
  questionCount?: number;
  context?: string;
}

export interface GeneratedQuestionResponse {
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
  explanation?: string;
}
