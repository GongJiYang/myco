/**
 * 消息处理器：获取复习列表
 * 返回当前需要复习的问题列表
 */

import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { Question } from "~utils/storage";

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

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (
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

// 1. 输入验证

// 缺少 limit 参数的范围验证（防止过大或负数）
// 缺少参数类型检查

// 2. 分页支持

// 只有 limit，缺少 offset 或 page 参数
// 无法获取第二页、第三页数据
// 缺少 hasMore 字段（是否还有更多数据）

// 3. 过滤和排序选项

// 缺少按难度过滤（difficulty）
// 缺少按标签/分类过滤（tags, category）
// 缺少排序选项（按到期时间、创建时间、优先级）
// 缺少日期范围过滤（今天到期、本周到期）

// 4. 错误处理细化

// 所有错误统一处理，未区分错误类型
// 直接返回 error.message 可能泄露敏感信息
// 缺少 errorCode 字段

// 5. 响应元数据

// 缺少 nextReviewTime（下一个到期时间）
// 缺少统计信息（今天到期数量、逾期数量）
// 缺少 requestId 追踪
// 缺少 processingTime 性能指标

// 6. 空状态处理

// 当没有待复习问题时，缺少明确的空状态标识
// 无法区分"没有到期"和"查询错误"

// 7. 缓存策略

// 每次请求都查询存储，缺少缓存机制
// 高频调用时可能影响性能

// 8. 日志记录

// 只有错误日志，缺少成功日志
// 缺少请求参数记录
// 缺少性能日志（查询耗时）

// 9. 用户隔离

// 缺少 userId 参数（多用户场景）
// 无法区分不同用户的复习列表

// 10. 批量操作支持

// 只能获取列表，缺少批量标记为已复习的功能
// 缺少批量删除、批量延期等操作