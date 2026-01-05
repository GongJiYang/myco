import React from "react"
import { useState, useEffect } from "react"

function IndexPopup() {
  const [todayStats, setTodayStats] = useState({
    questionsCreated: 0,
    questionsReviewed: 0,
    upcomingReviews: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    // TODO: Load stats from chrome.storage
    setTodayStats({
      questionsCreated: 0,
      questionsReviewed: 0,
      upcomingReviews: 0,
    })
  }

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
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Start Review
        </button>
        <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
          View Statistics
        </button>
        <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300">
          Settings
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
