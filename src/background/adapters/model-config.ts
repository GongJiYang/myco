// Model configuration
// Contains pricing, limits, and metadata for all supported AI models

/**
 * Pricing information for a model
 */
export interface ModelPricing {
  inputPrice: number; // Price per 1M input tokens in USD
  outputPrice: number; // Price per 1M output tokens in USD
}

/**
 * Limits and constraints for a model
 */
export interface ModelLimits {
  maxTokens: number; // Maximum tokens in a single request
  maxContextLength: number; // Maximum context window size
  maxOutputTokens: number; // Maximum tokens in response
}

/**
 * Complete configuration for a model
 */
export interface ModelConfig {
  provider: string; // Provider name (anthropic, glm, openai, etc.)
  model: string; // Model identifier
  displayName: string; // Human-readable name
  pricing: ModelPricing;
  limits: ModelLimits;
  features: {
    streaming: boolean;
    functionCalling: boolean;
    vision: boolean;
  };
}

/**
 * Model configurations registry
 */
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  // Anthropic Models
  "claude-3-5-sonnet-20241022": {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    displayName: "Claude 3.5 Sonnet",
    pricing: {
      inputPrice: 3.0,
      outputPrice: 15.0,
    },
    limits: {
      maxTokens: 200000,
      maxContextLength: 200000,
      maxOutputTokens: 8192,
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: true,
    },
  },
  "claude-3-haiku-20240307": {
    provider: "anthropic",
    model: "claude-3-haiku-20240307",
    displayName: "Claude 3 Haiku",
    pricing: {
      inputPrice: 0.25,
      outputPrice: 1.25,
    },
    limits: {
      maxTokens: 200000,
      maxContextLength: 200000,
      maxOutputTokens: 4096,
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: true,
    },
  },

  // ZhipuAI / GLM Models
  "glm-4-plus": {
    provider: "glm",
    model: "glm-4-plus",
    displayName: "GLM-4 Plus",
    pricing: {
      inputPrice: 0.5, // Estimated CNY pricing
      outputPrice: 0.5,
    },
    limits: {
      maxTokens: 128000,
      maxContextLength: 128000,
      maxOutputTokens: 4096,
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: true,
    },
  },
  "glm-4": {
    provider: "glm",
    model: "glm-4",
    displayName: "GLM-4",
    pricing: {
      inputPrice: 0.1,
      outputPrice: 0.1,
    },
    limits: {
      maxTokens: 128000,
      maxContextLength: 128000,
      maxOutputTokens: 4096,
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: false,
    },
  },
  "glm-4-flash": {
    provider: "glm",
    model: "glm-4-flash",
    displayName: "GLM-4 Flash",
    pricing: {
      inputPrice: 0.01,
      outputPrice: 0.01,
    },
    limits: {
      maxTokens: 128000,
      maxContextLength: 128000,
      maxOutputTokens: 4096,
    },
    features: {
      streaming: true,
      functionCalling: false,
      vision: false,
    },
  },

  // Future: OpenAI Models (for expansion)
  "gpt-4o": {
    provider: "openai",
    model: "gpt-4o",
    displayName: "GPT-4o",
    pricing: {
      inputPrice: 2.5,
      outputPrice: 10.0,
    },
    limits: {
      maxTokens: 128000,
      maxContextLength: 128000,
      maxOutputTokens: 4096,
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: true,
    },
  },
};

/**
 * Get model configuration by model name
 */
export function getModelConfig(model: string): ModelConfig | undefined {
  return MODEL_CONFIGS[model];
}

/**
 * Get all models for a specific provider
 */
export function getProviderModels(provider: string): ModelConfig[] {
  return Object.values(MODEL_CONFIGS).filter(
    (config) => config.provider === provider
  );
}

/**
 * Calculate estimated cost for a request
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const config = getModelConfig(model);
  if (!config) return 0;

  const inputCost = (inputTokens / 1000000) * config.pricing.inputPrice;
  const outputCost = (outputTokens / 1000000) * config.pricing.outputPrice;

  return inputCost + outputCost;
}
