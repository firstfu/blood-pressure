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
import ViewShot, { ViewShotProperties } from "react-native-view-shot";
import { StatusBar } from "expo-status-bar";

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
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>統計分析</Text>
            <Pressable onPress={handleShare} style={styles.shareButton}>
              <FontAwesome5 name="share-alt" size={20} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ViewShot ref={viewShotRef} style={styles.mainContent}>
        <ScrollView style={styles.scrollView}>
          {/* 統計概覽 */}
          {stats && <StatsComponent stats={stats} />}

          {/* 時間週期選擇器 */}
          <TimePeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />

          {/* 趨勢圖表 */}
          {trendData.length > 0 && (
            <MotiView style={styles.chartCard} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
              <Text style={styles.cardTitle}>血壓趨勢</Text>
              <BloodPressureTrendChart data={trendData} period={selectedPeriod} />
            </MotiView>
          )}

          {/* 分布統計 */}
          {distribution.length > 0 && (
            <MotiView style={styles.distributionCard} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
              <Text style={styles.cardTitle}>血壓分布</Text>
              <View style={styles.distributionList}>
                {distribution.map(item => (
                  <View key={item.category} style={styles.distributionItem}>
                    <View style={styles.distributionBar}>
                      <View style={[styles.distributionBarFill, { width: `${item.percentage}%` }, { backgroundColor: getStatusColor(item.category) }]} />
                    </View>
                    <View style={styles.distributionInfo}>
                      <Text style={styles.distributionLabel}>{getCategoryLabel(item.category)}</Text>
                      <Text style={styles.distributionValue}>
                        {item.percentage}% ({item.count})
                      </Text>
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
      return "#34c759";
    case "elevated":
      return "#ffd60a";
    case "high":
      return "#ff3b30";
    case "crisis":
      return "#ff453a";
    case "low":
      return "#5856d6";
    default:
      return "#8e8e93";
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
    backgroundColor: "#f5f7fa",
  },
  headerGradient: {
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  chartCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 16,
  },
  distributionCard: {
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
  distributionList: {
    marginTop: 8,
  },
  distributionItem: {
    marginBottom: 12,
  },
  distributionBar: {
    height: 8,
    backgroundColor: "#f2f2f7",
    borderRadius: 4,
    overflow: "hidden",
  },
  distributionBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  distributionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  distributionLabel: {
    fontSize: 14,
    color: "#8e8e93",
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1c1c1e",
  },
});
