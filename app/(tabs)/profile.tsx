/**
 * @file profile.tsx
 * @author FirstFu
 * @date 2024-03-21
 * @module Screens/Profile
 * @description 個人頁面
 * 提供個人資料管理和系統設置功能：
 * 1. 個人資料管理
 * 2. 系統設置
 * 3. 數據管理
 * 4. 使用幫助
 */

import { StyleSheet, View, Text, ScrollView, Pressable, Platform, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";
import { Colors } from "../../constants/Colors";

const menuItems = [
  {
    id: "personal",
    title: "個人資料",
    items: [
      {
        icon: "user-circle",
        title: "基本資料",
        description: "設置您的個人信息",
        link: "/profile/edit",
      },
      {
        icon: "heart",
        title: "健康資料",
        description: "管理您的健康信息",
        link: "/profile/health",
      },
    ],
  },
  {
    id: "data",
    title: "數據管理",
    items: [
      {
        icon: "bell",
        title: "測量提醒",
        description: "自定義測量提醒時間",
        link: "/profile/notifications",
      },
      {
        icon: "chart-bar",
        title: "數據統計",
        description: "查看詳細的健康報告",
        link: "/profile/statistics",
      },
      {
        icon: "share-alt",
        title: "數據分享",
        description: "與醫生或家人分享數據",
        link: "/profile/share",
      },
      {
        icon: "file-export",
        title: "數據導出",
        description: "導出您的健康數據",
        link: "/profile/export",
      },
    ],
  },
  {
    id: "system",
    title: "系統設置",
    items: [
      {
        icon: "palette",
        title: "主題設置",
        description: "自定義應用外觀",
        link: "/profile/theme",
      },
      {
        icon: "language",
        title: "語言設置",
        description: "切換應用語言",
        link: "/profile/language",
      },
      {
        icon: "shield-alt",
        title: "隱私設置",
        description: "管理數據隱私",
        link: "/profile/privacy",
      },
    ],
  },
  {
    id: "help",
    title: "使用幫助",
    items: [
      {
        icon: "book",
        title: "使用教學",
        description: "了解如何使用各項功能",
        link: "/profile/tutorial",
      },
      {
        icon: "question-circle",
        title: "常見問題",
        description: "查看常見問題解答",
        link: "/profile/faq",
      },
      {
        icon: "info-circle",
        title: "關於我們",
        description: "了解更多關於我們",
        link: "/profile/about",
      },
    ],
  },
];

export default function ProfileScreen() {
  const handleMenuPress = (link: string) => {
    router.push(link);
  };

  return (
    <View style={styles.container}>
      {/* 頂部個人信息卡片 */}
      <LinearGradient colors={[Colors.light.primary, Colors.light.secondary]} style={styles.header}>
        <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }} style={styles.profileCard}>
          <Pressable style={styles.avatarContainer} onPress={() => handleMenuPress("/profile/edit")}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user" size={32} color={Colors.light.primary} />
            </View>
            <View style={styles.badgeContainer}>
              <FontAwesome5 name="check-circle" size={16} color={Colors.light.success} solid />
            </View>
          </Pressable>
          <Text style={styles.name}>王小明</Text>
          <Text style={styles.subtitle}>已堅持記錄 30 天</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>記錄完成率</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>90</Text>
              <Text style={styles.statLabel}>連續天數</Text>
            </View>
          </View>
        </MotiView>
      </LinearGradient>

      {/* 選單列表 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {menuItems.map((section, sectionIndex) => (
          <MotiView
            key={section.id}
            style={styles.menuSection}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: sectionIndex * 100 }}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.link}
                  style={({ pressed }) => [styles.menuItem, index !== section.items.length - 1 && styles.menuItemBorder, pressed && styles.menuItemPressed]}
                  onPress={() => handleMenuPress(item.link)}
                >
                  <View style={[styles.menuIcon, { backgroundColor: `${Colors.light.primary}1A` }]}>
                    <FontAwesome5 name={item.icon} size={20} color={Colors.light.primary} />
                  </View>
                  <View style={styles.menuContent}>
                    <View>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuDescription}>{item.description}</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={16} color={Colors.light.textSecondary} />
                  </View>
                </Pressable>
              ))}
            </View>
          </MotiView>
        ))}

        {/* 版本信息 */}
        <Text style={styles.version}>版本 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 80,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileCard: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 12,
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.light.primary}1A`,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.light.border,
  },
  content: {
    flex: 1,
    marginTop: -40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuContainer: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemPressed: {
    backgroundColor: `${Colors.light.primary}0A`,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  version: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginVertical: 24,
  },
});
