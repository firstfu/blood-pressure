import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";

const tutorialSections = [
  {
    id: "quick-record",
    title: "快速記錄",
    description: "學習如何快速記錄血壓數據",
    icon: "plus-circle",
    content: ["點擊首頁的「立即記錄血壓」", "輸入收縮壓和舒張壓數值", "可選擇添加心率數據", "點擊確認完成記錄"],
  },
  {
    id: "data-analysis",
    title: "數據分析",
    description: "了解如何查看和分析數據",
    icon: "chart-line",
    content: ["在統計頁面查看數據趨勢", "支持週、月、年的數據視圖", "可查看詳細的數據報告", "支持數據導出功能"],
  },
  {
    id: "reminders",
    title: "提醒功能",
    description: "設置測量提醒",
    icon: "bell",
    content: ["在設置中開啟提醒功能", "自定義提醒時間", "可設置多個提醒", "支持重複提醒設置"],
  },
  {
    id: "data-sharing",
    title: "數據分享",
    description: "與醫生或家人分享數據",
    icon: "share-alt",
    content: ["選擇要分享的時間範圍", "生成數據報告", "支持多種分享方式", "可設置分享權限"],
  },
];

export default function TutorialScreen() {
  return (
    <View style={styles.container}>
      {/* 頂部標題區 */}
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>使用教學</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* 教學內容 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MotiView style={styles.introCard} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
          <View style={styles.introIcon}>
            <FontAwesome5 name="book" size={24} color="#7F3DFF" />
          </View>
          <Text style={styles.introTitle}>歡迎使用血壓管理助手</Text>
          <Text style={styles.introText}>讓我們一起了解如何使用這款應用來更好地管理您的血壓健康</Text>
        </MotiView>

        {tutorialSections.map((section, index) => (
          <MotiView
            key={section.id}
            style={styles.sectionCard}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: index * 100 }}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <FontAwesome5 name={section.icon} size={20} color="#7F3DFF" />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
            </View>
            <View style={styles.sectionContent}>
              {section.content.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{itemIndex + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{item}</Text>
                </View>
              ))}
            </View>
          </MotiView>
        ))}
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
  introCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
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
  introIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: "#8e8e93",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionCard: {
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#8e8e93",
  },
  sectionContent: {
    paddingTop: 8,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7F3DFF",
  },
  stepText: {
    fontSize: 14,
    color: "#1c1c1e",
    flex: 1,
  },
});
