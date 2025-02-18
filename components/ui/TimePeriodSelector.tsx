import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { TimePeriod } from "../../types/bloodPressure";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export function TimePeriodSelector({ selectedPeriod, onPeriodChange }: TimePeriodSelectorProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: "week", label: "週" },
    { value: "month", label: "月" },
    { value: "quarter", label: "季" },
    { value: "year", label: "年" },
  ];

  return (
    <MotiView style={styles.container} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 300 }}>
      <LinearGradient colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]} style={styles.background}>
        <View style={styles.periodContainer}>
          {periods.map(({ value, label }) => (
            <Pressable
              key={value}
              onPress={() => onPeriodChange(value)}
              style={({ pressed }) => [styles.periodButton, selectedPeriod === value && styles.selectedPeriod, pressed && styles.pressedPeriod]}
            >
              <Text style={[styles.periodText, selectedPeriod === value && styles.selectedPeriodText]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  background: {
    padding: 4,
  },
  periodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedPeriod: {
    backgroundColor: "#7F3DFF",
  },
  pressedPeriod: {
    opacity: 0.8,
  },
  periodText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  selectedPeriodText: {
    color: "#FFFFFF",
  },
});
