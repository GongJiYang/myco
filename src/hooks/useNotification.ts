/**
 * 通知Hook
 * 用于显示浏览器通知
 */

import { useEffect, useState } from "react";

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  type?: "basic" | "image" | "list" | "progress";
}

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  useEffect(() => {
    // 监听权限变化
    if ("Notification" in window) {
      const handler = () => {
        setPermission(Notification.permission);
      };

      Notification.requestPermission().then(handler);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const show = ({ title, body, icon, type = "basic" }: NotificationOptions) => {
    if (permission === "granted") {
      const options: NotificationOptions = {
        body,
        icon: icon || chrome.runtime.getURL("assets/icon-48.png"),
        type
      };

      // 使用 Chrome 扩展通知 API
      if (chrome.notifications) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: options.icon,
          title,
          message: body || "",
          priority: 2
        });
      } else {
        // 回退到标准通知 API
        new Notification(title, options);
      }
    } else {
      console.warn("Notification permission not granted");
    }
  };

  const schedule = (
    { title, body, icon }: NotificationOptions,
    delayMs: number
  ) => {
    return setTimeout(() => {
      show({ title, body, icon });
    }, delayMs);
  };

  return {
    permission,
    requestPermission,
    show,
    schedule
  };
};

export default useNotification;
