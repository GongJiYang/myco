import React from "react";

interface TodayStatsProps {
  questionsCreated: number;
  questionsReviewed: number;
  upcomingReviews: number;
}

export const TodayStats: React.FC<TodayStatsProps> = ({
  questionsCreated,
  questionsReviewed,
  upcomingReviews,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold mb-2">Today's Progress</h2>
      <div className="space-y-2">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-2xl font-bold text-blue-600">
            {questionsCreated}
          </div>
          <div className="text-xs text-gray-600">Questions Created</div>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="text-2xl font-bold text-green-600">
            {questionsReviewed}
          </div>
          <div className="text-xs text-gray-600">Reviews Done</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <div className="text-2xl font-bold text-yellow-600">
            {upcomingReviews}
          </div>
          <div className="text-xs text-gray-600">Upcoming Reviews</div>
        </div>
      </div>
    </div>
  );
};
