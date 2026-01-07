/**
 * 文本选择监听 Hook
 */

import { useEffect, useState } from "react";

export function useTextSelection() {
  const [selection, setSelection] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectionKey, setSelectionKey] = useState(0); // 用于触发更新的计数器

  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString() || "";
      if (selectedText.trim().length > 0) {
        setSelection(selectedText);

        const range = window.getSelection()?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setSelectionRect(rect);
          // 使用 rect 的关键属性生成一个 key，只有位置真正变化时才更新
          setSelectionKey(
            Math.round(rect.left) +
            Math.round(rect.top) +
            Math.round(rect.width) +
            Math.round(rect.height)
          );
        }
      } else {
        setSelection("");
        setSelectionRect(null);
        setSelectionKey(0);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);

  return {
    selection,
    selectionRect,
    selectionKey, // 导出 key 作为稳定的依赖
    hasSelection: selection.trim().length > 0
  };
}
