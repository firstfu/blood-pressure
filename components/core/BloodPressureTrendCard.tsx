/**
 * 血壓趨勢卡片組件
 * @file: BloodPressureTrendCard.tsx
 * @author: FirstFu
 * @date: 2024-03-24
 * @description: 顯示血壓趨勢圖表和相關統計數據的卡片組件
 */

import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { TimePeriodSelector } from "../ui/TimePeriodSelector";
import { BloodPressureTrendChart } from "./BloodPressureTrendChart";
import { TimePeriod, TrendDataPoint, BloodPressureStats } from "../../types/bloodPressure";
import { MotiView } from "moti";

interface Props {
  data: TrendDataPoint[];
  stats: BloodPressureStats;
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onPointPress?: (point: TrendDataPoint) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_PADDING = 20;

export function BloodPressureTrendCard({ data, stats, period, onPeriodChange, onPointPress }: Props) {
  return (
    <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>血壓趨勢</Text>
          <Text style={styles.subtitle}>
            {period === "day" ? "今日" : period === "week" ? "本週" : period === "month" ? "本月" : "本年度"}
            血壓變化
          </Text>
        </View>
        <TimePeriodSelector selectedPeriod={period} onPeriodChange={onPeriodChange} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>平均收縮壓</Text>
          <Text style={[styles.statValue, { color: "#7F3DFF" }]}>
            {stats?.average?.systolic || "--"}
            <Text style={styles.statUnit}> mmHg</Text>
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>平均舒張壓</Text>
          <Text style={[styles.statValue, { color: "#5D5FEF" }]}>
            {stats?.average?.diastolic || "--"}
            <Text style={styles.statUnit}> mmHg</Text>
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>平均心率</Text>
          <Text style={[styles.statValue, { color: "#34C759" }]}>
            {stats?.average?.heartRate || "--"}
            <Text style={styles.statUnit}> BPM</Text>
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <BloodPressureTrendChart data={data} period={period} onPointPress={onPointPress} chartWidth={SCREEN_WIDTH - CHART_PADDING * 2} />
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
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8e8e93",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F9F5FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#8e8e93",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  statUnit: {
    fontSize: 12,
    color: "#8e8e93",
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
    marginHorizontal: -CHART_PADDING,
  },
});
