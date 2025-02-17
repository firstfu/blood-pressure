import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

export default function RecordsScreen() {
  // 模擬數據
  const [records] = useState([
    {
      id: "1",
      date: "2024-02-16",
      time: "08:30",
      systolic: 128,
      diastolic: 82,
      heartRate: 75,
      status: "warning",
      note: "早晨量測",
      tags: ["飯前", "運動後"],
    },
    {
      id: "2",
      date: "2024-02-16",
      time: "13:45",
      systolic: 118,
      diastolic: 78,
      heartRate: 72,
      status: "normal",
      note: "午餐後量測",
      tags: ["飯後"],
    },
    {
      id: "3",
      date: "2024-02-15",
      time: "20:15",
      systolic: 122,
      diastolic: 80,
      heartRate: 68,
      status: "normal",
      note: "睡前量測",
      tags: ["飯後", "服藥後"],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#34c759";
      case "warning":
        return "#ffd60a";
      case "danger":
        return "#ff3b30";
      default:
        return "#8e8e93";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {/* 頂部區域 */}
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.headerGradient}>
          <SafeAreaView>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>血壓記錄</Text>
                <Text style={styles.headerSubtitle}>共 {records.length} 筆記錄</Text>
              </View>
              <View style={styles.headerButtons}>
                <Pressable style={styles.iconButton}>
                  <FontAwesome name="search" size={18} color="#fff" />
                </Pressable>
                <Pressable style={styles.iconButton}>
                  <FontAwesome name="filter" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* 主要內容區 */}
        <View style={styles.mainContent}>
          {/* 快速篩選 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterContainer}>
              <Pressable style={[styles.filterButton, styles.filterButtonActive]}>
                <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>全部記錄</Text>
              </Pressable>
              <Pressable style={styles.filterButton}>
                <Text style={styles.filterButtonText}>本週</Text>
              </Pressable>
              <Pressable style={styles.filterButton}>
                <Text style={styles.filterButtonText}>本月</Text>
              </Pressable>
              <Pressable style={styles.filterButton}>
                <Text style={styles.filterButtonText}>異常記錄</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* 記錄列表 */}
          <View style={styles.recordsList}>
            {records.map(record => (
              <Pressable key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordDateContainer}>
                    <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                    <Text style={styles.recordTime}>{record.time}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                    <Text style={styles.statusText}>{record.status === "normal" ? "正常" : "偏高"}</Text>
                  </View>
                </View>
                <View style={styles.recordContent}>
                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>收縮壓</Text>
                    <Text style={styles.recordValue}>{record.systolic}</Text>
                    <Text style={styles.recordUnit}>mmHg</Text>
                  </View>
                  <View style={styles.recordDivider} />
                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>舒張壓</Text>
                    <Text style={styles.recordValue}>{record.diastolic}</Text>
                    <Text style={styles.recordUnit}>mmHg</Text>
                  </View>
                  <View style={styles.recordDivider} />
                  <View style={styles.recordItem}>
                    <Text style={styles.recordLabel}>心率</Text>
                    <Text style={styles.recordValue}>{record.heartRate}</Text>
                    <Text style={styles.recordUnit}>BPM</Text>
                  </View>
                </View>
                {record.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {record.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {record.note && <Text style={styles.noteText}>{record.note}</Text>}
                <View style={styles.recordActions}>
                  <Pressable style={styles.actionButton}>
                    <FontAwesome name="pencil" size={16} color="#8e8e93" />
                    <Text style={styles.actionButtonText}>編輯</Text>
                  </Pressable>
                  <Pressable style={[styles.actionButton, styles.actionButtonDanger]}>
                    <FontAwesome name="trash" size={16} color="#ff3b30" />
                    <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>刪除</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 新增記錄按鈕 */}
      <Pressable style={styles.fab}>
        <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.fabGradient}>
          <FontAwesome name="plus" size={24} color="#fff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#2d87ff",
  },
  headerGradient: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 8 : 0,
    paddingBottom: 12,
    height: Platform.OS === "android" ? 80 : 44,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(142,142,147,0.1)",
  },
  filterButtonActive: {
    backgroundColor: "#2d87ff",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8e8e93",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  recordsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recordDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  recordTime: {
    fontSize: 13,
    color: "#8e8e93",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  recordContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recordItem: {
    flex: 1,
    alignItems: "center",
  },
  recordDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5ea",
  },
  recordLabel: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 4,
  },
  recordValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1c1e",
    marginBottom: 2,
  },
  recordUnit: {
    fontSize: 12,
    color: "#8e8e93",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "rgba(45,135,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#2d87ff",
  },
  noteText: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 12,
  },
  recordActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(142,142,147,0.1)",
  },
  actionButtonDanger: {
    backgroundColor: "rgba(255,59,48,0.1)",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8e8e93",
  },
  actionButtonTextDanger: {
    color: "#ff3b30",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16 + (Platform.OS === "ios" ? 34 : 16),
    width: 56,
    height: 56,
    borderRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
