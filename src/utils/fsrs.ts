// FSRS (Free Spaced Repetition Scheduler) implementation

export interface FSRSItem {
  interval: number;
  easeFactor: number;
  nextReview: Date;
}

export interface FSRSCard {
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: "new" | "learning" | "review" | "relearning";
  lastReview?: Date;
}

export class FSRS {
  private readonly requestRetention = 0.9;
  private readonly maximumInterval = 36500;
  private readonly w = [
    0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18,
    0.05, 0.34, 1.26, 0.29, 2.61,
  ];

  calculate(card: FSRSCard, quality: number): FSRSItem {
    // Quality: 0-5 (0=complete blackout, 5=perfect response)

    const now = new Date();
    const elapsedDays = card.lastReview
      ? (now.getTime() - card.lastReview.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

    let newCard = { ...card };
    let nextInterval = 1;
    let easeFactor = card.stability || 2.5;

    if (quality >= 3) {
      // Correct response
      if (card.state === "new") {
        nextInterval = 1;
        easeFactor = 2.5;
        newCard.state = "learning";
      } else if (card.state === "learning" || card.state === "relearning") {
        nextInterval = 1;
        newCard.state = "review";
      } else {
        // Review state
        nextInterval = Math.ceil(card.interval * easeFactor);
        nextInterval = Math.min(nextInterval, this.maximumInterval);
      }

      // Update ease factor
      easeFactor = Math.max(
        1.3,
        easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      );

      newCard.reps += 1;
      newCard.lapses = 0;
    } else {
      // Incorrect response
      newCard.lapses += 1;
      newCard.state = "relearning";
      nextInterval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    }

    newCard.interval = nextInterval;
    newCard.stability = easeFactor;
    newCard.elapsedDays = elapsedDays;
    newCard.scheduledDays = nextInterval;
    newCard.lastReview = now;

    const nextReview = new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000);

    return {
      interval: nextInterval,
      easeFactor: easeFactor,
      nextReview,
    };
  }
}

export const fsrs = new FSRS();

// Simplified SM-2 algorithm for comparison
export function sm2(
  interval: number,
  easeFactor: number,
  quality: number
): { newInterval: number; newEaseFactor: number } {
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  let newInterval = 1;

  if (quality >= 3) {
    if (interval === 0) {
      newInterval = 1;
    } else if (interval === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.ceil(interval * newEaseFactor);
    }
  } else {
    newInterval = 1;
  }

  return { newInterval, newEaseFactor };
}
