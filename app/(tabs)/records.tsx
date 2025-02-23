import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, Platform, Alert, Modal, TextInput } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Typography } from "../../constants/Typography";

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

interface AdvancedFilter {
  dateRange: {
    start: string;
    end: string;
  };
  bloodPressure: {
    systolic: { min: number; max: number };
    diastolic: { min: number; max: number };
  };
  heartRate: { min: number; max: number };
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
    // 本週資料（假設今天是 2024-03-24）
    {
      id: "1",
      systolic: 120,
      diastolic: 80,
      heartRate: 75,
      date: "2024-03-24",
      time: "09:30",
      note: "早晨量測",
    },
    {
      id: "2",
      systolic: 118,
      diastolic: 78,
      heartRate: 72,
      date: "2024-03-24",
      time: "21:30",
      note: "睡前量測",
    },
    {
      id: "3",
      systolic: 122,
      diastolic: 82,
      heartRate: 76,
      date: "2024-03-23",
      time: "09:30",
      note: "運動前量測",
    },
    {
      id: "4",
      systolic: 135,
      diastolic: 88,
      heartRate: 82,
      date: "2024-03-23",
      time: "21:30",
      note: "運動後量測",
    },
    {
      id: "5",
      systolic: 125,
      diastolic: 85,
      heartRate: 74,
      date: "2024-03-22",
      time: "09:30",
      note: "正常量測",
    },
    {
      id: "6",
      systolic: 145,
      diastolic: 95,
      heartRate: 88,
      date: "2024-03-22",
      time: "21:30",
      note: "工作壓力大",
    },
    {
      id: "7",
      systolic: 128,
      diastolic: 84,
      heartRate: 76,
      date: "2024-03-21",
      time: "09:30",
      note: "早晨散步後",
    },
    {
      id: "8",
      systolic: 132,
      diastolic: 86,
      heartRate: 78,
      date: "2024-03-21",
      time: "21:30",
      note: "晚餐後量測",
    },
    {
      id: "9",
      systolic: 115,
      diastolic: 75,
      heartRate: 68,
      date: "2024-03-20",
      time: "09:30",
      note: "休息充足",
    },
    {
      id: "10",
      systolic: 138,
      diastolic: 88,
      heartRate: 82,
      date: "2024-03-20",
      time: "21:30",
      note: "咖啡因攝入過多",
    },
    // 本月較早資料
    {
      id: "11",
      systolic: 142,
      diastolic: 92,
      heartRate: 86,
      date: "2024-03-15",
      time: "09:30",
      note: "感冒症狀",
    },
    {
      id: "12",
      systolic: 136,
      diastolic: 88,
      heartRate: 80,
      date: "2024-03-15",
      time: "21:30",
      note: "服藥後量測",
    },
    {
      id: "13",
      systolic: 130,
      diastolic: 85,
      heartRate: 75,
      date: "2024-03-10",
      time: "09:30",
      note: "正常量測",
    },
    {
      id: "14",
      systolic: 128,
      diastolic: 84,
      heartRate: 74,
      date: "2024-03-10",
      time: "21:30",
      note: "睡前量測",
    },
    {
      id: "15",
      systolic: 144,
      diastolic: 94,
      heartRate: 88,
      date: "2024-03-05",
      time: "09:30",
      note: "壓力大",
    },
    {
      id: "16",
      systolic: 134,
      diastolic: 86,
      heartRate: 78,
      date: "2024-03-05",
      time: "21:30",
      note: "放鬆後量測",
    },
    {
      id: "17",
      systolic: 126,
      diastolic: 82,
      heartRate: 72,
      date: "2024-03-01",
      time: "09:30",
      note: "月初量測",
    },
    {
      id: "18",
      systolic: 124,
      diastolic: 80,
      heartRate: 70,
      date: "2024-03-01",
      time: "21:30",
      note: "正常量測",
    },
    // 上月資料
    {
      id: "19",
      systolic: 146,
      diastolic: 96,
      heartRate: 90,
      date: "2024-02-28",
      time: "09:30",
      note: "上月異常值",
    },
    {
      id: "20",
      systolic: 138,
      diastolic: 88,
      heartRate: 82,
      date: "2024-02-28",
      time: "21:30",
      note: "觀察中",
    },
    {
      id: "21",
      systolic: 132,
      diastolic: 86,
      heartRate: 76,
      date: "2024-02-25",
      time: "09:30",
      note: "正常量測",
    },
    {
      id: "22",
      systolic: 128,
      diastolic: 84,
      heartRate: 74,
      date: "2024-02-25",
      time: "21:30",
      note: "睡前量測",
    },
    {
      id: "23",
      systolic: 148,
      diastolic: 98,
      heartRate: 92,
      date: "2024-02-20",
      time: "09:30",
      note: "異常高壓",
    },
    {
      id: "24",
      systolic: 140,
      diastolic: 90,
      heartRate: 84,
      date: "2024-02-20",
      time: "21:30",
      note: "需要追蹤",
    },
    {
      id: "25",
      systolic: 134,
      diastolic: 86,
      heartRate: 78,
      date: "2024-02-15",
      time: "09:30",
      note: "例行量測",
    },
    {
      id: "26",
      systolic: 130,
      diastolic: 84,
      heartRate: 76,
      date: "2024-02-15",
      time: "21:30",
      note: "正常範圍",
    },
    {
      id: "27",
      systolic: 142,
      diastolic: 92,
      heartRate: 86,
      date: "2024-02-10",
      time: "09:30",
      note: "稍微偏高",
    },
    {
      id: "28",
      systolic: 136,
      diastolic: 88,
      heartRate: 80,
      date: "2024-02-10",
      time: "21:30",
      note: "持續觀察",
    },
    {
      id: "29",
      systolic: 126,
      diastolic: 82,
      heartRate: 72,
      date: "2024-02-05",
      time: "09:30",
      note: "正常量測",
    },
    {
      id: "30",
      systolic: 124,
      diastolic: 80,
      heartRate: 70,
      date: "2024-02-05",
      time: "21:30",
      note: "睡前量測",
    },
  ]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BloodPressureRecord | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [advancedFilterModalVisible, setAdvancedFilterModalVisible] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter>({
    dateRange: {
      start: "2024-01-01",
      end: new Date().toISOString().split("T")[0],
    },
    bloodPressure: {
      systolic: { min: 0, max: 300 },
      diastolic: { min: 0, max: 200 },
    },
    heartRate: { min: 0, max: 200 },
  });

  // 篩選記錄
  const getFilteredRecords = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // 設置今天的時間為午夜

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);

    let filteredRecords = [...records];
    console.log("Initial records:", filteredRecords.length);
    console.log("Date ranges:", {
      now: now.toISOString(),
      oneWeekAgo: oneWeekAgo.toISOString(),
      oneMonthAgo: oneMonthAgo.toISOString(),
    });

    // 進階篩選
    filteredRecords = filteredRecords.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = new Date(advancedFilter.dateRange.start);
      const endDate = new Date(advancedFilter.dateRange.end);

      // 重設時間部分以確保純日期比較
      recordDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const dateInRange = recordDate >= startDate && recordDate <= endDate;

      console.log("Date comparison:", {
        recordDate: recordDate.toISOString(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dateInRange,
      });

      const systolicInRange = record.systolic >= advancedFilter.bloodPressure.systolic.min && record.systolic <= advancedFilter.bloodPressure.systolic.max;
      const diastolicInRange = record.diastolic >= advancedFilter.bloodPressure.diastolic.min && record.diastolic <= advancedFilter.bloodPressure.diastolic.max;
      const heartRateInRange = record.heartRate >= advancedFilter.heartRate.min && record.heartRate <= advancedFilter.heartRate.max;

      return dateInRange && systolicInRange && diastolicInRange && heartRateInRange;
    });

    console.log("After advanced filter:", filteredRecords.length);

    // 搜尋過濾
    if (searchText) {
      filteredRecords = filteredRecords.filter(
        record =>
          record.note?.toLowerCase().includes(searchText.toLowerCase()) ||
          record.date.includes(searchText) ||
          record.time.includes(searchText) ||
          String(record.systolic).includes(searchText) ||
          String(record.diastolic).includes(searchText) ||
          String(record.heartRate).includes(searchText)
      );
      console.log("After search filter:", filteredRecords.length);
    }

    // 時間和狀態過濾
    let result;
    switch (activeFilter) {
      case "week":
        result = filteredRecords.filter(record => {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);
          return recordDate >= oneWeekAgo;
        });
        console.log("Week filter applied:", result.length);
        return result;
      case "month":
        result = filteredRecords.filter(record => {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);
          return recordDate >= oneMonthAgo;
        });
        console.log("Month filter applied:", result.length);
        return result;
      case "abnormal":
        result = filteredRecords.filter(record => record.systolic >= 140 || record.diastolic >= 90);
        console.log("Abnormal filter applied:", result.length);
        return result;
      default:
        console.log("No time filter applied, returning:", filteredRecords.length);
        return filteredRecords;
    }
  };

  const handleFilterPress = () => {
    // TODO: 實現篩選功能
    console.log("Filter pressed");
  };

  const handleSearchPress = () => {
    setSearchModalVisible(true);
  };

  // 搜尋 Modal
  const SearchModal = () => (
    <Modal visible={searchModalVisible} animationType="slide" transparent onRequestClose={() => setSearchModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>搜尋記錄</Text>
            <Pressable style={({ pressed }) => [styles.modalCloseButton, pressed && { opacity: 0.8 }]} onPress={() => setSearchModalVisible(false)}>
              <FontAwesome5 name="times" size={20} color="#8e8e93" />
            </Pressable>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <FontAwesome name="search" size={16} color="#8e8e93" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="搜尋日期、時間、備註..."
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
                clearButtonMode="while-editing"
              />
            </View>
            {searchText ? <Text style={styles.searchResult}>找到 {getFilteredRecords().length} 筆結果</Text> : null}
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleAdvancedFilterPress = () => {
    setAdvancedFilterModalVisible(true);
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

  // 進階篩選 Modal
  const AdvancedFilterModal = () => (
    <Modal visible={advancedFilterModalVisible} animationType="slide" transparent onRequestClose={() => setAdvancedFilterModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: "80%" }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>進階篩選</Text>
            <Pressable style={({ pressed }) => [styles.modalCloseButton, pressed && { opacity: 0.8 }]} onPress={() => setAdvancedFilterModalVisible(false)}>
              <FontAwesome5 name="times" size={20} color="#8e8e93" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* 日期範圍 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>日期範圍</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.inputLabel}>開始日期</Text>
                  <TextInput
                    style={styles.input}
                    value={advancedFilter.dateRange.start}
                    onChangeText={text =>
                      setAdvancedFilter(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: text },
                      }))
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.inputLabel}>結束日期</Text>
                  <TextInput
                    style={styles.input}
                    value={advancedFilter.dateRange.end}
                    onChangeText={text =>
                      setAdvancedFilter(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: text },
                      }))
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>
            </View>

            {/* 血壓範圍 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>血壓範圍</Text>
              <View style={styles.rangeContainer}>
                <View style={styles.rangeInputGroup}>
                  <Text style={styles.inputLabel}>收縮壓 (mmHg)</Text>
                  <View style={styles.rangeInputs}>
                    <TextInput
                      style={[styles.input, styles.rangeInput]}
                      value={String(advancedFilter.bloodPressure.systolic.min)}
                      onChangeText={text =>
                        setAdvancedFilter(prev => ({
                          ...prev,
                          bloodPressure: {
                            ...prev.bloodPressure,
                            systolic: { ...prev.bloodPressure.systolic, min: Number(text) || 0 },
                          },
                        }))
                      }
                      keyboardType="number-pad"
                      placeholder="最小值"
                    />
                    <Text style={styles.rangeSeparator}>-</Text>
                    <TextInput
                      style={[styles.input, styles.rangeInput]}
                      value={String(advancedFilter.bloodPressure.systolic.max)}
                      onChangeText={text =>
                        setAdvancedFilter(prev => ({
                          ...prev,
                          bloodPressure: {
                            ...prev.bloodPressure,
                            systolic: { ...prev.bloodPressure.systolic, max: Number(text) || 0 },
                          },
                        }))
                      }
                      keyboardType="number-pad"
                      placeholder="最大值"
                    />
                  </View>
                </View>

                <View style={styles.rangeInputGroup}>
                  <Text style={styles.inputLabel}>舒張壓 (mmHg)</Text>
                  <View style={styles.rangeInputs}>
                    <TextInput
                      style={[styles.input, styles.rangeInput]}
                      value={String(advancedFilter.bloodPressure.diastolic.min)}
                      onChangeText={text =>
                        setAdvancedFilter(prev => ({
                          ...prev,
                          bloodPressure: {
                            ...prev.bloodPressure,
                            diastolic: { ...prev.bloodPressure.diastolic, min: Number(text) || 0 },
                          },
                        }))
                      }
                      keyboardType="number-pad"
                      placeholder="最小值"
                    />
                    <Text style={styles.rangeSeparator}>-</Text>
                    <TextInput
                      style={[styles.input, styles.rangeInput]}
                      value={String(advancedFilter.bloodPressure.diastolic.max)}
                      onChangeText={text =>
                        setAdvancedFilter(prev => ({
                          ...prev,
                          bloodPressure: {
                            ...prev.bloodPressure,
                            diastolic: { ...prev.bloodPressure.diastolic, max: Number(text) || 0 },
                          },
                        }))
                      }
                      keyboardType="number-pad"
                      placeholder="最大值"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* 心率範圍 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>心率範圍 (BPM)</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={[styles.input, styles.rangeInput]}
                  value={String(advancedFilter.heartRate.min)}
                  onChangeText={text =>
                    setAdvancedFilter(prev => ({
                      ...prev,
                      heartRate: { ...prev.heartRate, min: Number(text) || 0 },
                    }))
                  }
                  keyboardType="number-pad"
                  placeholder="最小值"
                />
                <Text style={styles.rangeSeparator}>-</Text>
                <TextInput
                  style={[styles.input, styles.rangeInput]}
                  value={String(advancedFilter.heartRate.max)}
                  onChangeText={text =>
                    setAdvancedFilter(prev => ({
                      ...prev,
                      heartRate: { ...prev.heartRate, max: Number(text) || 0 },
                    }))
                  }
                  keyboardType="number-pad"
                  placeholder="最大值"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable style={[styles.modalButton, styles.modalCancelButton]} onPress={() => setAdvancedFilterModalVisible(false)}>
              <Text style={styles.modalButtonText}>取消</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.modalSaveButton]}
              onPress={() => {
                setAdvancedFilterModalVisible(false);
                // 重新篩選記錄
                getFilteredRecords();
              }}
            >
              <Text style={[styles.modalButtonText, styles.modalSaveButtonText]}>套用</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.light.primary, Colors.light.primary]} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>血壓記錄</Text>
              <View style={styles.dateWeatherContainer}>
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
            <MotiView style={styles.headerButtons}>
              <Pressable style={styles.iconButton} onPress={handleSearchPress}>
                <FontAwesome5 name="search" size={16} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconButton} onPress={handleFilterPress}>
                <FontAwesome5 name="filter" size={16} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconButton} onPress={handleAddPress}>
                <FontAwesome5 name="plus" size={16} color="#fff" />
              </Pressable>
            </MotiView>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {records.map(record => (
          <MotiView
            key={record.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={[styles.recordCard, { backgroundColor: Colors.light.background }]}
          >
            <View style={styles.recordHeader}>
              <View style={styles.dateTimeContainer}>
                <Text style={[styles.date, { color: Colors.light.text }]}>{formatDate(record.date)}</Text>
                <Text style={[styles.time, { color: Colors.light.textSecondary }]}>{record.time}</Text>
              </View>
              <View style={styles.actionButtons}>
                <Pressable style={styles.actionButton} onPress={() => handleEdit(record)}>
                  <FontAwesome5 name="edit" size={16} color={Colors.light.primary} />
                </Pressable>
                <Pressable style={styles.actionButton} onPress={() => handleDelete(record.id)}>
                  <FontAwesome5 name="trash" size={16} color={Colors.light.danger} />
                </Pressable>
              </View>
            </View>

            <View style={styles.readingsContainer}>
              <View style={styles.readingItem}>
                <Text style={[styles.readingLabel, { color: Colors.light.textSecondary }]}>收縮壓</Text>
                <Text style={[styles.readingValue, { color: Colors.light.systolic }]}>{record.systolic}</Text>
                <Text style={[styles.readingUnit, { color: Colors.light.textSecondary }]}>mmHg</Text>
              </View>

              <View style={styles.readingItem}>
                <Text style={[styles.readingLabel, { color: Colors.light.textSecondary }]}>舒張壓</Text>
                <Text style={[styles.readingValue, { color: Colors.light.diastolic }]}>{record.diastolic}</Text>
                <Text style={[styles.readingUnit, { color: Colors.light.textSecondary }]}>mmHg</Text>
              </View>

              <View style={styles.readingItem}>
                <Text style={[styles.readingLabel, { color: Colors.light.textSecondary }]}>心率</Text>
                <Text style={[styles.readingValue, { color: Colors.light.heartRate }]}>{record.heartRate}</Text>
                <Text style={[styles.readingUnit, { color: Colors.light.textSecondary }]}>BPM</Text>
              </View>
            </View>

            {record.note && <Text style={[styles.note, { color: Colors.light.textSecondary }]}>{record.note}</Text>}
          </MotiView>
        ))}
      </ScrollView>

      <EditModal
        visible={editModalVisible}
        record={selectedRecord}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedRecord(null);
        }}
        onSave={handleSaveEdit}
      />

      <SearchModal />

      <AdvancedFilterModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerGradient: {
    width: "100%",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.bold,
    color: "#fff",
  },
  dateWeatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateText: {
    fontSize: Typography.size.regular,
    color: "rgba(255,255,255,0.9)",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  recordCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    fontSize: Typography.size.large,
    fontWeight: Typography.weight.semibold,
  },
  time: {
    fontSize: Typography.size.regular,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  readingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  readingItem: {
    alignItems: "center",
  },
  readingLabel: {
    fontSize: Typography.size.regular,
    marginBottom: 8,
  },
  readingValue: {
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.bold,
    lineHeight: Typography.size.h2 * Typography.lineHeight.tight,
  },
  readingUnit: {
    fontSize: Typography.size.regular,
    marginTop: 4,
  },
  note: {
    fontSize: Typography.size.regular,
    marginTop: 12,
    lineHeight: Typography.size.regular * Typography.lineHeight.normal,
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
    paddingTop: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
    color: Colors.light.text,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.background,
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
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1c1c1e",
    height: "100%",
  },
  searchResult: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 12,
    textAlign: "center",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 12,
  },
  dateRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateInputGroup: {
    flex: 1,
  },
  rangeContainer: {
    gap: 16,
  },
  rangeInputGroup: {
    gap: 8,
  },
  rangeInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    fontSize: 16,
    color: "#8e8e93",
  },
});
