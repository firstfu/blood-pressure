/**
 * 血壓趨勢卡片組件
 * @file: BloodPressureTrendCard.tsx
 * @author: FirstFu
 * @date: 2024-03-24
 * @description: 顯示血壓趨勢圖表和相關統計數據的卡片組件
 */

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { TimePeriodSelector } from "../ui/TimePeriodSelector";
import { BloodPressureTrendChart } from "./BloodPressureTrendChart";
import { TimePeriod, TrendDataPoint, BloodPressureStats } from "../../types/bloodPressure";

interface Props {
  data: TrendDataPoint[];
  stats: BloodPressureStats;
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onPointPress?: (point: TrendDataPoint) => void;
}

export function BloodPressureTrendCard({ data, stats, period, onPeriodChange, onPointPress }: Props) {
  return (
    <View style={styles.trendChartCard}>
      <View style={styles.trendChartHeader}>
        <Text style={styles.trendChartTitle}>血壓趨勢</Text>
        <TimePeriodSelector selectedPeriod={period} onPeriodChange={onPeriodChange} />
      </View>
      <BloodPressureTrendChart data={data} period={period} onPointPress={onPointPress} />
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>平均收縮壓</Text>
          <Text style={[styles.statValue, { color: "#7F3DFF" }]}>{stats?.average?.systolic || "--"}</Text>
          <Text style={styles.statUnit}>mmHg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>平均舒張壓</Text>
          <Text style={[styles.statValue, { color: "#5D5FEF" }]}>{stats?.average?.diastolic || "--"}</Text>
          <Text style={styles.statUnit}>mmHg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>平均心率</Text>
          <Text style={[styles.statValue, { color: "#34C759" }]}>{stats?.average?.heartRate || "--"}</Text>
          <Text style={styles.statUnit}>BPM</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trendChartCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  trendChartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  trendChartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(142,142,147,0.1)",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#8e8e93",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
  },
  statUnit: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
