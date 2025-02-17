import { StyleSheet, Platform, Pressable, View, Text, SafeAreaView, ScrollView, Animated } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BloodPressureInput } from "../../components/core/BloodPressureInput";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [showQuickRecord, setShowQuickRecord] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleQuickRecord = () => {
    setShowQuickRecord(true);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === "android" ? 180 : 140, Platform.OS === "android" ? 120 : 100],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false });

  return (
    <View style={styles.container}>
      {/* 固定頂部區域 */}
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.headerGradient}>
          <SafeAreaView>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.welcomeText}>今日血壓追蹤</Text>
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Text>
              </View>
              <View style={styles.headerButtons}>
                <Pressable style={styles.iconButton}>
                  <FontAwesome name="search" size={18} color="#fff" />
                </Pressable>
                <Pressable style={styles.iconButton}>
                  <FontAwesome name="bell-o" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
        {/* 主要內容區 */}
        <View style={styles.mainContent}>
          {/* 快速記錄卡片 */}
          <Pressable style={[styles.quickRecordCard, showQuickRecord && styles.quickRecordCardActive]} onPress={handleQuickRecord}>
            <View style={[styles.quickRecordGradient, showQuickRecord && styles.quickRecordGradientActive]}>
              <View style={styles.quickRecordIcon}>
                <FontAwesome name="plus-circle" size={24} color={showQuickRecord ? "#fff" : "#2d87ff"} />
              </View>
              <View style={styles.quickRecordTextContainer}>
                <Text style={[styles.quickRecordTitle, showQuickRecord && styles.quickRecordTitleActive]}>快速記錄血壓</Text>
                <Text style={[styles.quickRecordSubtitle, showQuickRecord && styles.quickRecordSubtitleActive]}>點擊開始記錄您的血壓數據</Text>
              </View>
            </View>
          </Pressable>

          {showQuickRecord && (
            <View style={styles.inputContainer}>
              <BloodPressureInput />
            </View>
          )}

          {/* 今日概覽卡片 */}
          <View style={styles.overviewCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <View style={styles.cardTitleIcon}>
                  <FontAwesome name="line-chart" size={16} color="#2d87ff" />
                </View>
                <Text style={styles.cardTitle}>今日概覽</Text>
              </View>
              <Pressable style={styles.moreButton}>
                <FontAwesome name="ellipsis-h" size={20} color="#8e8e93" />
              </Pressable>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>最新血壓</Text>
                <Text style={styles.statValue}>120/80</Text>
                <View style={[styles.statBadge, { backgroundColor: "#34c759" }]}>
                  <FontAwesome name="check" size={10} color="#fff" style={styles.badgeIcon} />
                  <Text style={styles.statBadgeText}>正常</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>今日記錄</Text>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statSubtext}>次</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>平均心率</Text>
                <Text style={styles.statValue}>75</Text>
                <Text style={styles.statSubtext}>BPM</Text>
              </View>
            </View>
          </View>

          {/* 健康提醒卡片 */}
          <View style={styles.healthTipsCard}>
            <View style={styles.tipsGradient}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={[styles.cardTitleIcon, { backgroundColor: "rgba(45,135,255,0.1)" }]}>
                    <FontAwesome name="lightbulb-o" size={16} color="#2d87ff" />
                  </View>
                  <Text style={styles.cardTitle}>健康提醒</Text>
                </View>
              </View>
              <View style={styles.tipsContainer}>
                <View style={styles.tipItem}>
                  <View style={styles.tipIconContainer}>
                    <FontAwesome name="heart" size={20} color="#ff3b30" />
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>保持健康生活習慣</Text>
                    <Text style={styles.tipText}>定期測量血壓，避免熬夜</Text>
                  </View>
                </View>
                <View style={styles.tipItem}>
                  <View style={[styles.tipIconContainer, { backgroundColor: "rgba(52,199,89,0.1)" }]}>
                    <FontAwesome name="leaf" size={20} color="#34c759" />
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>規律運動很重要</Text>
                    <Text style={styles.tipText}>每天保持適度運動</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#2d87ff",
  },
  headerGradient: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 8 : 0,
    paddingBottom: 12,
    height: Platform.OS === "android" ? 80 : 44,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  quickRecordCard: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  quickRecordGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  quickRecordGradientActive: {
    backgroundColor: "#2d87ff",
  },
  quickRecordCardActive: {
    transform: [{ scale: 0.98 }],
  },
  quickRecordIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(45,135,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  quickRecordTextContainer: {
    flex: 1,
  },
  quickRecordTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  quickRecordTitleActive: {
    color: "#fff",
  },
  quickRecordSubtitle: {
    fontSize: 13,
    color: "#8e8e93",
  },
  quickRecordSubtitleActive: {
    color: "rgba(255,255,255,0.8)",
  },
  inputContainer: {
    margin: 16,
    marginTop: 0,
  },
  overviewCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(45,135,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(142,142,147,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5ea",
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeIcon: {
    marginRight: 2,
  },
  statBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  statSubtext: {
    fontSize: 13,
    color: "#8e8e93",
  },
  healthTipsCard: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  tipsGradient: {
    padding: 20,
    backgroundColor: "rgba(45,135,255,0.05)",
  },
  tipsContainer: {
    gap: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,59,48,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 2,
  },
  tipText: {
    fontSize: 13,
    color: "#8e8e93",
    lineHeight: 18,
  },
});
