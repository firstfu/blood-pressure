import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Platform, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useState } from "react";

interface UserProfile {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  medicalHistory: string;
}

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "王小明",
    gender: "男",
    age: "35",
    height: "175",
    weight: "70",
    medicalHistory: "無特殊病史",
  });

  const handleSave = () => {
    // 這裡添加保存邏輯
    Alert.alert("成功", "個人資料已更新", [
      {
        text: "確定",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 頂部標題區 */}
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>編輯個人資料</Text>
          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>保存</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 頭像區域 */}
        <MotiView style={styles.avatarSection} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user" size={40} color="#7F3DFF" />
            </View>
            <View style={styles.avatarEditButton}>
              <FontAwesome5 name="camera" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.avatarHint}>點擊更換頭像</Text>
        </MotiView>

        {/* 表單區域 */}
        <MotiView style={styles.formCard} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500, delay: 200 }}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>姓名</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={text => setProfile({ ...profile, name: text })}
              placeholder="請輸入姓名"
              placeholderTextColor="#8e8e93"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>性別</Text>
            <View style={styles.genderButtons}>
              <Pressable style={[styles.genderButton, profile.gender === "男" && styles.genderButtonActive]} onPress={() => setProfile({ ...profile, gender: "男" })}>
                <Text style={[styles.genderButtonText, profile.gender === "男" && styles.genderButtonTextActive]}>男</Text>
              </Pressable>
              <Pressable style={[styles.genderButton, profile.gender === "女" && styles.genderButtonActive]} onPress={() => setProfile({ ...profile, gender: "女" })}>
                <Text style={[styles.genderButtonText, profile.gender === "女" && styles.genderButtonTextActive]}>女</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>年齡</Text>
            <TextInput
              style={styles.input}
              value={profile.age}
              onChangeText={text => setProfile({ ...profile, age: text })}
              placeholder="請輸入年齡"
              placeholderTextColor="#8e8e93"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>身高 (cm)</Text>
              <TextInput
                style={styles.input}
                value={profile.height}
                onChangeText={text => setProfile({ ...profile, height: text })}
                placeholder="請輸入身高"
                placeholderTextColor="#8e8e93"
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>體重 (kg)</Text>
              <TextInput
                style={styles.input}
                value={profile.weight}
                onChangeText={text => setProfile({ ...profile, weight: text })}
                placeholder="請輸入體重"
                placeholderTextColor="#8e8e93"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>病史記錄</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profile.medicalHistory}
              onChangeText={text => setProfile({ ...profile, medicalHistory: text })}
              placeholder="請輸入相關病史（選填）"
              placeholderTextColor="#8e8e93"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F3DFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7F3DFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 14,
    color: "#8e8e93",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
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
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -8,
  },
  formGroupHalf: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1c1c1e",
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  genderButtonActive: {
    backgroundColor: "rgba(127,61,255,0.1)",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#8e8e93",
  },
  genderButtonTextActive: {
    color: "#7F3DFF",
    fontWeight: "600",
  },
});
