// Review reminder scheduler

interface ReviewTask {
  questionId: string;
  scheduledTime: number;
}

export class ReviewScheduler {
  private static instance: ReviewScheduler;

  private constructor() {}

  static getInstance(): ReviewScheduler {
    if (!ReviewScheduler.instance) {
      ReviewScheduler.instance = new ReviewScheduler();
    }
    return ReviewScheduler.instance;
  }

  async scheduleReview(questionId: string, delayMinutes: number): Promise<void> {
    const scheduledTime = Date.now() + delayMinutes * 60 * 1000;

    await chrome.alarms.create(`review-${questionId}`, {
      when: scheduledTime,
    });

    console.log(`Scheduled review for question ${questionId} at ${new Date(scheduledTime)}`);
  }

  async cancelReview(questionId: string): Promise<void> {
    await chrome.alarms.clear(`review-${questionId}`);
  }

  async getUpcomingReviews(): Promise<ReviewTask[]> {
    const alarms = await chrome.alarms.getAll();
    return alarms
      .filter((alarm) => alarm.name.startsWith("review-"))
      .map((alarm) => ({
        questionId: alarm.name.replace("review-", ""),
        scheduledTime: alarm.scheduledTime || Date.now(),
      }))
      .sort((a, b) => a.scheduledTime - b.scheduledTime);
  }
}

export default ReviewScheduler.getInstance();
