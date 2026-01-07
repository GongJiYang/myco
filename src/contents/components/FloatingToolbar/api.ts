/**
 * AI 功能 API 调用封装
 * 通过 Plasmo Messaging 与 Background 通信
 */

import { sendToBackground } from "@plasmohq/messaging";
import type { Question } from "~background/adapters/base";

/**
 * 生成问题的请求类型
 */
export type GenerateQuestionRequest = {
  text: string;
  context?: string;
  difficulty?: "easy" | "medium" | "hard";
  questionCount?: number;
};

/**
 * 生成问题的响应类型
 */
export type GenerateQuestionResponse = {
  success: boolean;
  question?: Question;
  error?: string;
};

/**
 * 保存问题的请求类型
 */
export type SaveQuestionRequest = {
  question: Question;
};

/**
 * 保存问题的响应类型
 */
export type SaveQuestionResponse = {
  success: boolean;
  error?: string;
};

/**
 * 调用 Background 生成问题
 */
export async function generateQuestion(
  request: GenerateQuestionRequest
): Promise<Question> {
  const response = await sendToBackground<
    GenerateQuestionRequest,
    GenerateQuestionResponse
  >({
    name: "generate-question",
    body: request
  });

  if (!response.success) {
    throw new Error(response.error || "生成问题失败");
  }

  return response.question!;
}

/**
 * 调用 Background 保存问题
 */
export async function saveQuestion(question: Question): Promise<void> {
  const response = await sendToBackground<
    SaveQuestionRequest,
    SaveQuestionResponse
  >({
    name: "save-question",
    body: { question }
  });

  if (!response.success) {
    throw new Error(response.error || "保存问题失败");
  }
}
