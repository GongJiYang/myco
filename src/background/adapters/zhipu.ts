// GLM (ZhipuAI) adapter implementation
// Handles question generation using ZhipuAI's GLM models

import type {
  AIAdapter,
  AdapterConfig,
  GeneratedQuestion,
  QuestionGenerationRequest,
  QuestionGenerationResponse,
} from "~background/adapters/base";
import { getModelConfig } from "~background/adapters/model-config";
import { SignJWT } from "jose";

/**
 * GLM-specific configuration
 */
interface GLMConfig extends AdapterConfig {
  model: "glm-4-plus" | "glm-4" | "glm-4-flash";
  baseURL?: string;
}

/**
 * Generate JWT token for ZhipuAI API
 * Following official specification: https://open.bigmodel.cn/dev/api#generate_token
 */
async function generateToken(apiKey: string): Promise<string> {
  try {
    // API key format: id.secret
    const parts = apiKey.split(".");
    if (parts.length !== 2) {
      throw new Error("Invalid API key format. Expected: id.secret");
    }

    const [id, secret] = parts;

    if (!id || !secret) {
      throw new Error("Invalid API key: missing id or secret");
    }

    // Generate timestamp and expiration
    const timestamp = Date.now();
    const exp = timestamp + 3600 * 1000; // 1 hour from now

    // Create JWT payload according to ZhipuAI specification
    const payload = {
      api_key: id,
      exp: exp,
      timestamp: timestamp,
    };

    // Sign with HS256 algorithm and sign_type header
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", sign_type: "SIGN" })
      .sign(new TextEncoder().encode(secret));

    return token;
  } catch (error) {
    console.error("[GLM JWT] Token generation failed:", error);
    throw new Error(`Failed to generate JWT: ${error.message}`);
  }
}

/**
 * GLM Adapter implementation
 */
export class GLMAdapter implements AIAdapter {
  readonly provider = "glm";
  readonly model: string;
  private apiKey: string;
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;

  constructor(config: GLMConfig) {
    this.model = config.model;
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;

    console.log("[GLM Adapter] Created with manual JWT, model:", this.model);
  }

  /**
   * Generate learning questions using GLM model
   */
  async generateQuestions(
    request: QuestionGenerationRequest
  ): Promise<QuestionGenerationResponse> {
    try {
      const prompt = this.buildPrompt(request);
      const token = await generateToken(this.apiKey);

      const response = await this.makeRequest(
        {
          model: this.model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000,
        },
        token
      );

      const questions = this.parseResponse(response);

      return {
        questions,
        model: this.model,
        tokensUsed: response.usage?.total_tokens,
      };
    } catch (error) {
      console.error(`[GLM Adapter] Error (${this.model}):`, error);
      throw new Error(`GLM request failed: ${error.message}`);
    }
  }

  /**
   * Validate adapter configuration
   */
  validateConfig(): import("~background/adapters/base").ValidationResult {
    const errors: string[] = [];

    if (!this.apiKey) {
      errors.push("API key is missing");
    }

    if (!this.model) {
      errors.push("Model is not specified");
    }

    const modelConfig = getModelConfig(this.model);
    if (!modelConfig) {
      errors.push(`Model configuration not found for: ${this.model}`);
    } else if (modelConfig.provider !== "glm") {
      errors.push(`Model ${this.model} is not a GLM model`);
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
   * Build prompt for GLM model
   */
  private buildPrompt(request: QuestionGenerationRequest): string {
    const { text, difficulty, questionCount, context } = request;
    const count = questionCount || 3;
    const diff = difficulty || "medium";

    let prompt = `请根据以下文本生成 ${count} 个学习问题`;

    if (context) {
      prompt += `，上下文：${context}`;
    }

    prompt += `。

文本内容：
${text}

要求：
1. 难度级别：${diff}
2. 生成 ${count} 个问题
3. 每个问题包含问题和答案
4. 以 JSON 格式返回

返回格式：
{
  "questions": [
    {
      "question": "问题文本",
      "answer": "答案文本",
      "difficulty": "easy|medium|hard"
    }
  ]
}`;

    return prompt;
  }

  /**
   * Make HTTP request to GLM API
   */
  private async makeRequest(request: any, token: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          const response = await fetch(this.baseURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
            signal: controller.signal,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `GLM API error: ${response.status} ${response.statusText} - ${errorText}`
            );
          }

          const data = await response.json();
          clearTimeout(timeoutId);
          return data;
        } catch (error) {
          lastError = error;
          if (attempt < this.maxRetries - 1) {
            // Exponential backoff
            await this.sleep(Math.pow(2, attempt) * 1000);
          }
        }
      }

      throw lastError || new Error("Max retries exceeded");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse GLM response and extract questions
   */
  private parseResponse(response: any): GeneratedQuestion[] {
    try {
      if (!response.choices || response.choices.length === 0) {
        throw new Error("No choices in response");
      }

      const content = response.choices[0].message.content;

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid response format: missing questions array");
      }

      return parsed.questions.map((q: any) => ({
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty || "medium",
      }));
    } catch (error) {
      console.error("[GLM Adapter] Failed to parse response:", error);
      throw new Error(`Failed to parse response: ${error.message}`);
    }
  }

  /**
   * Sleep utility for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create GLM adapter
 */
export function createGLMAdapter(config: GLMConfig): GLMAdapter {
  return new GLMAdapter(config);
}
