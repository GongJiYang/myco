import React, { useEffect, useState } from "react";
import "./style.css"

function TextSelectionListener() {
  const [selection, setSelection] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

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

  const handleGenerateQuestion = () => {
    // Send message to background script to generate question
    chrome.runtime.sendMessage({
      type: "GENERATE_QUESTION",
      payload: { text: selection },
    });
    setShowButton(false);
  };

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
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
      >
        Generate Question
      </button>
    </div>
  );
}

export default TextSelectionListener;
