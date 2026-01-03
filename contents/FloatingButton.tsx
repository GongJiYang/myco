import React from "react";

interface FloatingButtonProps {
  x: number;
  y: number;
  onClick: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ x, y, onClick }) => {
  return (
    <div
      className="floating-button-container"
      style={{
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translateX(-50%)",
        zIndex: 999999,
      }}
    >
      <button
        onClick={onClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        Generate Question
      </button>
    </div>
  );
};
