import { useState, useCallback } from "react";
import { generateQuestionsFromSelection } from "~utils/api";
import { GeneratedQuestion } from "~types/question";

interface UseAIState {
  loading: boolean;
  error: string | null;
  questions: GeneratedQuestion[];
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    loading: false,
    error: null,
    questions: [],
  });

  const generateQuestions = useCallback(
    async (
      text: string,
      difficulty: "easy" | "medium" | "hard" = "medium",
      count: number = 3
    ) => {
      setState({ loading: true, error: null, questions: [] });

      try {
        const questions = await generateQuestionsFromSelection(
          text,
          difficulty,
          count
        );

        setState({ loading: false, error: null, questions });
        return questions;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate questions";
        setState({ loading: false, error: errorMessage, questions: [] });
        throw error;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearQuestions = useCallback(() => {
    setState({ loading: false, error: null, questions: [] });
  }, []);

  return {
    ...state,
    generateQuestions,
    clearError,
    clearQuestions,
  };
}
