import React, { useState, useEffect } from "react";
import "./options.css";

interface Settings {
  anthropicApiKey: string;
  glmApiKey: string;
  glmModel: "glm-4-plus" | "glm-4" | "glm-4-flash";
  aiProvider: "anthropic" | "glm";
  dailyGoal: number;
  defaultDifficulty: "easy" | "medium" | "hard";
  reviewAlgorithm: "FSRS" | "SM2";
  notificationsEnabled: boolean;
}

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    anthropicApiKey: "",
    glmApiKey: "",
    glmModel: "glm-4",
    aiProvider: "glm",
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
    try {
      const result = await new Promise<{ settings?: Settings }>((resolve) => {
        chrome.storage.local.get(["settings"], (data) => {
          resolve(data);
        });
      });

      if (result.settings) {
        setSettings(result.settings);
        console.log("✓ Settings loaded:", result.settings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ settings }, () => {
          if (chrome.runtime.lastError) {
            console.error("Save error:", chrome.runtime.lastError);
          } else {
            console.log("✓ Settings saved:", settings);
          }
          resolve();
        });
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
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
          <label>AI Provider</label>
          <select
            value={settings.aiProvider}
            onChange={(e) => handleSettingChange("aiProvider", e.target.value)}
          >
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="glm">Zhipu AI (GLM)</option>
          </select>
        </div>

        {settings.aiProvider === "anthropic" && (
          <div className="setting-item">
            <label>Anthropic API Key</label>
            <input
              type="password"
              value={settings.anthropicApiKey}
              onChange={(e) => handleSettingChange("anthropicApiKey", e.target.value)}
              placeholder="sk-ant-..."
            />
            <small>Requires a valid Claude API key from Anthropic</small>
          </div>
        )}

        {settings.aiProvider === "glm" && (
          <>
            <div className="setting-item">
              <label>GLM API Key</label>
              <input
                type="password"
                value={settings.glmApiKey}
                onChange={(e) => handleSettingChange("glmApiKey", e.target.value)}
                placeholder="Enter your GLM API key"
              />
              <small>Requires a valid API key from Zhipu AI</small>
            </div>

            <div className="setting-item">
              <label>GLM Model</label>
              <select
                value={settings.glmModel}
                onChange={(e) => handleSettingChange("glmModel", e.target.value)}
              >
                <option value="glm-4-plus">GLM-4 Plus (Best Quality)</option>
                <option value="glm-4">GLM-4 (Balanced)</option>
                <option value="glm-4-flash">GLM-4 Flash (Fastest)</option>
              </select>
              <small>Select the GLM model to use for question generation</small>
            </div>
          </>
        )}
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
