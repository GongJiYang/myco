请为我生成一个Chrome浏览器扩展项目的完整文件树结构。

## 项目信息
- 项目名称: learning-extension
- 框架: Plasmo
- 语言: TypeScript
- UI框架: React 18+
- 主要功能: AI驱动的学习助手，支持文本提取、问题生成、间隔重复复习

## 文件树要求

### 根目录文件
- package.json
- tsconfig.json
- .gitignore
- README.md
- .env.example
- popup.tsx (Plasmo扩展弹窗入口)

### 目录结构
1. **contents/** - 内容脚本(注入到网页)
   - content.tsx (主入口)
   - content.css (可选样式)

2. **background/** - 后台服务
   - index.ts (主入口)
   - messages/ (消息处理器目录)
     - generate-question.ts
     - save-question.ts
     - get-review-list.ts

3. **tabs/** - 全屏独立页面
   - review.tsx (复习页面)
   - stats.tsx (统计页面)
   - settings.tsx (设置页面)

4. **src/** - 源代码主目录
   - **utils/** (工具函数)
     - api.ts (AI API调用)
     - storage.ts (数据存储)
     - fsrs.ts (间隔重复算法)
     - content-extractor.ts (内容提取)
     - date.ts (日期工具)
     - prompt-templates.ts (AI提示词模板)
   
   - **types/** (TypeScript类型定义)
     - question.ts (问题数据类型)
     - review.ts (复习记录类型)
     - config.ts (配置类型)
     - api.ts (API相关类型)
     - index.ts (统一导出)
   
   - **constants/** (常量配置)
     - api.ts (API常量)
     - review.ts (复习相关常量)
     - ui.ts (UI文本常量)
     - index.ts (统一导出)
   
   - **components/** (可复用UI组件)
     - Button.tsx
     - QuestionCard.tsx
     - LoadingSpinner.tsx
     - ErrorMessage.tsx
     - EmptyState.tsx
     - index.ts (统一导出)
   
   - **hooks/** (React自定义Hooks)
     - useStorage.ts
     - useAI.ts
     - useReviewSchedule.ts
     - useNotification.ts
     - index.ts (统一导出)

5. **assets/** - 静态资源
   - icons/
     - icon-16.png
     - icon-48.png
     - icon-128.png
   - images/ (可选)

## 输出格式

请使用ASCII字符绘制树状结构，格式如下：
learning-extension/
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
├── .env.example
├── popup.tsx
├── contents/
│   ├── content.tsx
│   └── content.css
├── background/
│   ├── index.ts
│   └── messages/
│       ├── generate-question.ts
│       ├── save-question.ts
│       └── get-review-list.ts
├── tabs/
│   ├── review.tsx
│   ├── stats.tsx
│   └── settings.tsx
├── src/
│   ├── utils/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   ├── fsrs.ts
│   │   ├── content-extractor.ts
│   │   ├── date.ts
│   │   └── prompt-templates.ts
│   ├── types/
│   │   ├── question.ts
│   │   ├── review.ts
│   │   ├── config.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── api.ts
│   │   ├── review.ts
│   │   ├── ui.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.ts
│   └── hooks/
│       ├── useStorage.ts
│       ├── useAI.ts
│       ├── useReviewSchedule.ts
│       ├── useNotification.ts
│       └── index.ts
└── assets/
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── images/

## 额外要求

1. 为每个文件添加简短的单行注释说明用途
2. 确保所有目录都包含index.ts作为导出入口(如果适用)
3. 使用正确的ASCII字符: ├── │ └──
4. 保持缩进一致，每级缩进4个空格或使用│符号对齐
5. 按照字母顺序排列同级文件/文件夹

请现在生成完整的树结构。