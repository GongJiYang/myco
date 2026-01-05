/**
 * 消息处理器：生成问题
 * 接收用户选中的文本，调用AI生成相关问题
 */

import type { PlasmoMessaging } from "@plasmohq/messaging";

import { generateQuestion } from "~utils/api";
import { saveQuestion } from "~utils/storage";

export type RequestBody = {
  text: string;
  context?: string;
};

export type ResponseBody = {
  success: boolean;
  question?: Question;
  error?: string;
};

const handler: PlasmoMessageHandler<RequestBody, ResponseBody> = async (
  req,
  res
) => {
  try {
    const { text, context } = req.body;

    if (!text || text.trim().length === 0) {
      return res.send({
        success: false,
        error: "Text is required"
      });
    }

    // 调用AI生成问题
    const question = await generateQuestion(text, context);

    // 保存到存储
    await saveQuestion(question);

    // 发送响应
    return res.send({
      success: true,
      question
    });
  } catch (error) {
    console.error("Error generating question:", error);
    return res.send({
      success: false,
      error: error.message
    });
  }
};

export default handler;
