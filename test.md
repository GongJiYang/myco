## 项目需求概述
这是一个AI驱动的学习助手扩展,核心功能包括:
1. 在网页上提取用户选中的文本
2. 使用AI(Claude API)生成学习问题
3. 实现间隔重复复习系统
4. 本地存储学习记录和问题
5. 提供复习提醒功能

## 技术栈
- 框架: Plasmo
- 语言: TypeScript
- UI框架: React 18+
- 样式: Tailwind CSS (内联使用)
- AI API: Claude (Anthropic)
- 存储: IndexedDB (本地) + chrome.storage
- 间隔重复算法: FSRS或SM-2

## 需要的文件结构

请帮我生成完整的项目文件夹结构,包括:

### 根目录文件
- package.json (包含必要的依赖和脚本)
- tsconfig.json (TypeScript配置)
- .gitignore (Node.js + Plasmo项目标准ignore)
- README.md (项目说明文档)
- .env.example (环境变量示例文件)

### 核心功能模块
1. **弹窗界面** (popup/)
   - 主入口文件
   - 今日统计展示组件
   - 快速操作按钮组件

2. **内容脚本** (contents/)
   - 文本选择监听
   - 悬浮按钮UI组件
   - 问题生成触发器

3. **后台服务** (background/)
   - 消息监听和路由
   - AI API调用封装
   - 定时任务管理(复习提醒)

4. **全屏页面** (tabs/)
   - 复习页面
   - 学习数据统计页面
   - 设置页面

5. **工具函数** (src/utils/)
   - API调用封装
   - 存储管理(IndexedDB操作)
   - 间隔重复算法实现
   - 内容提取工具(Readability等)
   - 日期时间工具

6. **类型定义** (src/types/)
   - 问题数据类型
   - 用户配置类型
   - API响应类型
   - 复习记录类型

7. **常量配置** (src/constants/)
   - API配置
   - 复习间隔配置
   - UI文本常量

8. **UI组件** (src/components/)
   - 通用按钮组件
   - 问题卡片组件
   - 加载状态组件
   - 错误提示组件

9. **Hooks** (src/hooks/)
   - useStorage (chrome.storage封装)
   - useAI (AI调用封装)
   - useReviewSchedule (复习调度)

10. **静态资源** (assets/)
    - icon-16.png
    - icon-48.png
    - icon-128.png
    - styles/ (全局样式,如果需要)

## 输出格式要求

请以树状结构输出完整的文件和文件夹列表,格式如下:　