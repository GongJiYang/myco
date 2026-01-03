import { useState, useEffect } from "react";
import type { PlasmoStorage } from "@plasmohq/storage";

const storage = new PlasmoStorage();

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    try {
      const result = await storage.get<T>(key);
      setValue(result ?? defaultValue);
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const updateValue = async (newValue: T) => {
    try {
      await storage.set(key, newValue);
      setValue(newValue);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  return [value, updateValue, loading] as const;
}

export function useChromeStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    try {
      const result = await chrome.storage.local.get(key);
      setValue(result[key] ?? defaultValue);
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const updateValue = async (newValue: T) => {
    try {
      await chrome.storage.local.set({ [key]: newValue });
      setValue(newValue);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  return [value, updateValue, loading] as const;
}
