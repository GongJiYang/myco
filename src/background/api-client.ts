// API Client for AI services
// Provides a unified interface for multiple AI providers using adapter pattern

import type {
  QuestionGenerationRequest,
  GeneratedQuestion,
} from "~background/adapters/base";

// Re-export types for convenience
export type { QuestionGenerationRequest, GeneratedQuestion };
import { createAnthropicAdapter } from "~background/adapters/anthropic";
import { createGLMAdapter } from "~background/adapters/zhipu";

/**
 * Supported AI providers
 */
export type AIProvider = "anthropic" | "glm";

/**
 * Configuration for AI client
 */
export interface AIClientConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  baseURL?: string;
}

/**
 * AI Client class that manages provider adapters
 */
export class AIClient {
  private adapter: any; // AIAdapter instance
  private provider: AIProvider;

  constructor(config: AIClientConfig) {
    this.provider = config.provider;

    // Create appropriate adapter based on provider
    switch (config.provider) {
      case "anthropic":
        this.adapter = createAnthropicAdapter({
          apiKey: config.apiKey,
          model: config.model as any,
          baseURL: config.baseURL,
        });
        break;

      case "glm":
        this.adapter = createGLMAdapter({
          apiKey: config.apiKey,
          model: config.model as any,
          baseURL: config.baseURL,
        });
        break;

      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  /**
   * Generate learning questions from provided text
   * @param request - Question generation parameters
   * @returns Promise<GeneratedQuestion[]> - Array of generated questions
   */
  async generateQuestions(
    request: QuestionGenerationRequest
  ): Promise<GeneratedQuestion[]> {
    try {
      const response = await this.adapter.generateQuestions(request);
      return response.questions;
    } catch (error) {
      console.error(`Error generating questions with ${this.provider}:`, error);
      throw error;
    }
  }

  /**
   * Get the current provider name
   */
  getProvider(): string {
    return this.provider;
  }

  /**
   * Get the current model name
   */
  getModel(): string {
    return this.adapter.model;
  }

  /**
   * Get model configuration
   */
  getModelConfig() {
    return this.adapter.getModelConfig();
  }
}

/**
 * Default AI client instance
 * Uses Anthropic by default with API key from environment
 */
let defaultClient: AIClient | null = null;

/**
 * Initialize default AI client from chrome.storage
 */
export async function initializeDefaultClient(): Promise<void> {
  console.log("🔍 Initializing AI client from storage...");

  try {
    const result = await new Promise<{ settings?: any }>((resolve) => {
      chrome.storage.local.get(["settings"], (data) => {
        resolve(data);
      });
    });

    const settings = result.settings;

    if (!settings) {
      console.warn("⚠️ No settings found in storage. Please configure API key in settings page.");
      return;
    }

    const { aiProvider, anthropicApiKey, glmApiKey, glmModel } = settings;

    console.log("📋 Settings loaded:", {
      aiProvider,
      hasAnthropicKey: !!anthropicApiKey,
      hasGLMKey: !!glmApiKey,
      glmModel: glmModel || "glm-4 (default)"
    });

    if (aiProvider === "anthropic" && anthropicApiKey) {
      console.log("✅ Using Anthropic (Claude) API");
      defaultClient = new AIClient({
        provider: "anthropic",
        apiKey: anthropicApiKey,
      });
    } else if (aiProvider === "glm" && glmApiKey) {
      console.log("✅ Using Zhipu GLM API");
      defaultClient = new AIClient({
        provider: "glm",
        apiKey: glmApiKey,
        model: glmModel || "glm-4"
      });
    } else {
      console.warn("❌ No valid API key configured for the selected provider");
    }
  } catch (error) {
    console.error("❌ Failed to load settings from storage:", error);
  }
}

/**
 * Get default AI client instance
 */
export async function getDefaultClient(): Promise<AIClient> {
  if (!defaultClient) {
    await initializeDefaultClient();
  }

  if (!defaultClient) {
    throw new Error("AI client not initialized. Please set API key in settings page.");
  }

  return defaultClient;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use AIClient.generateQuestions() instead
 */
export async function generateQuestions(
  request: QuestionGenerationRequest
): Promise<GeneratedQuestion[]> {
  const client = await getDefaultClient();
  return client.generateQuestions(request);
}
