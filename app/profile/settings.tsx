/**
 * @file settings.tsx
 * @author FirstFu
 * @date 2024-03-21
 * @module Screens/Profile/Settings
 * @description 設置頁面
 * 提供應用程序的設置和配置功能：
 * 1. 數據導出（CSV/PDF）
 * 2. 通知設置
 * 3. 主題設置
 * 4. 隱私設置
 * 5. 其他系統設置
 *
 * @dependencies
 * - expo-router: 路由導航
 * - expo-linear-gradient: 漸變背景
 * - moti: 動畫效果
 * - exportService: 數據導出服務
 */

import { StyleSheet, View, Text, ScrollView, Pressable, Platform, Switch, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useState } from "react";
import { exportToCSV, exportToPDF } from "../../lib/exportService";
import { useBloodPressureStore } from "../../store/bloodPressureStore";

/**
 * 設置選項接口
 * @interface SettingOption
 * @property {string} id - 選項唯一標識
 * @property {string} title - 選項標題
 * @property {string} [description] - 選項描述（可選）
 * @property {string} icon - 選項圖標名稱
 * @property {"switch" | "button" | "link"} type - 選項類型
 * @property {boolean} [value] - 開關類型的值（可選）
 * @property {() => void} [onPress] - 點擊事件處理函數（可選）
 */
interface SettingOption {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: "switch" | "button" | "link";
  value?: boolean;
  onPress?: () => void;
}

/**
 * 設置頁面組件
 * @returns JSX.Element
 * @description
 * 主要功能：
 * 1. 顯示設置選項列表
 * 2. 處理設置項的狀態變更
 * 3. 處理數據導出功能
 * 4. 提供頁面導航
 */
export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notification: true,
    biometric: true,
    autoBackup: false,
  });

  const handleLogout = () => {
    Alert.alert("登出", "確定要登出嗎？", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "確定",
        style: "destructive",
        onPress: () => {
          // 這裡添加登出邏輯
          console.log("User logged out");
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert("清除數據", "確定要清除所有數據嗎？此操作無法撤銷。", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "確定",
        style: "destructive",
        onPress: () => {
          // 這裡添加清除數據邏輯
          console.log("Data cleared");
        },
      },
    ]);
  };

  const settingOptions: SettingOption[] = [
    {
      id: "appearance",
      title: "外觀",
      icon: "moon",
      type: "switch",
      value: settings.darkMode,
      description: "深色模式",
    },
    {
      id: "notification",
      title: "通知",
      icon: "bell",
      type: "switch",
      value: settings.notification,
      description: "接收推送通知",
    },
    {
      id: "security",
      title: "安全",
      icon: "shield-alt",
      type: "switch",
      value: settings.biometric,
      description: "生物識別解鎖",
    },
    {
      id: "backup",
      title: "備份",
      icon: "cloud-upload-alt",
      type: "switch",
      value: settings.autoBackup,
      description: "自動備份數據",
    },
    {
      id: "export",
      title: "數據導出",
      icon: "file-export",
      type: "button",
      description: "導出血壓記錄數據",
      onPress: async () => {
        const records = useBloodPressureStore.getState().records;

        if (records.length === 0) {
          Alert.alert("提示", "目前沒有可導出的記錄");
          return;
        }

        Alert.alert("導出數據", "請選擇導出格式", [
          {
            text: "CSV",
            onPress: async () => {
              try {
                await exportToCSV(records);
                Alert.alert("成功", "數據已成功導出為 CSV 檔案");
              } catch (error) {
                Alert.alert("錯誤", "導出 CSV 失敗");
              }
            },
          },
          {
            text: "PDF",
            onPress: async () => {
              try {
                await exportToPDF(records);
                Alert.alert("成功", "數據已成功導出為 PDF 檔案");
              } catch (error) {
                Alert.alert("錯誤", "導出 PDF 失敗");
              }
            },
          },
          {
            text: "取消",
            style: "cancel",
          },
        ]);
      },
    },
    {
      id: "about",
      title: "關於",
      icon: "info-circle",
      type: "link",
      description: "版本、隱私政策與用戶協議",
    },
    {
      id: "clear",
      title: "清除數據",
      icon: "trash-alt",
      type: "button",
      onPress: handleClearData,
    },
    {
      id: "logout",
      title: "登出",
      icon: "sign-out-alt",
      type: "button",
      onPress: handleLogout,
    },
  ];

  const handleSettingChange = (id: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  return (
    <View style={styles.container}>
      {/* 頂部標題區 */}
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>系統設置</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MotiView style={styles.card} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
          {settingOptions.map((option, index) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [styles.settingItem, pressed && styles.settingItemPressed, index !== settingOptions.length - 1 && styles.settingItemBorder]}
              onPress={option.type === "button" ? option.onPress : undefined}
            >
              <View style={styles.settingIcon}>
                <FontAwesome5 name={option.icon} size={20} color="#7F3DFF" />
              </View>
              <View style={styles.settingContent}>
                <View>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  {option.description && <Text style={styles.settingDescription}>{option.description}</Text>}
                </View>
                {option.type === "switch" && (
                  <Switch
                    trackColor={{
                      false: "#e5e5ea",
                      true: "rgba(127,61,255,0.4)",
                    }}
                    thumbColor={settings[option.id as keyof typeof settings] ? "#7F3DFF" : "#f4f3f4"}
                    onValueChange={value => handleSettingChange(option.id, value)}
                    value={settings[option.id as keyof typeof settings]}
                  />
                )}
                {option.type === "link" && <FontAwesome5 name="chevron-right" size={16} color="#C7C7CC" />}
              </View>
            </Pressable>
          ))}
        </MotiView>

        <Text style={styles.version}>版本 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

/**
 * 頁面樣式定義
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingItemPressed: {
    backgroundColor: "#f9f5ff",
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#8e8e93",
  },
  version: {
    fontSize: 12,
    color: "#8e8e93",
    textAlign: "center",
    marginVertical: 20,
  },
});
