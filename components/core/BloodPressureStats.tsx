import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { BloodPressureStats as Stats } from "../../types/bloodPressure";
import { MotiView } from "moti";

interface Props {
  stats: Stats;
}

export function BloodPressureStats({ stats }: Props) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return { name: "arrow-up", color: "#ff3b30" };
      case "falling":
        return { name: "arrow-down", color: "#34c759" };
      default:
        return { name: "minus", color: "#8e8e93" };
    }
  };

  const trendIcon = getTrendIcon(stats.trend);

  return (
    <MotiView style={styles.container} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>平均值</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>收縮壓</Text>
            <Text style={styles.value}>{stats.average.systolic}</Text>
            <FontAwesome5 name={trendIcon.name} size={16} color={trendIcon.color} />
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>舒張壓</Text>
            <Text style={styles.value}>{stats.average.diastolic}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>心率</Text>
            <Text style={styles.value}>{stats.average.heartRate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最高記錄</Text>
        <View style={styles.record}>
          <View style={styles.recordItem}>
            <Text style={styles.recordValue}>
              {stats.max.systolic}/{stats.max.diastolic}
            </Text>
            <Text style={styles.recordLabel}>mmHg</Text>
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordDate}>{new Date(stats.max.timestamp).toLocaleDateString()}</Text>
            <Text style={styles.recordTime}>{new Date(stats.max.timestamp).toLocaleTimeString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最低記錄</Text>
        <View style={styles.record}>
          <View style={styles.recordItem}>
            <Text style={styles.recordValue}>
              {stats.min.systolic}/{stats.min.diastolic}
            </Text>
            <Text style={styles.recordLabel}>mmHg</Text>
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordDate}>{new Date(stats.min.timestamp).toLocaleDateString()}</Text>
            <Text style={styles.recordTime}>{new Date(stats.min.timestamp).toLocaleTimeString()}</Text>
          </View>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridItem: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#8e8e93",
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  record: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 16,
    padding: 16,
  },
  recordItem: {
    alignItems: "center",
  },
  recordValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  recordLabel: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  recordInfo: {
    alignItems: "flex-end",
  },
  recordDate: {
    fontSize: 14,
    color: "#1c1c1e",
  },
  recordTime: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
});
