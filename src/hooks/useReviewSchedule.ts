import { useState, useEffect, useCallback } from "react";
import storageManager from "~utils/storage";
import { Question } from "~types/question";

interface ReviewScheduleState {
  dueQuestions: Question[];
  upcomingCount: number;
  loading: boolean;
}

export function useReviewSchedule() {
  const [state, setState] = useState<ReviewScheduleState>({
    dueQuestions: [],
    upcomingCount: 0,
    loading: true,
  });

  useEffect(() => {
    loadSchedule();
    const interval = setInterval(loadSchedule, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadSchedule = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const dueQuestions = await storageManager.getDueQuestions();
      setState({
        dueQuestions,
        upcomingCount: dueQuestions.length,
        loading: false,
      });
    } catch (error) {
      console.error("Error loading review schedule:", error);
      setState({ dueQuestions: [], upcomingCount: 0, loading: false });
    }
  };

  const updateQuestionSchedule = useCallback(
    async (questionId: string, quality: number) => {
      try {
        const question = state.dueQuestions.find((q) => q.id === questionId);
        if (!question) return;

        // Calculate next review using FSRS
        const { fsrs } = await import("~utils/fsrs");
        const card = {
          stability: question.easeFactor,
          difficulty: 3, // Default difficulty
          elapsedDays: 0,
          scheduledDays: question.interval,
          reps: 0,
          lapses: 0,
          state: question.state as any,
          lastReview: new Date(question.nextReview),
        };

        const result = fsrs.calculate(card, quality);

        // Update question
        const updatedQuestion: Question = {
          ...question,
          interval: result.interval,
          easeFactor: result.easeFactor,
          nextReview: result.nextReview.toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await storageManager.updateQuestion(updatedQuestion);
        await loadSchedule(); // Refresh schedule
      } catch (error) {
        console.error("Error updating schedule:", error);
      }
    },
    [state.dueQuestions]
  );

  const getTodayStats = useCallback(async () => {
    // TODO: Implement today's statistics
    return {
      questionsCreated: 0,
      questionsReviewed: 0,
      upcomingReviews: state.upcomingCount,
    };
  }, [state.upcomingCount]);

  return {
    ...state,
    loadSchedule,
    updateQuestionSchedule,
    getTodayStats,
  };
}
