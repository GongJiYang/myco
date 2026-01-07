/**
 * Content Script 入口
 * 监听文本选择并显示浮动工具栏
 */

import React, { useEffect, useState } from "react";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { useTextSelection } from "./components/FloatingToolbar/hooks/useTextSelection";
import type { ToolbarPosition } from "./components/FloatingToolbar/types";

function TextSelectionListener() {
  const { selection, selectionRect, selectionKey, hasSelection } = useTextSelection();
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);

  // 当选中文本变化时，计算工具栏位置
  useEffect(() => {
    if (selectionRect && hasSelection) {
      // 直接计算位置
      const toolbarWidth = 280;
      const toolbarHeight = 50;
      const offset = 10;

      let x = selectionRect.left + selectionRect.width / 2;
      let y = selectionRect.bottom + offset;

      // 左右边界检测
      if (x - toolbarWidth / 2 < 10) {
        x = toolbarWidth / 2 + 10;
      }
      if (x + toolbarWidth / 2 > window.innerWidth - 10) {
        x = window.innerWidth - toolbarWidth / 2 - 10;
      }

      // 如果下方空间不足，显示在上方
      if (selectionRect.bottom + toolbarHeight + offset > window.innerHeight) {
        y = selectionRect.top - toolbarHeight - offset;
      }

      setToolbarPosition({ x, y });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
    // 使用 selectionKey 而不是 selectionRect 作为依赖
    // selectionKey 是一个数字，只有位置真正变化时才会改变
  }, [selectionRect, selectionKey, hasSelection]);

  const handleClose = () => {
    setShowToolbar(false);
  };

  return (
    <>
      {showToolbar && (
        <FloatingToolbar
          position={toolbarPosition}
          selection={selection}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default TextSelectionListener;
