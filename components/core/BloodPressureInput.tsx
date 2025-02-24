import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { BP_RANGES } from "@/types/bloodPressure";
import { MotiView } from "moti";
import { CameraView } from "./CameraView";

interface Props {
  onSave?: (data: { systolic: number; diastolic: number; pulse: number; note: string; category: string }) => void;
  onClose?: () => void;
}

export const BloodPressureInput: React.FC<Props> = ({ onSave, onClose }) => {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("morning");
  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    { id: "morning", label: "早", icon: "sun" },
    { id: "evening", label: "晚", icon: "moon" },
  ];

  const validateInput = () => {
    const newErrors: { [key: string]: string } = {};
    if (!systolic) newErrors.systolic = "必填";
    else if (Number(systolic) < 60 || Number(systolic) > 200) newErrors.systolic = "異常";
    if (!diastolic) newErrors.diastolic = "必填";
    else if (Number(diastolic) < 40 || Number(diastolic) > 130) newErrors.diastolic = "異常";
    if (!pulse) newErrors.pulse = "必填";
    else if (Number(pulse) < 40 || Number(pulse) > 200) newErrors.pulse = "異常";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateInput()) return;
    onSave?.({
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: Number(pulse),
      note,
      category,
    });
  };

  const getStatus = () => {
    if (!systolic || !diastolic) return null;
    const sys = Number(systolic);
    const dia = Number(diastolic);

    if (sys >= BP_RANGES.systolic.crisis.min || dia >= BP_RANGES.diastolic.crisis.min) {
      return { text: "危險", color: "#ff3b30" };
    }
    if (sys >= BP_RANGES.systolic.high.min || dia >= BP_RANGES.diastolic.high.min) {
      return { text: "偏高", color: "#ff9500" };
    }
    if (sys >= BP_RANGES.systolic.elevated.min || dia >= BP_RANGES.diastolic.elevated.min) {
      return { text: "注意", color: "#ffcc00" };
    }
    if (sys <= BP_RANGES.systolic.low.max || dia <= BP_RANGES.diastolic.low.max) {
      return { text: "偏低", color: "#5856d6" };
    }
    return { text: "正常", color: "#34c759" };
  };

  const status = getStatus();

  const handleRecognized = (data: { systolic: number; diastolic: number; pulse?: number }) => {
    setSystolic(data.systolic.toString());
    setDiastolic(data.diastolic.toString());
    if (data.pulse) {
      setPulse(data.pulse.toString());
    }
    setShowCamera(false);
  };

  if (showCamera) {
    return <CameraView onClose={() => setShowCamera(false)} onRecognized={handleRecognized} />;
  }

  return (
    <MotiView style={styles.container} from={{ translateY: 100, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ type: "spring", damping: 15 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>血壓紀錄</Text>
        <Text style={styles.subtitle}>請輸入您的血壓數值</Text>
      </View>

      <View style={styles.header}>
        {categories.map(cat => (
          <Pressable
            key={cat.id}
            onPress={() => setCategory(cat.id)}
            style={({ pressed }) => [styles.categoryButton, category === cat.id && styles.categoryButtonActive, pressed && { opacity: 0.8 }]}
          >
            <FontAwesome5 name={cat.icon} size={16} color={category === cat.id ? "#fff" : "#8e8e93"} />
            <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>{cat.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.inputs}>
        <View style={styles.bpInputs}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>收縮壓</Text>
            <TextInput
              style={[styles.input, errors.systolic && styles.inputError]}
              value={systolic}
              onChangeText={setSystolic}
              placeholder="90-200"
              keyboardType="number-pad"
              maxLength={3}
            />
            <Text style={styles.unitLabel}>mmHg</Text>
          </View>
          <Text style={styles.separator}>/</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>舒張壓</Text>
            <TextInput
              style={[styles.input, errors.diastolic && styles.inputError]}
              value={diastolic}
              onChangeText={setDiastolic}
              placeholder="60-130"
              keyboardType="number-pad"
              maxLength={3}
            />
            <Text style={styles.unitLabel}>mmHg</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>心率</Text>
          <TextInput
            style={[styles.input, styles.pulseInput, errors.pulse && styles.inputError]}
            value={pulse}
            onChangeText={setPulse}
            placeholder="40-200"
            keyboardType="number-pad"
            maxLength={3}
          />
          <Text style={styles.unitLabel}>BPM</Text>
        </View>
      </View>

      <Pressable onPress={() => setShowCamera(true)} style={({ pressed }) => [styles.cameraButton, pressed && { opacity: 0.8 }]}>
        <FontAwesome5 name="camera" size={16} color="#8e8e93" />
        <Text style={styles.cameraButtonText}>拍照輸入</Text>
      </Pressable>

      {status && (
        <View style={[styles.status, { backgroundColor: `${status.color}15` }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
      )}

      <TextInput style={styles.noteInput} value={note} onChangeText={setNote} placeholder="添加備註..." placeholderTextColor="#8e8e93" multiline numberOfLines={2} />

      <View style={styles.buttons}>
        <Pressable onPress={onClose} style={({ pressed }) => [styles.button, styles.cancelButton, pressed && { opacity: 0.8 }]}>
          <Text style={styles.cancelButtonText}>取消</Text>
        </Pressable>
        <Pressable onPress={handleSave} style={({ pressed }) => [styles.button, styles.saveButton, pressed && { opacity: 0.8 }]}>
          <Text style={styles.saveButtonText}>儲存</Text>
        </Pressable>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#8e8e93",
  },
  header: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    borderRadius: 10,
  },
  categoryButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 15,
    color: "#8e8e93",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  inputs: {
    gap: 8,
  },
  inputGroup: {
    flex: 1,
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 4,
  },
  unitLabel: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  bpInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  inputError: {
    borderWidth: 2,
    borderColor: "#ff3b30",
  },
  separator: {
    fontSize: 24,
    color: "#8e8e93",
    fontWeight: "300",
    marginHorizontal: 2,
  },
  pulseInput: {
    flex: 0.5,
  },
  status: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  statusText: {
    fontSize: 17,
    fontWeight: "600",
  },
  noteInput: {
    marginTop: 16,
    height: 80,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    textAlignVertical: "top",
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8e8e93",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginTop: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  cameraButtonText: {
    fontSize: 15,
    color: "#8e8e93",
  },
});
