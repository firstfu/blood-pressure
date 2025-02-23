/**
 * @file ReminderEditor.tsx
 * @author FirstFu
 * @date 2024-03-21
 * @description 提醒編輯器組件
 * 用於新增和編輯提醒設置
 */

import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Switch, Pressable, Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

// 提醒類型定義
export interface ReminderEditorProps {
  initialData?: {
    id?: string;
    time?: Date;
    type?: "morning" | "evening" | "medicine" | "custom";
    days?: number[];
    sound?: boolean;
    vibration?: boolean;
    message?: string;
  };
  onSave: (data: { time: Date; type: "morning" | "evening" | "medicine" | "custom"; days: number[]; sound: boolean; vibration: boolean; message: string }) => void;
  onCancel: () => void;
}

export function ReminderEditor({ initialData, onSave, onCancel }: ReminderEditorProps) {
  const [time, setTime] = useState<Date>(initialData?.time || new Date());
  const [type, setType] = useState<"morning" | "evening" | "medicine" | "custom">(initialData?.type || "custom");
  const [days, setDays] = useState<number[]>(initialData?.days || [0, 1, 2, 3, 4, 5, 6]);
  const [sound, setSound] = useState(initialData?.sound ?? true);
  const [vibration, setVibration] = useState(initialData?.vibration ?? true);
  const [message, setMessage] = useState(initialData?.message || "");
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 處理時間選擇
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  // 處理星期選擇
  const handleDayToggle = (day: number) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day].sort());
    }
  };

  // 處理儲存
  const handleSave = () => {
    onSave({
      time,
      type,
      days,
      sound,
      vibration,
      message: message.trim() || getDefaultMessage(type),
    });
  };

  // 獲取預設提醒訊息
  const getDefaultMessage = (type: "morning" | "evening" | "medicine" | "custom") => {
    switch (type) {
      case "morning":
        return "該測量晨間血壓了";
      case "evening":
        return "該測量晚間血壓了";
      case "medicine":
        return "該吃藥了";
      default:
        return "該測量血壓了";
    }
  };

  // 格式化時間顯示
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <BlurView intensity={90} style={styles.container}>
      <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 300 }} style={styles.content}>
        {/* 標題 */}
        <View style={styles.header}>
          <Text style={styles.title}>{initialData ? "編輯提醒" : "新增提醒"}</Text>
          <Pressable onPress={onCancel} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color={Colors.light.textSecondary} />
          </Pressable>
        </View>

        {/* 時間選擇 */}
        <Pressable style={styles.timeContainer} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.label}>提醒時間</Text>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>{formatTime(time)}</Text>
            <FontAwesome5 name="chevron-right" size={16} color={Colors.light.textSecondary} />
          </View>
        </Pressable>

        {/* 提醒類型 */}
        <View style={styles.section}>
          <Text style={styles.label}>提醒類型</Text>
          <View style={styles.typeContainer}>
            {[
              { type: "morning", label: "晨間測量", icon: "sun" },
              { type: "evening", label: "晚間測量", icon: "moon" },
              { type: "medicine", label: "服藥提醒", icon: "pills" },
              { type: "custom", label: "自定義", icon: "clock" },
            ].map(item => (
              <Pressable key={item.type} style={[styles.typeButton, type === item.type && styles.typeButtonActive]} onPress={() => setType(item.type as any)}>
                <FontAwesome5 name={item.icon as any} size={16} color={type === item.type ? Colors.light.primary : Colors.light.textSecondary} />
                <Text style={[styles.typeText, type === item.type && styles.typeTextActive]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 重複週期 */}
        <View style={styles.section}>
          <Text style={styles.label}>重複週期</Text>
          <View style={styles.daysContainer}>
            {["日", "一", "二", "三", "四", "五", "六"].map((day, index) => (
              <Pressable key={index} style={[styles.dayButton, days.includes(index) && styles.dayButtonActive]} onPress={() => handleDayToggle(index)}>
                <Text style={[styles.dayText, days.includes(index) && styles.dayTextActive]}>{day}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 提醒方式 */}
        <View style={styles.section}>
          <Text style={styles.label}>提醒方式</Text>
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <FontAwesome5 name={sound ? "volume-up" : "volume-mute"} size={16} color={Colors.light.textSecondary} />
                <Text style={styles.settingText}>聲音提醒</Text>
              </View>
              <Switch
                value={sound}
                onValueChange={setSound}
                trackColor={{ false: "#e9e9eb", true: `${Colors.light.primary}4D` }}
                thumbColor={sound ? Colors.light.primary : "#fff"}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <FontAwesome5 name="vibrating" size={16} color={Colors.light.textSecondary} />
                <Text style={styles.settingText}>震動提醒</Text>
              </View>
              <Switch
                value={vibration}
                onValueChange={setVibration}
                trackColor={{ false: "#e9e9eb", true: `${Colors.light.primary}4D` }}
                thumbColor={vibration ? Colors.light.primary : "#fff"}
              />
            </View>
          </View>
        </View>

        {/* 提醒訊息 */}
        <View style={styles.section}>
          <Text style={styles.label}>提醒訊息</Text>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="輸入提醒訊息"
            placeholderTextColor={Colors.light.textSecondary}
            multiline
            maxLength={100}
          />
        </View>

        {/* 按鈕 */}
        <View style={styles.buttons}>
          <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>取消</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={[styles.buttonText, styles.saveButtonText]}>儲存</Text>
          </Pressable>
        </View>

        {/* 時間選擇器 */}
        {showTimePicker && <DateTimePicker value={time} mode="time" is24Hour={true} display="spinner" onChange={handleTimeChange} />}
      </MotiView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
    color: Colors.light.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(142,142,147,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  timeContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: Typography.size.regular,
    fontWeight: Typography.weight.medium,
    color: Colors.light.text,
    marginBottom: 8,
  },
  timeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
  },
  timeText: {
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
    color: Colors.light.primary,
  },
  section: {
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
  },
  typeButtonActive: {
    backgroundColor: `${Colors.light.primary}1A`,
  },
  typeText: {
    fontSize: Typography.size.regular,
    color: Colors.light.textSecondary,
  },
  typeTextActive: {
    color: Colors.light.primary,
    fontWeight: Typography.weight.medium,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  dayText: {
    fontSize: Typography.size.regular,
    color: Colors.light.textSecondary,
  },
  dayTextActive: {
    color: "#fff",
    fontWeight: Typography.weight.medium,
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
  },
  settingLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingText: {
    fontSize: Typography.size.regular,
    color: Colors.light.text,
  },
  messageInput: {
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    fontSize: Typography.size.regular,
    color: Colors.light.text,
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.light.background,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  buttonText: {
    fontSize: Typography.size.regular,
    fontWeight: Typography.weight.medium,
  },
  cancelButtonText: {
    color: Colors.light.textSecondary,
  },
  saveButtonText: {
    color: "#fff",
  },
});
