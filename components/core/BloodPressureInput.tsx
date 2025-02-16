import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";

export const BloodPressureInput = () => {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");

  const getBloodPressureStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { text: "正常", color: "#34c759" };
    if (sys < 130 && dia < 80) return { text: "偏高", color: "#ffd60a" };
    return { text: "高血壓", color: "#ff3b30" };
  };

  const status = systolic && diastolic ? getBloodPressureStatus(Number(systolic), Number(diastolic)) : { text: "--", color: "#8e8e93" };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>收縮壓</Text>
          <TextInput style={styles.input} value={systolic} onChangeText={setSystolic} placeholder="mmHg" keyboardType="number-pad" maxLength={3} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>舒張壓</Text>
          <TextInput style={styles.input} value={diastolic} onChangeText={setDiastolic} placeholder="mmHg" keyboardType="number-pad" maxLength={3} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>脈搏</Text>
          <TextInput style={styles.input} value={pulse} onChangeText={setPulse} placeholder="BPM" keyboardType="number-pad" maxLength={3} />
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        <Text style={styles.statusDescription}>收縮壓 90 - 119 且舒張壓 60 - 79</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
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
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 8,
    padding: 8,
    fontSize: 17,
    textAlign: "center",
  },
  statusContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    color: "#8e8e93",
  },
});
