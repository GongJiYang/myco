import React, { useState, useEffect } from "react";

interface Settings {
  apiKey: string;
  dailyGoal: number;
  defaultDifficulty: "easy" | "medium" | "hard";
  reviewAlgorithm: "FSRS" | "SM2";
  notificationsEnabled: boolean;
}

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    dailyGoal: 10,
    defaultDifficulty: "medium",
    reviewAlgorithm: "FSRS",
    notificationsEnabled: true,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await chrome.storage.local.get("settings");
    if (result.settings) {
      setSettings(result.settings);
    }
  };

  const saveSettings = async () => {
    await chrome.storage.local.set({ settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSettingChange = (
    key: keyof Settings,
    value: string | number | boolean
  ) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>API Configuration</h2>
        <div className="setting-item">
          <label>Claude API Key</label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => handleSettingChange("apiKey", e.target.value)}
            placeholder="sk-ant-..."
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Learning Goals</h2>
        <div className="setting-item">
          <label>Daily Review Goal</label>
          <input
            type="number"
            value={settings.dailyGoal}
            onChange={(e) =>
              handleSettingChange("dailyGoal", parseInt(e.target.value))
            }
            min={1}
            max={100}
          />
        </div>

        <div className="setting-item">
          <label>Default Difficulty</label>
          <select
            value={settings.defaultDifficulty}
            onChange={(e) =>
              handleSettingChange("defaultDifficulty", e.target.value)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>Algorithm</h2>
        <div className="setting-item">
          <label>Review Algorithm</label>
          <select
            value={settings.reviewAlgorithm}
            onChange={(e) =>
              handleSettingChange("reviewAlgorithm", e.target.value)
            }
          >
            <option value="FSRS">FSRS (Recommended)</option>
            <option value="SM2">SM-2 (Classic)</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) =>
                handleSettingChange("notificationsEnabled", e.target.checked)
              }
            />
            Enable Review Reminders
          </label>
        </div>
      </div>

      <button
        onClick={saveSettings}
        className={`save-button ${saved ? "saved" : ""}`}
      >
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}

export default SettingsPage;
