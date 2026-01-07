// Anthropic (Claude) adapter implementation
// Handles question generation using Anthropic's Claude AI models

import Anthropic from "@anthropic-ai/sdk";
import type {
  AIAdapter,
  AdapterConfig,
  GeneratedQuestion,
  QuestionGenerationRequest,
  QuestionGenerationResponse,
} from "~background/adapters/base";
import { getModelConfig } from "~background/adapters/model-config";

/**
 * Anthropic-specific configuration
 */
interface AnthropicConfig extends AdapterConfig {
  model?: "claude-3-5-sonnet-20241022" | "claude-3-haiku-20240307";
  baseURL?: string;
  dangerouslyAllowBrowser?: boolean;
}

/**
 * Anthropic Adapter implementation
 * Implements the AIAdapter interface for Anthropic's Claude models
 */
export class AnthropicAdapter implements AIAdapter {
  readonly provider = "anthropic";
  readonly model: string;
  private client: Anthropic;
  private timeout: number;
  private maxRetries: number;

  constructor(config: AnthropicConfig) {
    this.model = config.model || "claude-3-5-sonnet-20241022";
    this.timeout = config.timeout || 60000;
    this.maxRetries = config.maxRetries || 3;

    this.client = new Anthropic({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      dangerouslyAllowBrowser: config.dangerouslyAllowBrowser || false,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
    });
  }

  /**
   * Generate learning questions using Claude model
   */
  async generateQuestions(
    request: QuestionGenerationRequest
  ): Promise<QuestionGenerationResponse> {
    try {
      const prompt = this.buildPrompt(request);

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const questions = this.parseResponse(message);
      const tokensUsed = message.usage?.input_tokens + message.usage?.output_tokens;

      return {
        questions,
        model: this.model,
        tokensUsed,
      };
    } catch (error) {
      console.error(`Anthropic adapter error (${this.model}):`, error);
      throw new Error(`Anthropic request failed: ${error.message}`);
    }
  }

  /**
   * Validate adapter configuration
   */
  validateConfig(): import("~background/adapters/base").ValidationResult {
    const errors: string[] = [];

    if (!this.client.apiKey) {
      errors.push("API key is missing");
    }

    if (!this.model) {
      errors.push("Model is not specified");
    }

    const modelConfig = getModelConfig(this.model);
    if (!modelConfig) {
      errors.push(`Model configuration not found for: ${this.model}`);
    } else if (modelConfig.provider !== "anthropic") {
      errors.push(`Model ${this.model} is not an Anthropic model`);
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Get model configuration
   */
  getModelConfig() {
    const config = getModelConfig(this.model);
    if (!config) {
      throw new Error(`Model configuration not found for: ${this.model}`);
    }
    return config;
  }

  /**
   * Build prompt for Claude model
   */
  private buildPrompt(request: QuestionGenerationRequest): string {
    const { text, difficulty, questionCount, context } = request;
    const count = questionCount || 3;
    const diff = difficulty || "medium";

    let prompt = `Generate ${count} learning questions from this text`;

    if (context) {
      prompt += `\n\nContext: ${context}`;
    }

    prompt += `:\n\n${text}\n\n`;

    prompt += `Requirements:
1. Difficulty level: ${diff}
2. Generate exactly ${count} questions
3. Each question should include both the question and answer
4. Return the response as JSON with this format:

{
  "questions": [
    {
      "question": "question text",
      "answer": "answer text",
      "difficulty": "easy|medium|hard"
    }
  ]
}`;

    return prompt;
  }

  /**
   * Parse Anthropic response and extract questions
   */
  private parseResponse(message: any): GeneratedQuestion[] {
    try {
      const content = message.content[0];

      if (content.type !== "text") {
        throw new Error("Unexpected response type from Anthropic");
      }

      const text = content.text;

      // Try to parse JSON from response
      const jsonMatch =
        text.match(/```json\n([\s\S]*?)\n```/) ||
        text.match(/```\n([\s\S]*?)\n```/) ||
        text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid response format: missing questions array");
      }

      return parsed.questions;
    } catch (error) {
      console.error("Failed to parse Anthropic response:", error);
      throw new Error(`Failed to parse Anthropic response: ${error.message}`);
    }
  }
}

/**
 * Factory function to create Anthropic adapter
 */
export function createAnthropicAdapter(
  config: AnthropicConfig
): AnthropicAdapter {
  const adapter = new AnthropicAdapter(config);

  const validation = adapter.validateConfig();
  if (!validation.valid) {
    const errorMessage = `Invalid Anthropic adapter configuration for model: ${config.model}\n${
      validation.errors?.join("\n") || "Unknown error"
    }`;
    throw new Error(errorMessage);
  }

  return adapter;
}
