// API response types

export interface ClaudeAPIResponse {
  id: string;
  type: string;
  role: string;
  content: ContentBlock[];
  model: string;
  stop_reason: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ContentBlock {
  type: string;
  text?: string;
}

export interface QuestionGenerationResponse {
  questions: GeneratedQuestion[];
  metadata: {
    model: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export interface GeneratedQuestion {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: APIError;
  success: boolean;
}
