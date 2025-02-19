import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { TimePeriod } from "../../types/bloodPressure";
import { MotiView } from "moti";

interface Props {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: "day", label: "今日" },
  { value: "week", label: "本週" },
  { value: "month", label: "本月" },
  { value: "year", label: "今年" },
];

export function TimePeriodSelector({ selectedPeriod, onPeriodChange }: Props) {
  return (
    <MotiView style={styles.container} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
      {periods.map(period => (
        <Pressable
          key={period.value}
          style={({ pressed }) => [styles.periodButton, selectedPeriod === period.value && styles.selectedPeriod, pressed && styles.pressedPeriod]}
          onPress={() => onPeriodChange(period.value)}
        >
          <Text style={[styles.periodText, selectedPeriod === period.value && styles.selectedPeriodText]}>{period.label}</Text>
        </Pressable>
      ))}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 8,
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
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
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
    fontWeight: "600",
    color: "#8e8e93",
  },
  selectedPeriodText: {
    color: "#fff",
  },
});
