import React, { useState, useEffect } from "react";

interface StatsData {
  totalQuestions: number;
  questionsReviewed: number;
  averageRetention: number;
  streakDays: number;
  weeklyActivity: number[];
}

function StatisticsPage() {
  const [stats, setStats] = useState<StatsData>({
    totalQuestions: 0,
    questionsReviewed: 0,
    averageRetention: 0,
    streakDays: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    // TODO: Load statistics from IndexedDB
    console.log("Loading statistics...");
  };

  return (
    <div className="stats-container">
      <h1>Learning Statistics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalQuestions}</div>
          <div className="stat-label">Total Questions</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.questionsReviewed}</div>
          <div className="stat-label">Questions Reviewed</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.averageRetention}%</div>
          <div className="stat-label">Average Retention</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.streakDays}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <div className="weekly-chart">
        <h2>Weekly Activity</h2>
        <div className="chart-bars">
          {stats.weeklyActivity.map((count, index) => (
            <div key={index} className="chart-bar-container">
              <div
                className="chart-bar"
                style={{ height: `${count * 10}px` }}
              />
              <div className="chart-label">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
