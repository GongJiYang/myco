/**
 * 浮动工具栏位置计算 Hook
 */

import { useState } from "react";

export interface ToolbarPosition {
  x: number;
  y: number;
}

export interface UseToolbarPositionOptions {
  toolbarWidth?: number;
  toolbarHeight?: number;
  offset?: number;
}

export function useToolbarPosition(options: UseToolbarPositionOptions = {}) {
  const {
    toolbarWidth = 280,
    toolbarHeight = 50,
    offset = 10
  } = options;

  const [position, setPosition] = useState<ToolbarPosition>({ x: 0, y: 0 });

  /**
   * 根据选区矩形计算工具栏位置
   */
  const calculatePosition = (rect: DOMRect): ToolbarPosition => {
    let x = rect.left + rect.width / 2;
    let y = rect.bottom + offset; // fixed定位，直接使用视口坐标

    // 左右边界检测
    if (x - toolbarWidth / 2 < 10) {
      x = toolbarWidth / 2 + 10;
    }
    if (x + toolbarWidth / 2 > window.innerWidth - 10) {
      x = window.innerWidth - toolbarWidth / 2 - 10;
    }

    // 如果下方空间不足，显示在上方
    if (rect.bottom + toolbarHeight + offset > window.innerHeight) {
      y = rect.top - toolbarHeight - offset;
    }

    return { x, y };
  };

  return {
    position,
    setPosition,
    calculatePosition
  };
}
