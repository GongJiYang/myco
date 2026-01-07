/**
 * 浮动工具栏类型定义
 */

import type { Question } from "~background/adapters/base";

export interface ToolbarPosition {
  x: number;
  y: number;
}

export interface FloatingToolbarProps {
  selection: string;
  position: ToolbarPosition;
  onClose?: () => void;
}

export interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  onClick: () => void;
}

/**
 * API 操作状态
 */
export interface ApiState {
  loading: boolean;
  error: string | null;
}

/**
 * UI 状态
 */
export interface UiState {
  showNotification: boolean;
  notificationMessage: string;
  notificationType: "success" | "error" | "info";
}
