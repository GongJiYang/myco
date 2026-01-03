import React from "react";
import { useState, useEffect } from "react";

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

  const handleStartReview = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.create({ url: "tabs/review.html" });
  };

  const handleViewStats = async () => {
    chrome.tabs.create({ url: "tabs/stats.html" });
  };

  const handleSettings = async () => {
    chrome.tabs.create({ url: "tabs/settings.html" });
  };

  return (
    <div style={{
      width: '320px',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#111827'
      }}>
        AI Learning Assistant
      </h1>

      <div style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#374151'
        }}>
          Today&apos;s Progress
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          <div style={{
            backgroundColor: '#eff6ff',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2563eb'
            }}>
              {todayStats.questionsCreated}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#4b5563'
            }}>
              Questions Created
            </div>
          </div>
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#16a34a'
            }}>
              {todayStats.questionsReviewed}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#4b5563'
            }}>
              Reviews Done
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={handleStartReview}
          style={{
            width: '100%',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Start Review
        </button>
        <button
          onClick={handleViewStats}
          style={{
            width: '100%',
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
        >
          View Statistics
        </button>
        <button
          onClick={handleSettings}
          style={{
            width: '100%',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export default IndexPopup;
