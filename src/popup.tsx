import React from "react";
import { useState, useEffect } from "react";
import "~style.css";

function IndexPopup() {
  const [todayStats, setTodayStats] = useState({
    questionsCreated: 0,
    questionsReviewed: 0,
    upcomingReviews: 0,
  });

  useEffect(() => {
    // Load today's statistics
    loadStats();
  }, []);

  const loadStats = async () => {
    // TODO: Load stats from chrome.storage
    setTodayStats({
      questionsCreated: 0,
      questionsReviewed: 0,
      upcomingReviews: 0,
    });
  };

  const openSettings = async () => {
    try {
      console.log("Opening settings page...");
      await chrome.runtime.openOptionsPage();
      console.log("Settings page opened successfully");
    } catch (error) {
      console.error("Failed to open settings:", error);
      // Fallback: try to open options.html directly
      try {
        const optionsUrl = chrome.runtime.getURL("options.html");
        await chrome.tabs.create({ url: optionsUrl });
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }
  };

  const openReview = async () => {
    try {
      console.log("Opening review page...");
      await chrome.tabs.create({ url: "tabs/review.html" });
      console.log("Review page opened successfully");
    } catch (error) {
      console.error("Failed to open review:", error);
    }
  };

  const openStats = async () => {
    try {
      console.log("Opening stats page...");
      await chrome.tabs.create({ url: "tabs/stats.html" });
      console.log("Stats page opened successfully");
    } catch (error) {
      console.error("Failed to open stats:", error);
    }
  };

  return (
    <div className="w-80 p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">AI Learning Assistant</h1>

      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Today's Progress</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {todayStats.questionsCreated}
            </div>
            <div className="text-xs text-gray-600">Questions Created</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-2xl font-bold text-green-600">
              {todayStats.questionsReviewed}
            </div>
            <div className="text-xs text-gray-600">Reviews Done</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={openReview}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Start Review
        </button>
        <button
          onClick={openStats}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          View Statistics
        </button>
        <button
          onClick={openSettings}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export default IndexPopup;
