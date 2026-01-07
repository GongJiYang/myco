import type { Question } from "~utils/storage";
import { generateQuestions, QuestionGenerationRequest } from "~background/api-client";

export async function generateQuestionsFromSelection(
  text: string,
  difficulty: "easy" | "medium" | "hard" = "medium",
  count: number = 3
) {
  try {
    const request: QuestionGenerationRequest = {
      text,
      difficulty,
      questionCount: count,
    };

    const questions = await generateQuestions(request);
    return questions;
  } catch (error) {
    console.error("Failed to generate questions:", error);
    throw error;
  }
}

/**
 * Generate a single question from text
 * Returns the first question from the AI response
 * @param text - Source text to generate question from
 * @param context - Optional context for question generation
 * @returns A complete Question object with metadata
 */
export async function generateQuestion(
  text: string,
  context?: string
): Promise<Question> {
  try {
    const request: QuestionGenerationRequest = {
      text,
      context,
      questionCount: 1,
      difficulty: "medium",
    };

    const questions = await generateQuestions(request);

    if (!questions || questions.length === 0) {
      throw new Error("No questions generated");
    }

    const generatedQuestion = questions[0];

    // Convert to Question format with metadata
    const question: Question = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      question: generatedQuestion.question,
      answer: generatedQuestion.answer,
      difficulty: (generatedQuestion.difficulty as "easy" | "medium" | "hard") || "medium",
      createdAt: new Date().toISOString(),
      nextReview: new Date().toISOString(), // Due immediately
      interval: 1,
      easeFactor: 2.5,
      sourceText: text,
    };

    return question;
  } catch (error) {
    console.error("Failed to generate question:", error);
    throw error;
  }
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    // TODO: Implement API key validation
    return apiKey.startsWith("sk-ant-");
  } catch {
    return false;
  }
}
