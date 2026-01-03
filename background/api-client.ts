import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface QuestionGenerationRequest {
  text: string;
  difficulty?: "easy" | "medium" | "hard";
  questionCount?: number;
}

export interface GeneratedQuestion {
  question: string;
  answer: string;
  difficulty: string;
}

export async function generateQuestions(
  request: QuestionGenerationRequest
): Promise<GeneratedQuestion[]> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Generate ${request.questionCount || 3} learning questions from this text:\n\n${request.text}\n\nReturn the response as JSON with this format:
{
  "questions": [
    {
      "question": "question text",
      "answer": "answer text",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,
        },
      ],
    });

    // Parse the response
    const content = message.content[0];
    if (content.type === "text") {
      const parsed = JSON.parse(content.text);
      return parsed.questions;
    }

    return [];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}
