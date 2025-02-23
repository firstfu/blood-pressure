/**
 * @file profile.tsx
 * @author FirstFu
 * @date 2024-03-21
 * @module Screens/Profile
 * @description 個人頁面
 * 提供個人資料管理和系統設置功能
 */

import { StyleSheet, View, Text, ScrollView, Pressable, Platform, Image, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";
import { StatusBar } from "expo-status-bar";

// 定義路由類型
type ProfileRoutes = "/profile/edit" | "/profile/notifications" | "/profile/export" | "/profile/share" | "/profile/settings" | "/profile/help";

// 簡化選單項目，只保留必要功能
const menuItems = [
  {
    id: "personal",
    title: "個人設定",
    items: [
      {
        icon: "user-circle",
        title: "個人資料",
        description: "設置您的基本信息",
        link: "/profile/edit",
      },
      {
        icon: "bell",
        title: "提醒設置",
        description: "自定義測量提醒時間",
        link: "/profile/notifications",
      },
    ],
  },
  {
    id: "data",
    title: "數據管理",
    items: [
      {
        icon: "file-export",
        title: "數據導出",
        description: "匯出您的健康數據",
        link: "/profile/export",
      },
      {
        icon: "share-alt",
        title: "分享報告",
        description: "與醫生分享數據",
        link: "/profile/share",
      },
    ],
  },
  {
    id: "system",
    title: "系統",
    items: [
      {
        icon: "cog",
        title: "系統設置",
        description: "語言、主題等設置",
        link: "/profile/settings",
      },
      {
        icon: "question-circle",
        title: "使用說明",
        description: "查看使用教學",
        link: "/profile/help",
      },
    ],
  },
];

export default function ProfileScreen() {
  const handleMenuPress = (link: string) => {
    // @ts-ignore
    router.push(link);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* 頂部導航區域 */}
      <LinearGradient colors={[Colors.light.primary, Colors.light.secondary]} style={styles.header}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>我的</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* 個人資料卡片 */}
      <MotiView style={styles.profileCard} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500 }}>
        <Pressable style={styles.profileCardContent} onPress={() => handleMenuPress("/profile/edit")}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user" size={32} color={Colors.light.primary} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>王小明</Text>
            <Text style={styles.profileSubtitle}>點擊編輯個人資料</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color={Colors.light.textSecondary} />
        </Pressable>
      </MotiView>

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
                  onPress={() => handleMenuPress(item.link as ProfileRoutes)}
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
    width: "100%",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  safeArea: {
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.bold,
    color: "#fff",
  },
  profileCard: {
    margin: 16,
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
  profileCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.light.primary}1A`,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.size.large,
    fontWeight: Typography.weight.semibold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: Typography.size.small,
    color: Colors.light.textSecondary,
  },
  content: {
    flex: 1,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Typography.size.regular,
    fontWeight: Typography.weight.semibold,
    color: Colors.light.text,
    marginHorizontal: 16,
    marginBottom: 8,
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
    fontSize: Typography.size.regular,
    fontWeight: Typography.weight.medium,
    color: Colors.light.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: Typography.size.small,
    color: Colors.light.textSecondary,
  },
  version: {
    fontSize: Typography.size.caption,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginVertical: 24,
  },
});
