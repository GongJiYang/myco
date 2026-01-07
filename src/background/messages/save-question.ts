/**
 * 消息处理器：保存问题
 * 将用户创建或AI生成的问题保存到存储中
 */

import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { Question } from "~utils/storage";

import { saveQuestion } from "~utils/storage";

export type RequestBody = {
  question: Question;
};

export type ResponseBody = {
  success: boolean;
  error?: string;
};

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (
  req,
  res
) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.send({
        success: false,
        error: "Question is required"
      });
    }

    // 验证问题数据
    if (!question.question || question.question.trim().length === 0) {
      return res.send({
        success: false,
        error: "Question text is required"
      });
    }

    if (!question.answer || question.answer.trim().length === 0) {
      return res.send({
        success: false,
        error: "Answer is required"
      });
    }

    // 保存到存储
    await saveQuestion(question);

    return res.send({
      success: true
    });
  } catch (error) {
    console.error("Error saving question:", error);
    return res.send({
      success: false,
      error: error.message
    });
  }
};

export default handler;
