import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { TimePeriod } from "../../types/bloodPressure";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: "day", label: "日" },
  { value: "week", label: "週" },
  { value: "month", label: "月" },
  { value: "year", label: "年" },
];

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <MotiView style={styles.container} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 300 }}>
      <LinearGradient colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]} style={styles.background}>
        <View style={styles.periodContainer}>
          {periods.map(({ value, label }) => (
            <Pressable key={value} style={[styles.periodButton, selectedPeriod === value && styles.selectedPeriodButton]} onPress={() => onPeriodChange(value)}>
              <Text style={[styles.periodText, selectedPeriod === value && styles.selectedPeriodText]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>
    </MotiView>
  );
};

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
  selectedPeriodButton: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  periodText: {
    fontSize: 14,
    color: "#8e8e93",
    fontWeight: "500",
  },
  selectedPeriodText: {
    color: "#1c1c1e",
  },
});
