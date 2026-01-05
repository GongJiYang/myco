/**
 * 消息处理器：获取复习列表
 * 返回当前需要复习的问题列表
 */

import type { PlasmoMessaging } from "@plasmohq/messaging";

import { getDueReviews } from "~utils/storage";

export type RequestBody = {
  limit?: number;
};

export type ResponseBody = {
  success: boolean;
  reviews?: Question[];
  total?: number;
  error?: string;
};

const handler: PlasmoMessageHandler<RequestBody, ResponseBody> = async (
  req,
  res
) => {
  try {
    const { limit } = req.body;

    // 获取待复习的问题
    const reviews = await getDueReviews(limit);

    return res.send({
      success: true,
      reviews,
      total: reviews.length
    });
  } catch (error) {
    console.error("Error getting review list:", error);
    return res.send({
      success: false,
      error: error.message
    });
  }
};

export default handler;
