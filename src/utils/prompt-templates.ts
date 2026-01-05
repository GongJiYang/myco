/**
 * AI 提示词模板
 * 用于生成问题和相关学习内容的预设提示词
 */

/**
 * 生成问题的提示词模板
 */
export const GENERATE_QUESTION_TEMPLATE = (
  text: string,
  context?: string
): string => {
  const contextSection = context
    ? `\n上下文信息：${context}\n`
    : "";

  return `你是一个专业的学习助手。请基于以下文本内容生成一个高质量的问题。

${contextSection}文本内容：
${text}

要求：
1. 问题应该针对文本的核心概念或关键信息
2. 问题应该能够测试读者对文本的深入理解
3. 避免简单的记忆性问题，更注重理解和应用
4. 问题应该清晰、具体、无歧义
5. 返回JSON格式，包含question（问题文本）和answer（答案要点）

请以JSON格式回复：
{
  "question": "你的问题",
  "answer": ["答案要点1", "答案要点2", "答案要点3"],
  "difficulty": "easy|medium|hard",
  "tags": ["标签1", "标签2"]
}`;
};

/**
 * 生成多个问题的提示词模板
 */
export const GENERATE_QUESTIONS_TEMPLATE = (
  text: string,
  count: number = 3
): string => {
  return `你是一个专业的学习助手。请基于以下文本内容生成 ${count} 个不同难度的问题。

文本内容：
${text}

要求：
1. 生成 ${count} 个不同难度的问题（至少包含一个简单、一个中等、一个困难）
2. 问题应该覆盖文本的不同方面
3. 每个问题都应该能够测试深入理解
4. 返回JSON数组格式

请以JSON格式回复：
[
  {
    "question": "问题1",
    "answer": ["答案要点1", "答案要点2"],
    "difficulty": "easy",
    "tags": ["标签1"]
  },
  {
    "question": "问题2",
    "answer": ["答案要点1", "答案要点2"],
    "difficulty": "medium",
    "tags": ["标签2"]
  },
  {
    "question": "问题3",
    "answer": ["答案要点1", "答案要点2"],
    "difficulty": "hard",
    "tags": ["标签3"]
  }
]`;
};

/**
 * 生成总结的提示词模板
 */
export const GENERATE_SUMMARY_TEMPLATE = (text: string): string => {
  return `请为以下文本生成一个简洁的总结（不超过100字）：

${text}

要求：
1. 捕捉文本的主要观点
2. 简洁明了，易于理解
3. 不要遗漏关键信息

请直接返回总结文本，不要包含其他内容。`;
};

/**
 * 生成知识点的提示词模板
 */
export const GENERATE_KEY_POINTS_TEMPLATE = (text: string): string => {
  return `请从以下文本中提取5个最重要的知识点：

${text}

要求：
1. 每个知识点应该简洁、独立
2. 按重要性排序
3. 使用列表格式

请以JSON格式回复：
{
  "keyPoints": [
    "知识点1",
    "知识点2",
    "知识点3",
    "知识点4",
    "知识点5"
  ]
}`;
};

/**
 * 改进问题的提示词模板
 */
export const IMPROVE_QUESTION_TEMPLATE = (question: string): string => {
  return `请改进以下问题，使其更加清晰和有效：

原始问题：${question}

改进方向：
1. 使问题更加具体和明确
2. 避免歧义
3. 提高问题的思维层次
4. 保持问题的核心意图

请以JSON格式回复：
{
  "improvedQuestion": "改进后的问题",
  "reasoning": "改进的理由"
}`;
};

/**
 * API 提示词配置
 */
export const PROMPT_CONFIG = {
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.9,
  frequencyPenalty: 0.3,
  presencePenalty: 0.3
} as const;
