import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, Platform, Alert, Modal, TextInput } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useState } from "react";

interface BloodPressureRecord {
  id: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  date: string;
  time: string;
  note?: string;
}

interface EditModalProps {
  visible: boolean;
  record: BloodPressureRecord | null;
  onClose: () => void;
  onSave: (record: BloodPressureRecord) => void;
}

function EditModal({ visible, record, onClose, onSave }: EditModalProps) {
  const [editedRecord, setEditedRecord] = useState<BloodPressureRecord | null>(record);

  const handleSave = () => {
    if (editedRecord) {
      onSave(editedRecord);
      onClose();
    }
  };

  if (!editedRecord) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>編輯記錄</Text>
            <Pressable onPress={onClose} style={styles.modalCloseButton}>
              <FontAwesome5 name="times" size={20} color="#8e8e93" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>收縮壓 (mmHg)</Text>
              <TextInput
                style={styles.input}
                value={String(editedRecord.systolic)}
                onChangeText={value => setEditedRecord({ ...editedRecord, systolic: parseInt(value) || 0 })}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>舒張壓 (mmHg)</Text>
              <TextInput
                style={styles.input}
                value={String(editedRecord.diastolic)}
                onChangeText={value => setEditedRecord({ ...editedRecord, diastolic: parseInt(value) || 0 })}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>心率 (BPM)</Text>
              <TextInput
                style={styles.input}
                value={String(editedRecord.heartRate)}
                onChangeText={value => setEditedRecord({ ...editedRecord, heartRate: parseInt(value) || 0 })}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>備註</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedRecord.note || ""}
                onChangeText={value => setEditedRecord({ ...editedRecord, note: value })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable style={[styles.modalButton, styles.modalCancelButton]} onPress={onClose}>
              <Text style={styles.modalButtonText}>取消</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.modalSaveButton]} onPress={handleSave}>
              <Text style={[styles.modalButtonText, styles.modalSaveButtonText]}>保存</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function RecordsScreen() {
  const [records, setRecords] = useState<BloodPressureRecord[]>([
    {
      id: "1",
      systolic: 120,
      diastolic: 80,
      heartRate: 75,
      date: "2024-03-20",
      time: "09:30",
      note: "早晨量測",
    },
    {
      id: "2",
      systolic: 118,
      diastolic: 78,
      heartRate: 72,
      date: "2024-03-20",
      time: "21:30",
      note: "睡前量測",
    },
    {
      id: "3",
      systolic: 125,
      diastolic: 82,
      heartRate: 78,
      date: "2024-03-19",
      time: "09:30",
    },
  ]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BloodPressureRecord | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
    // TODO: 實現篩選邏輯
  };

  const handleSearchPress = () => {
    Alert.alert("搜尋", "搜尋功能開發中");
  };

  const handleAdvancedFilterPress = () => {
    Alert.alert("進階篩選", "進階篩選功能開發中");
  };

  const handleAddPress = () => {
    const newRecord: BloodPressureRecord = {
      id: String(Date.now()),
      systolic: 0,
      diastolic: 0,
      heartRate: 0,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
    };
    setSelectedRecord(newRecord);
    setEditModalVisible(true);
  };

  const handleEdit = (record: BloodPressureRecord) => {
    setSelectedRecord(record);
    setEditModalVisible(true);
  };

  const handleSaveEdit = (editedRecord: BloodPressureRecord) => {
    setRecords(prev => prev.map(record => (record.id === editedRecord.id ? editedRecord : record)));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "刪除記錄",
      "確定要刪除這筆記錄嗎？",
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "刪除",
          style: "destructive",
          onPress: () => {
            setRecords(prev => prev.filter(record => record.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getStatusColor = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return "#ff3b30";
    if (systolic >= 130 || diastolic >= 85) return "#ffd60a";
    return "#34c759";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.headerGradient}>
          <SafeAreaView>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>血壓記錄</Text>
                <Text style={styles.headerSubtitle}>共 {records.length} 筆記錄</Text>
              </View>
              <View style={styles.headerButtons}>
                <Pressable style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.8 }]} onPress={handleSearchPress}>
                  <FontAwesome name="search" size={18} color="#fff" />
                </Pressable>
                <Pressable style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.8 }]} onPress={handleAdvancedFilterPress}>
                  <FontAwesome name="filter" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <View style={styles.mainContent}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterContainer}>
              <Pressable style={[styles.filterButton, activeFilter === "all" && styles.filterButtonActive]} onPress={() => handleFilterPress("all")}>
                <Text style={[styles.filterButtonText, activeFilter === "all" && styles.filterButtonTextActive]}>全部記錄</Text>
              </Pressable>
              <Pressable style={[styles.filterButton, activeFilter === "week" && styles.filterButtonActive]} onPress={() => handleFilterPress("week")}>
                <Text style={[styles.filterButtonText, activeFilter === "week" && styles.filterButtonTextActive]}>本週</Text>
              </Pressable>
              <Pressable style={[styles.filterButton, activeFilter === "month" && styles.filterButtonActive]} onPress={() => handleFilterPress("month")}>
                <Text style={[styles.filterButtonText, activeFilter === "month" && styles.filterButtonTextActive]}>本月</Text>
              </Pressable>
              <Pressable style={[styles.filterButton, activeFilter === "abnormal" && styles.filterButtonActive]} onPress={() => handleFilterPress("abnormal")}>
                <Text style={[styles.filterButtonText, activeFilter === "abnormal" && styles.filterButtonTextActive]}>異常記錄</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* 記錄列表 */}
          <View style={styles.recordsList}>
            {records.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome5 name="notes-medical" size={48} color="#8e8e93" />
                <Text style={styles.emptyStateText}>尚無記錄</Text>
                <Text style={styles.emptyStateSubtext}>點擊右下角按鈕新增記錄</Text>
              </View>
            ) : (
              records.map((record, index) => (
                <Pressable key={record.id} style={({ pressed }) => [styles.recordCardContainer, pressed && styles.recordCardPressed]} onPress={() => handleEdit(record)}>
                  <MotiView
                    style={styles.recordCard}
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: "timing", duration: 500, delay: index * 100 }}
                  >
                    <View style={styles.recordHeader}>
                      <View style={styles.recordDateContainer}>
                        <FontAwesome5 name="calendar-alt" size={14} color="#8e8e93" />
                        <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                        <Text style={styles.recordTime}>{record.time}</Text>
                      </View>
                      <View style={styles.actionButtons}>
                        <Pressable style={styles.actionButton} onPress={() => handleEdit(record)}>
                          <FontAwesome5 name="edit" size={14} color="#7F3DFF" />
                        </Pressable>
                        <Pressable style={styles.actionButton} onPress={() => handleDelete(record.id)}>
                          <FontAwesome5 name="trash-alt" size={14} color="#ff3b30" />
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.recordContent}>
                      <View style={styles.recordItem}>
                        <Text style={styles.recordLabel}>收縮壓</Text>
                        <Text style={[styles.recordValue, { color: getStatusColor(record.systolic, record.diastolic) }]}>{record.systolic}</Text>
                        <Text style={styles.recordUnit}>mmHg</Text>
                      </View>
                      <View style={styles.recordDivider} />
                      <View style={styles.recordItem}>
                        <Text style={styles.recordLabel}>舒張壓</Text>
                        <Text style={[styles.recordValue, { color: getStatusColor(record.systolic, record.diastolic) }]}>{record.diastolic}</Text>
                        <Text style={styles.recordUnit}>mmHg</Text>
                      </View>
                      <View style={styles.recordDivider} />
                      <View style={styles.recordItem}>
                        <Text style={styles.recordLabel}>心率</Text>
                        <Text style={styles.recordValue}>{record.heartRate}</Text>
                        <Text style={styles.recordUnit}>BPM</Text>
                      </View>
                    </View>
                    {record.note && <Text style={styles.noteText}>{record.note}</Text>}
                  </MotiView>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      <EditModal
        visible={editModalVisible}
        record={selectedRecord}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedRecord(null);
        }}
        onSave={handleSaveEdit}
      />

      <Pressable style={styles.fab} onPress={handleAddPress}>
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
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  headerGradient: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: Platform.OS === "android" ? 64 : 56,
    paddingTop: Platform.OS === "android" ? 12 : 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 120 : 100,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(142,142,147,0.1)",
  },
  filterButtonActive: {
    backgroundColor: "#2d87ff",
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8e8e93",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  recordsList: {
    paddingHorizontal: 16,
  },
  recordCardContainer: {
    marginBottom: 16,
  },
  recordCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  recordTime: {
    fontSize: 14,
    color: "#8e8e93",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(142,142,147,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  recordContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(142,142,147,0.1)",
  },
  recordItem: {
    flex: 1,
    alignItems: "center",
  },
  recordDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(142,142,147,0.1)",
  },
  recordLabel: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 6,
  },
  recordValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  recordUnit: {
    fontSize: 12,
    color: "#8e8e93",
  },
  noteText: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(142,142,147,0.1)",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "ios" ? 32 : 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
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
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
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
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButton: {
    backgroundColor: "#f5f7fa",
  },
  modalSaveButton: {
    backgroundColor: "#2d87ff",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  modalSaveButtonText: {
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8e8e93",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 8,
  },
});
