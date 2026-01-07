// Base adapter interface for AI providers
// Defines the standard contract that all AI provider adapters must implement

import type { ModelConfig } from "~background/adapters/model-config";

/**
 * Request interface for generating learning questions
 */
export interface QuestionGenerationRequest {
  text: string;
  difficulty?: "easy" | "medium" | "hard";
  questionCount?: number;
  context?: string;
}

/**
 * Interface for a generated question
 */
export interface GeneratedQuestion {
  question: string;
  answer: string;
  difficulty: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Response interface from AI providers
 */
export interface QuestionGenerationResponse {
  questions: GeneratedQuestion[];
  model: string;
  tokensUsed?: number;
}

/**
 * Base adapter interface for AI providers
 * All providers must implement this interface to ensure compatibility
 */
export interface AIAdapter {
  /**
   * Get the provider name (e.g., 'anthropic', 'glm', 'openai')
   */
  readonly provider: string;

  /**
   * Get the model identifier
   */
  readonly model: string;

  /**
   * Generate learning questions from provided text
   * @param request - Question generation parameters
   * @returns Promise<QuestionGenerationResponse> - Generated questions with metadata
   */
  generateQuestions(
    request: QuestionGenerationRequest
  ): Promise<QuestionGenerationResponse>;

  /**
   * Validate the adapter configuration
   * @returns true if configuration is valid
   */
  validateConfig(): ValidationResult;

  /**
   * Get the model configuration
   * @returns ModelConfig for this adapter
   */
  getModelConfig(): ModelConfig;
}

/**
 * Base configuration for adapters
 */
export interface AdapterConfig {
  apiKey: string;
  model?: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
}

/**
 * 标准化的错误类型
 */
export enum AIAdapterErrorCode {
  API_KEY_INVALID = 'API_KEY_INVALID',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  TIMEOUT = 'TIMEOUT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  MODEL_NOT_AVAILABLE = 'MODEL_NOT_AVAILABLE'
}

export class AIAdapterError extends Error {
  constructor(
    public code: AIAdapterErrorCode,
    message: string,
    public originalError?: Error,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIAdapterError';
  }
}
// 请求和响应的元数据接口
export interface RequestMetadata {
  requestId?: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface ResponseMetadata {
  requestId?: string;
  timestamp: number;
  latency: number; // 响应时间(ms)
  provider: string;
  model: string;
  cached?: boolean; // 是否来自缓存
}

/* TODO
  流式响应支持
  生命周期管理
  速率限制信息
  类型安全增强
  流式响应
  缓存策略
  日志接口
  工厂模式
*/