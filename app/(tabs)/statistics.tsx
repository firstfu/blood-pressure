/**
 * @file statistics.tsx
 * @author FirstFu
 * @date 2024-03-21
 * @module Screens/Statistics
 * @description 血壓統計分析頁面
 * 提供血壓數據的可視化分析功能：
 * 1. 血壓趨勢圖表
 * 2. 統計概覽
 * 3. 時間週期選擇
 * 4. 血壓分布統計
 *
 * @dependencies
 * - expo-vector-icons: 圖標
 * - expo-linear-gradient: 漸變背景
 * - moti: 動畫效果
 * - react-native-view-shot: 截圖功能
 * - statisticsService: 統計分析服務
 */

import { StyleSheet, View, Text, SafeAreaView, ScrollView, Platform, Alert, Share, Pressable } from "react-native";
import { useState, useCallback, useRef, useEffect } from "react";
import { MotiView } from "moti";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useBloodPressureStore } from "../../store/bloodPressureStore";
import { analyzeBloodPressure, generateTrendData, calculateBPDistribution } from "../../lib/statisticsService";
import { TimePeriod, BloodPressureStats, TrendDataPoint } from "../../types/bloodPressure";
import { BloodPressureTrendChart } from "../../components/core/BloodPressureTrendChart";
import { TimePeriodSelector } from "../../components/ui/TimePeriodSelector";
import { BloodPressureStats as StatsComponent } from "../../components/core/BloodPressureStats";
import ViewShot from "react-native-view-shot";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

/**
 * 模擬血壓記錄數據
 * @description
 * 生成30天的模擬數據，包含：
 * - 收縮壓：100-140 mmHg
 * - 舒張壓：60-90 mmHg
 * - 心率：60-100 次/分
 * - 記錄時間：最近30天
 * - 記錄類別：morning/noon/evening/night
 */
const mockRecords = Array.from({ length: 30 }, (_, index) => ({
  id: `record-${index}`,
  systolic: Math.floor(Math.random() * 40 + 100), // 100-140
  diastolic: Math.floor(Math.random() * 30 + 60), // 60-90
  heartRate: Math.floor(Math.random() * 40 + 60), // 60-100
  timestamp: Date.now() - (29 - index) * 24 * 60 * 60 * 1000, // 最近30天
  note: "",
  category: ["morning", "noon", "evening", "night"][Math.floor(Math.random() * 4)] as "morning" | "noon" | "evening" | "night",
}));

/**
 * 統計分析頁面組件
 * @returns JSX.Element
 * @description
 * 主要功能：
 * 1. 顯示血壓統計概覽
 * 2. 提供時間週期選擇
 * 3. 展示血壓趨勢圖表
 * 4. 展示血壓分布統計
 * 5. 支持分享統計報告
 */
export default function StatisticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
  const [stats, setStats] = useState<BloodPressureStats | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [distribution, setDistribution] = useState<Array<{ category: string; percentage: number; count: number }>>([]);
  const viewShotRef = useRef<ViewShot>(null);

  // 使用模擬數據
  const records = mockRecords;

  // 更新統計數據
  const updateStatistics = useCallback(() => {
    if (records.length === 0) {
      Alert.alert("提示", "目前沒有血壓記錄");
      return;
    }

    try {
      // 計算基本統計數據
      const newStats = analyzeBloodPressure(records);
      setStats(newStats);

      // 生成趨勢數據
      const newTrendData = generateTrendData(records, selectedPeriod);
      setTrendData(newTrendData);

      // 計算分佈數據
      const newDistribution = calculateBPDistribution(records);
      setDistribution(newDistribution);
    } catch (error) {
      console.error("統計數據計算錯誤:", error);
      Alert.alert("錯誤", "統計數據計算失敗");
    }
  }, [records, selectedPeriod]);

  // 當記錄或時間週期改變時更新統計
  useEffect(() => {
    updateStatistics();
  }, [updateStatistics]);

  // 處理時間週期變更
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  // 處理分享
  const handleShare = async () => {
    try {
      if (!viewShotRef.current) return;

      const uri = (await viewShotRef.current.capture?.()) || "";
      if (!uri) {
        Alert.alert("錯誤", "無法生成截圖");
        return;
      }

      await Share.share({
        url: uri,
        title: "血壓統計數據",
        message: "我的血壓統計數據",
      });
    } catch (error) {
      console.error("分享失敗:", error);
      Alert.alert("錯誤", "分享失敗");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <LinearGradient colors={[Colors.light.primary, Colors.light.secondary]} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>統計分析</Text>
              <Text style={styles.headerSubtitle}>
                {new Date().toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <Pressable style={({ pressed }) => [styles.shareButton, pressed && styles.shareButtonPressed]} onPress={handleShare}>
              <FontAwesome5 name="share-alt" size={20} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ViewShot ref={viewShotRef} style={styles.mainContent}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {/* 統計概覽 */}
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500 }}>
            {stats && <StatsComponent stats={stats} />}
          </MotiView>

          {/* 時間週期選擇器 */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 100 }}
            style={styles.periodSelectorContainer}
          >
            <TimePeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
          </MotiView>

          {/* 趨勢圖表 */}
          {trendData.length > 0 && (
            <MotiView
              style={styles.chartCard}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 200 }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={styles.cardIcon}>
                    <FontAwesome5 name="chart-line" size={16} color={Colors.light.primary} />
                  </View>
                  <Text style={styles.cardTitle}>血壓趨勢</Text>
                </View>
              </View>
              <BloodPressureTrendChart data={trendData} period={selectedPeriod} />
            </MotiView>
          )}

          {/* 分布統計 */}
          {distribution.length > 0 && (
            <MotiView
              style={styles.distributionCard}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 300 }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={[styles.cardIcon, { backgroundColor: `${Colors.light.secondary}1A` }]}>
                    <FontAwesome5 name="chart-pie" size={16} color={Colors.light.secondary} />
                  </View>
                  <Text style={styles.cardTitle}>血壓分布</Text>
                </View>
              </View>
              <View style={styles.distributionList}>
                {distribution.map(item => (
                  <View key={item.category} style={styles.distributionItem}>
                    <View style={styles.distributionLabelContainer}>
                      <Text style={styles.distributionLabel}>{getCategoryLabel(item.category)}</Text>
                      <Text style={styles.distributionValue}>
                        {item.count}次 ({item.percentage}%)
                      </Text>
                    </View>
                    <View style={styles.distributionBarContainer}>
                      <View style={styles.distributionBar}>
                        <View style={[styles.distributionBarFill, { width: `${item.percentage}%`, backgroundColor: getStatusColor(item.category) }]} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </MotiView>
          )}
        </ScrollView>
      </ViewShot>
    </View>
  );
}

/**
 * 獲取血壓狀態的顏色
 * @param category - 血壓狀態類別
 * @returns 對應的顏色代碼
 */
const getStatusColor = (category: string) => {
  switch (category) {
    case "normal":
      return Colors.light.success;
    case "elevated":
      return Colors.light.warning;
    case "high":
      return Colors.light.danger;
    case "crisis":
      return Colors.light.danger;
    case "low":
      return Colors.light.secondary;
    default:
      return Colors.light.textSecondary;
  }
};

/**
 * 獲取血壓狀態的標籤
 * @param category - 血壓狀態類別
 * @returns 對應的中文標籤
 */
const getCategoryLabel = (category: string) => {
  switch (category) {
    case "normal":
      return "正常";
    case "elevated":
      return "偏高";
    case "high":
      return "高血壓";
    case "crisis":
      return "高血壓危象";
    case "low":
      return "偏低";
    default:
      return category;
  }
};

/**
 * 頁面樣式定義
 */
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
  headerTitle: {
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.bold,
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.size.small,
    color: "rgba(255,255,255,0.9)",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonPressed: {
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32,
  },
  periodSelectorContainer: {
    marginVertical: 16,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
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
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.light.primary}1A`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: Typography.size.large,
    fontWeight: Typography.weight.semibold,
    color: Colors.light.text,
  },
  distributionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
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
  distributionList: {
    gap: 16,
  },
  distributionItem: {
    gap: 8,
  },
  distributionLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distributionLabel: {
    fontSize: Typography.size.regular,
    fontWeight: Typography.weight.medium,
    color: Colors.light.text,
  },
  distributionValue: {
    fontSize: Typography.size.small,
    color: Colors.light.textSecondary,
  },
  distributionBarContainer: {
    flex: 1,
  },
  distributionBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  distributionBarFill: {
    height: "100%",
    borderRadius: 4,
  },
});
