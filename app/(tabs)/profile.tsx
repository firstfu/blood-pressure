import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";

const menuItems = [
  {
    icon: "user-circle",
    title: "個人資料",
    description: "設置您的個人信息",
    link: "/profile/edit" as const,
  },
  {
    icon: "bell",
    title: "提醒設置",
    description: "自定義測量提醒時間",
    link: "/profile/notifications" as const,
  },
  {
    icon: "chart-bar",
    title: "數據統計",
    description: "查看詳細的健康報告",
    link: "/profile/statistics" as const,
  },
  {
    icon: "share-alt",
    title: "分享數據",
    description: "與醫生或家人分享數據",
    link: "/profile/share" as const,
  },
  {
    icon: "book",
    title: "使用教學",
    description: "了解如何使用各項功能",
    link: "/profile/tutorial" as const,
  },
  {
    icon: "cog",
    title: "系統設置",
    description: "調整應用程序設置",
    link: "/profile/settings" as const,
  },
];

export default function ProfileScreen() {
  const handleMenuPress = (link: string) => {
    router.push(link);
  };

  return (
    <View style={styles.container}>
      {/* 頂部個人信息卡片 */}
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.header}>
        <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }} style={styles.profileCard}>
          <Pressable style={styles.avatarContainer} onPress={() => handleMenuPress("profile/edit")}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user" size={32} color="#7F3DFF" />
            </View>
            <View style={styles.badgeContainer}>
              <FontAwesome5 name="check-circle" size={16} color="#34C759" solid />
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
        <MotiView
          style={styles.menuContainer}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 200 }}
        >
          {menuItems.map((item, index) => (
            <Pressable key={item.link} style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]} onPress={() => handleMenuPress(item.link)}>
              <View style={styles.menuIcon}>
                <FontAwesome5 name={item.icon} size={20} color="#7F3DFF" />
              </View>
              <View style={styles.menuContent}>
                <View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={16} color="#C7C7CC" />
              </View>
            </Pressable>
          ))}
        </MotiView>

        {/* 版本信息 */}
        <Text style={styles.version}>版本 1.0.0</Text>
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
    backgroundColor: "rgba(127,61,255,0.1)",
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
    color: "#1c1c1e",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8e8e93",
    textAlign: "center",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f7",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7F3DFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8e8e93",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#f2f2f7",
  },
  content: {
    flex: 1,
    marginTop: -40,
  },
  menuContainer: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  menuItemPressed: {
    backgroundColor: "#f9f5ff",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(127,61,255,0.1)",
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
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 13,
    color: "#8e8e93",
  },
  version: {
    fontSize: 12,
    color: "#8e8e93",
    textAlign: "center",
    marginVertical: 20,
  },
});
