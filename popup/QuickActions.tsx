import React from "react";

interface QuickActionsProps {
  onStartReview: () => void;
  onViewStats: () => void;
  onOpenSettings: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onStartReview,
  onViewStats,
  onOpenSettings,
}) => {
  return (
    <div className="space-y-2">
      <button
        onClick={onStartReview}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Start Review
      </button>
      <button
        onClick={onViewStats}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
      >
        View Statistics
      </button>
      <button
        onClick={onOpenSettings}
        className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
      >
        Settings
      </button>
    </div>
  );
};
