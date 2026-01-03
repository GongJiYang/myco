// UI text constants

export const UI_TEXT = {
  POPUP: {
    TITLE: "AI Learning Assistant",
    TODAY_STATS: "Today's Progress",
    QUESTIONS_CREATED: "Questions Created",
    QUESTIONS_REVIEWED: "Reviews Done",
    UPCOMING_REVIEWS: "Upcoming Reviews",
    START_REVIEW: "Start Review",
    VIEW_STATS: "View Statistics",
    SETTINGS: "Settings",
  },
  REVIEW: {
    TITLE: "Review Session",
    SHOW_ANSWER: "Show Answer",
    AGAIN: "Again",
    HARD: "Hard",
    GOOD: "Good",
    EASY: "Easy",
    CORRECT: "Correct",
    INCORRECT: "Incorrect",
    REMAINING: "Remaining",
    COMPLETE: "Review Complete!",
  },
  SETTINGS: {
    TITLE: "Settings",
    API_KEY: "Claude API Key",
    DAILY_GOAL: "Daily Review Goal",
    DEFAULT_DIFFICULTY: "Default Difficulty",
    REVIEW_ALGORITHM: "Review Algorithm",
    NOTIFICATIONS: "Notifications",
    ENABLE_NOTIFICATIONS: "Enable Review Reminders",
    SAVE: "Save Settings",
    SAVED: "Saved!",
  },
  STATS: {
    TITLE: "Learning Statistics",
    TOTAL_QUESTIONS: "Total Questions",
    QUESTIONS_REVIEWED: "Questions Reviewed",
    AVERAGE_RETENTION: "Average Retention",
    STREAK_DAYS: "Day Streak",
    WEEKLY_ACTIVITY: "Weekly Activity",
  },
  NOTIFICATIONS: {
    QUESTION_GENERATED: "Question Generated",
    QUESTION_GENERATED_MESSAGE: "Your learning question has been created!",
    REVIEW_REMINDER: "Review Reminder",
    REVIEW_REMINDER_MESSAGE: "You have {count} questions due for review!",
  },
} as const;

export const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
} as const;

export const BUTTON_STYLES = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  success: "bg-green-500 text-white hover:bg-green-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
} as const;
