import React, { useEffect, useState } from "react";

import "./style.css";

function TextSelectionListener() {
  // 存储选中文本
  const [selection, setSelection] = useState<string>("");
  // 控制按钮显示隐藏
  const [showButton, setShowButton] = useState(false);
  // 按钮坐标位置
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
// 事件监听
  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString() || "";
      if (selectedText.trim().length > 0) {
        setSelection(selectedText);

        const range = window.getSelection()?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setButtonPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 50,
          });
          setShowButton(true);
        }
      } else {
        setShowButton(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);
// 按钮点击处理
  const handleGenerateQuestion = () => {
    // Send message to background script to generate question
    chrome.runtime.sendMessage({
      type: "GENERATE_QUESTION",
      payload: { text: selection },
    });
    setShowButton(false);
  };
// UI渲染
  if (!showButton) return null;

  return (
    <div
      className="floating-button"
      style={{
        position: "fixed",
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
        transform: "translateX(-50%)",
        zIndex: 999999,
      }}
    >
      <button
        onClick={handleGenerateQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        Generate Question
      </button>
    </div>
  );
}

export default TextSelectionListener;
