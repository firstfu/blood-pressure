/**
 * @file notificationService.ts
 * @author FirstFu
 * @date 2024-03-21
 * @description 通知服務
 * 處理應用程序的通知相關功能：
 * 1. 通知權限管理
 * 2. 排程通知
 * 3. 取消通知
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 設置通知處理程序
export const configureNotifications = () => {
  // 設置如何處理收到的通知
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // 設置通知通道（僅 Android）
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("blood-pressure-reminders", {
      name: "血壓提醒",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

// 檢查通知權限
export const checkNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  return true;
};

// 創建每日重複的通知觸發器
export const createDailyTrigger = (hour: number, minute: number): Notifications.NotificationTriggerInput => {
  return {
    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
    hour: hour,
    minute: minute,
    repeats: true,
  };
};

// 排程通知
export const scheduleNotification = async ({
  id,
  title,
  body,
  hour,
  minute,
  sound = true,
  vibrate = true,
  trigger,
}: {
  id: string;
  title: string;
  body: string;
  hour?: number;
  minute?: number;
  sound?: boolean;
  vibrate?: boolean;
  trigger?: Notifications.NotificationTriggerInput;
}) => {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      throw new Error("沒有通知權限");
    }

    // 取消現有的通知（如果存在）
    await cancelNotification(id);

    // 使用提供的觸發器或創建每日重複的觸發器
    const notificationTrigger = trigger || (hour !== undefined && minute !== undefined ? createDailyTrigger(hour, minute) : undefined);

    if (!notificationTrigger) {
      throw new Error("未提供有效的通知觸發器");
    }

    // 排程通知
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound,
        data: { id, vibrate },
      },
      trigger: notificationTrigger,
      identifier: id,
    });

    // 儲存通知配置
    await saveNotificationConfig({
      id,
      title,
      body,
      hour: hour || 0,
      minute: minute || 0,
      sound,
      vibrate,
    });

    return id;
  } catch (error) {
    console.error("排程通知失敗:", error);
    throw error;
  }
};

// 取消通知
export const cancelNotification = async (id: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    await removeNotificationConfig(id);
  } catch (error) {
    console.error("取消通知失敗:", error);
  }
};

// 取消所有通知
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem("@notifications");
  } catch (error) {
    console.error("取消所有通知失敗:", error);
  }
};

// 儲存通知配置
const saveNotificationConfig = async (config: { id: string; title: string; body: string; hour: number; minute: number; sound?: boolean; vibrate?: boolean }) => {
  try {
    const existingConfigs = await getNotificationConfigs();
    const newConfigs = { ...existingConfigs, [config.id]: config };
    await AsyncStorage.setItem("@notifications", JSON.stringify(newConfigs));
  } catch (error) {
    console.error("儲存通知配置失敗:", error);
  }
};

// 移除通知配置
const removeNotificationConfig = async (id: string) => {
  try {
    const existingConfigs = await getNotificationConfigs();
    delete existingConfigs[id];
    await AsyncStorage.setItem("@notifications", JSON.stringify(existingConfigs));
  } catch (error) {
    console.error("移除通知配置失敗:", error);
  }
};

// 獲取所有通知配置
export const getNotificationConfigs = async () => {
  try {
    const configs = await AsyncStorage.getItem("@notifications");
    return configs ? JSON.parse(configs) : {};
  } catch (error) {
    console.error("獲取通知配置失敗:", error);
    return {};
  }
};
