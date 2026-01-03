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

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    // TODO: Implement API key validation
    return apiKey.startsWith("sk-ant-");
  } catch {
    return false;
  }
}
