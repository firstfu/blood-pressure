import { StyleSheet, View, Text, ScrollView, Pressable, Platform, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useState } from "react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "reminder",
      title: "量測提醒",
      description: "每日定時提醒量測血壓",
      enabled: true,
    },
    {
      id: "abnormal",
      title: "異常警告",
      description: "血壓數值異常時通知",
      enabled: true,
    },
    {
      id: "report",
      title: "週報告",
      description: "每週血壓分析報告",
      enabled: false,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>通知設置</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MotiView style={styles.card} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
          {notifications.map((item, index) => (
            <View key={item.id} style={[styles.notificationItem, index !== notifications.length - 1 && styles.notificationItemBorder]}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDescription}>{item.description}</Text>
              </View>
              <Switch
                trackColor={{
                  false: "#e5e5ea",
                  true: "rgba(127,61,255,0.4)",
                }}
                thumbColor={item.enabled ? "#7F3DFF" : "#f4f3f4"}
                onValueChange={() => toggleNotification(item.id)}
                value={item.enabled}
              />
            </View>
          ))}
        </MotiView>
      </ScrollView>
    </View>
  );
}

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
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  notificationItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  notificationContent: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
