/**
 * @file reminder.tsx
 * @author FirstFu
 * @date 2024-03-21
 * @module Screens/Reminder
 * @description 血壓測量提醒設置頁面
 * 提供血壓測量的智能提醒功能：
 * 1. 定時提醒設置
 * 2. 重複週期設置
 * 3. 提醒類型設置
 * 4. 提醒方式設置
 */

import { StyleSheet, View, Text, SafeAreaView, ScrollView, Platform, Switch, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";
import { StatusBar } from "expo-status-bar";
import { configureNotifications, scheduleNotification, createDailyTrigger, cancelNotification } from "../../lib/notificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReminderEditor } from "../../components/core/ReminderEditor";

// 提醒類型定義
interface ReminderItem {
  id: string;
  time: Date;
  enabled: boolean;
  type: "morning" | "evening" | "medicine" | "custom";
  days: number[]; // 0-6 代表週日到週六
  sound: boolean;
  vibration: boolean;
  message: string;
}

// 預設提醒設置
const defaultReminders: ReminderItem[] = [
  {
    id: "morning",
    time: new Date(new Date().setHours(8, 0, 0, 0)),
    enabled: true,
    type: "morning",
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: true,
    vibration: true,
    message: "該測量晨間血壓了",
  },
  {
    id: "evening",
    time: new Date(new Date().setHours(20, 0, 0, 0)),
    enabled: true,
    type: "evening",
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: true,
    vibration: true,
    message: "該測量晚間血壓了",
  },
];

export default function ReminderScreen() {
  const [reminders, setReminders] = useState<ReminderItem[]>(defaultReminders);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderItem | null>(null);
  const router = useRouter();

  // 檢查並請求通知權限
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  // 檢查通知權限
  const checkNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("需要通知權限才能設置提醒");
      return;
    }
  };

  // 初始化通知設置
  useEffect(() => {
    configureNotifications();
    loadReminders();
  }, []);

  // 載入已儲存的提醒設置
  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem("@reminders");
      if (savedReminders) {
        const parsedReminders = JSON.parse(savedReminders);
        setReminders(
          parsedReminders.map((reminder: any) => ({
            ...reminder,
            time: new Date(reminder.time),
          }))
        );
      }
    } catch (error) {
      console.error("載入提醒設置失敗:", error);
    }
  };

  // 儲存提醒設置
  const saveReminders = async (newReminders: ReminderItem[]) => {
    try {
      await AsyncStorage.setItem("@reminders", JSON.stringify(newReminders));
    } catch (error) {
      console.error("儲存提醒設置失敗:", error);
    }
  };

  // 處理提醒開關
  const handleToggleReminder = async (id: string) => {
    try {
      const reminder = reminders.find(r => r.id === id);
      if (!reminder) return;

      const newEnabled = !reminder.enabled;

      if (newEnabled) {
        // 啟用提醒時，設置通知
        const time = new Date(reminder.time);
        await scheduleNotification({
          id: reminder.id,
          title: getReminderTypeLabel(reminder.type),
          body: reminder.message,
          trigger: createDailyTrigger(time.getHours(), time.getMinutes()),
        });
      } else {
        // 停用提醒時，取消通知
        await cancelNotification(reminder.id);
      }

      // 更新狀態
      const newReminders = reminders.map(r =>
        r.id === id
          ? {
              ...r,
              enabled: newEnabled,
            }
          : r
      );
      setReminders(newReminders);
      await saveReminders(newReminders);
    } catch (error) {
      console.error("切換提醒狀態失敗:", error);
      Alert.alert("錯誤", "切換提醒狀態失敗");
    }
  };

  // 處理時間選擇
  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate && selectedReminder) {
      try {
        // 更新提醒時間
        const updatedReminder = {
          ...selectedReminder,
          time: selectedDate,
        };

        // 如果提醒是啟用的，重新排程通知
        if (updatedReminder.enabled) {
          await scheduleNotification({
            id: updatedReminder.id,
            title: getReminderTypeLabel(updatedReminder.type),
            body: updatedReminder.message,
            trigger: createDailyTrigger(selectedDate.getHours(), selectedDate.getMinutes()),
          });
        }

        // 更新狀態
        const newReminders = reminders.map(reminder => (reminder.id === selectedReminder.id ? updatedReminder : reminder));
        setReminders(newReminders);
        await saveReminders(newReminders);
      } catch (error) {
        console.error("更新提醒時間失敗:", error);
        Alert.alert("錯誤", "更新提醒時間失敗");
      }
    }
  };

  // 顯示時間選擇器
  const showTimePickerForReminder = (reminder: ReminderItem) => {
    setSelectedReminder(reminder);
    setShowTimePicker(true);
  };

  // 格式化時間顯示
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 獲取提醒類型標籤
  const getReminderTypeLabel = (type: ReminderItem["type"]) => {
    switch (type) {
      case "morning":
        return "晨間測量";
      case "evening":
        return "晚間測量";
      case "medicine":
        return "服藥提醒";
      case "custom":
        return "自定義提醒";
      default:
        return "提醒";
    }
  };

  // 處理新增提醒
  const handleAddReminder = () => {
    setEditingReminder(null);
    setShowEditor(true);
  };

  // 處理編輯提醒
  const handleEditReminder = (reminder: ReminderItem) => {
    setEditingReminder(reminder);
    setShowEditor(true);
  };

  // 處理儲存提醒
  const handleSaveReminder = async (data: {
    time: Date;
    type: "morning" | "evening" | "medicine" | "custom";
    days: number[];
    sound: boolean;
    vibration: boolean;
    message: string;
  }) => {
    try {
      const newReminder: ReminderItem = {
        id: editingReminder?.id || `reminder-${Date.now()}`,
        ...data,
        enabled: true,
      };

      // 更新提醒列表
      const newReminders = editingReminder ? reminders.map(r => (r.id === editingReminder.id ? newReminder : r)) : [...reminders, newReminder];

      // 設置通知
      await scheduleNotification({
        id: newReminder.id,
        title: getReminderTypeLabel(newReminder.type),
        body: newReminder.message,
        trigger: createDailyTrigger(data.time.getHours(), data.time.getMinutes()),
      });

      // 更新狀態
      setReminders(newReminders);
      await saveReminders(newReminders);
      setShowEditor(false);
    } catch (error) {
      console.error("儲存提醒失敗:", error);
      Alert.alert("錯誤", "儲存提醒失敗");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <LinearGradient colors={[Colors.light.primary, Colors.light.secondary]} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Pressable style={styles.backButton} onPress={() => router.back()}>
                <FontAwesome5 name="arrow-left" size={20} color="#fff" />
              </Pressable>
              <Text style={styles.headerTitle}>智能提醒</Text>
            </View>
            <Pressable style={styles.addButton} onPress={handleAddReminder}>
              <FontAwesome5 name="plus" size={20} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500 }}>
          {/* 提醒列表 */}
          {reminders.map(reminder => (
            <Pressable key={reminder.id} style={styles.reminderCard} onPress={() => handleEditReminder(reminder)}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderTypeContainer}>
                  <View style={[styles.reminderTypeIcon, { backgroundColor: `${Colors.light.primary}1A` }]}>
                    <FontAwesome5 name="clock" size={16} color={Colors.light.primary} />
                  </View>
                  <Text style={styles.reminderType}>{getReminderTypeLabel(reminder.type)}</Text>
                </View>
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => handleToggleReminder(reminder.id)}
                  trackColor={{ false: "#e9e9eb", true: `${Colors.light.primary}4D` }}
                  thumbColor={reminder.enabled ? Colors.light.primary : "#fff"}
                />
              </View>

              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(reminder.time)}</Text>
                <FontAwesome5 name="chevron-right" size={16} color={Colors.light.textSecondary} />
              </View>

              <View style={styles.reminderSettings}>
                <View style={styles.settingItem}>
                  <FontAwesome5 name="calendar-alt" size={16} color={Colors.light.textSecondary} />
                  <Text style={styles.settingText}>每天</Text>
                </View>
                <View style={styles.settingItem}>
                  <FontAwesome5 name={reminder.sound ? "volume-up" : "volume-mute"} size={16} color={Colors.light.textSecondary} />
                  <Text style={styles.settingText}>{reminder.sound ? "開啟聲音" : "靜音"}</Text>
                </View>
                <View style={styles.settingItem}>
                  <FontAwesome5 name="vibrating" size={16} color={Colors.light.textSecondary} />
                  <Text style={styles.settingText}>{reminder.vibration ? "開啟震動" : "關閉震動"}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </MotiView>
      </ScrollView>

      {/* 提醒編輯器 */}
      {showEditor && (
        <View style={StyleSheet.absoluteFill}>
          <ReminderEditor initialData={editingReminder || undefined} onSave={handleSaveReminder} onCancel={() => setShowEditor(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerGradient: {
    width: "100%",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.bold,
    color: "#fff",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  reminderCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reminderTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reminderType: {
    fontSize: Typography.size.large,
    fontWeight: Typography.weight.semibold,
    color: Colors.light.text,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 16,
  },
  timeText: {
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
    color: Colors.light.primary,
  },
  reminderSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingText: {
    fontSize: Typography.size.small,
    color: Colors.light.textSecondary,
  },
});
