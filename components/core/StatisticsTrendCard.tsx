/**
 * 統計頁面趨勢圖表組件
 * @file: StatisticsTrendCard.tsx
 * @author: FirstFu
 * @date: 2024-03-24
 * @description: 專門為統計頁面設計的血壓趨勢圖表組件
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, Platform, Dimensions, useWindowDimensions } from "react-native";
import { TimePeriodSelector } from "../ui/TimePeriodSelector";
import { BloodPressureTrendChart } from "./BloodPressureTrendChart";
import { TimePeriod, TrendDataPoint, BloodPressureStats } from "../../types/bloodPressure";
import { MotiView } from "moti";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";
import { FontAwesome5 } from "@expo/vector-icons";

interface Props {
  data: TrendDataPoint[];
  stats: BloodPressureStats;
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onPointPress?: (point: TrendDataPoint) => void;
}

const CHART_PADDING = 20;

export function StatisticsTrendCard({ data, stats, period, onPeriodChange, onPointPress }: Props) {
  const { width: windowWidth } = useWindowDimensions();

  // 計算圖表實際寬度
  const chartWidth = useMemo(() => {
    const containerPadding = CHART_PADDING * 2; // 容器的左右padding
    const chartPadding = CHART_PADDING * 2; // 圖表的左右padding
    return windowWidth - (containerPadding + chartPadding + 32); // 32 是額外的安全邊距
  }, [windowWidth]);

  return (
    <MotiView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="chart-line" size={16} color={Colors.light.primary} />
          </View>
          <View>
            <Text style={styles.title}>血壓趨勢</Text>
            <Text style={styles.subtitle}>
              {period === "day" ? "今日" : period === "week" ? "本週" : period === "month" ? "本月" : "本年度"}
              血壓變化
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>平均收縮壓</Text>
          <Text style={[styles.statsValue, { color: Colors.light.primary }]}>
            {stats?.average?.systolic || "--"}
            <Text style={styles.statsUnit}> mmHg</Text>
          </Text>
        </View>
        <View style={[styles.statsItem, styles.statsItemBorder]}>
          <Text style={styles.statsLabel}>平均舒張壓</Text>
          <Text style={[styles.statsValue, { color: Colors.light.secondary }]}>
            {stats?.average?.diastolic || "--"}
            <Text style={styles.statsUnit}> mmHg</Text>
          </Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>平均心率</Text>
          <Text style={[styles.statsValue, { color: Colors.light.success }]}>
            {stats?.average?.heartRate || "--"}
            <Text style={styles.statsUnit}> BPM</Text>
          </Text>
        </View>
      </View>

      <View style={styles.periodContainer}>
        <TimePeriodSelector selectedPeriod={period} onPeriodChange={onPeriodChange} />
      </View>

      <View style={styles.chartContainer}>
        <BloodPressureTrendChart data={data} period={period} onPointPress={onPointPress} chartWidth={chartWidth} />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: CHART_PADDING,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.light.primary}1A`,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Typography.size.large,
    fontWeight: Typography.weight.semibold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.size.small,
    color: Colors.light.textSecondary,
  },
  statsGrid: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statsItem: {
    flex: 1,
    alignItems: "center",
  },
  statsItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.light.border,
    marginHorizontal: 16,
    paddingHorizontal: 16,
  },
  statsLabel: {
    fontSize: Typography.size.small,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  statsValue: {
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
  },
  statsUnit: {
    fontSize: Typography.size.small,
    color: Colors.light.textSecondary,
  },
  periodContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
  },
});
