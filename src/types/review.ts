// Review record types

export interface ReviewRecord {
  id: string;
  questionId: string;
  quality: number;
  timeTaken: number;
  reviewedAt: string;
  previousInterval: number;
  newInterval: number;
  previousEaseFactor: number;
  newEaseFactor: number;
  algorithm: "FSRS" | "SM2";
}

export interface ReviewSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  questionsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTimePerQuestion: number;
  questions: ReviewQuestion[];
}

export interface ReviewQuestion {
  questionId: string;
  quality: number;
  timeTaken: number;
}

export interface ReviewStats {
  todayReviews: number;
  weeklyReviews: number;
  totalReviews: number;
  averageRetention: number;
  streakDays: number;
  lastReviewDate: string;
}

export interface ReviewSchedule {
  questionId: string;
  scheduledTime: string;
  priority: number;
}
