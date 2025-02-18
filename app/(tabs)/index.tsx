import { StyleSheet, Platform, Pressable, View, Text, SafeAreaView, ScrollView, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { BloodPressureInput } from "../../components/core/BloodPressureInput";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useRouter } from "expo-router";

// 定義血壓數據介面
interface BloodPressureData {
  systolic: number;
  diastolic: number;
  time: string;
}

export default function HomeScreen() {
  const [showQuickRecord, setShowQuickRecord] = useState(false);
  const [weather, setWeather] = useState({ temp: "23°", condition: "sunny" });
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleQuickRecord = () => {
    setShowQuickRecord(true);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === "android" ? 180 : 140, Platform.OS === "android" ? 120 : 100],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false });

  // 處理查看詳情點擊
  const handleViewDetails = () => {
    // 這裡可以導航到詳情頁面
    console.log("Navigate to details page");
  };

  // 處理健康追蹤點擊
  const handleHealthTracking = () => {
    // 這裡可以導航到健康追蹤頁面
    console.log("Navigate to health tracking page");
  };

  // 新增搜尋處理函數
  const handleSearch = () => {
    router.push("/search");
  };

  // 新增通知處理函數
  const handleNotification = () => {
    router.push("/profile/notifications");
  };

  // 模擬本週趨勢數據
  const weeklyData: BloodPressureData[] = [
    { systolic: 120, diastolic: 80, time: "週一" },
    { systolic: 118, diastolic: 79, time: "週二" },
    { systolic: 122, diastolic: 82, time: "週三" },
    { systolic: 119, diastolic: 78, time: "週四" },
    { systolic: 121, diastolic: 81, time: "週五" },
    { systolic: 117, diastolic: 77, time: "週六" },
    { systolic: 120, diastolic: 80, time: "週日" },
  ];

  return (
    <View style={styles.container}>
      {/* 新設計的頂部區域 */}
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.headerGradient}>
            <SafeAreaView>
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={styles.welcomeText}>今日血壓追蹤</Text>
                  <View style={styles.dateWeatherContainer}>
                    <Text style={styles.dateText}>
                      {new Date().toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <View style={styles.weatherInfo}>
                      <FontAwesome5 name="sun" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.weatherText}>{weather.temp}</Text>
                    </View>
                  </View>
                </View>
                <MotiView style={styles.headerButtons}>
                  <Pressable style={styles.iconButton} onPress={handleSearch}>
                    <FontAwesome5 name="search" size={16} color="#fff" />
                  </Pressable>
                  <Pressable style={styles.iconButton} onPress={handleNotification}>
                    <FontAwesome5 name="bell" size={16} color="#fff" />
                  </Pressable>
                </MotiView>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </BlurView>
      </Animated.View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <MotiView from={{ translateY: 50, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ type: "timing", duration: 800 }} style={styles.mainContent}>
          {/* 今日數據概覽卡片 */}
          <View style={styles.overviewCard}>
            <LinearGradient colors={["#ffffff", "#F9F5FF"]} style={styles.cardGradient}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={[styles.cardTitleIcon, { backgroundColor: "rgba(127,61,255,0.1)" }]}>
                    <FontAwesome5 name="heartbeat" size={14} color="#7F3DFF" />
                  </View>
                  <Text style={[styles.cardTitle, { color: "#7F3DFF" }]}>今日數據</Text>
                </View>
                <View style={styles.timeInfo}>
                  <FontAwesome5 name="clock" size={12} color="#8e8e93" />
                  <Text style={styles.timeText}>最後更新: 10:30</Text>
                </View>
              </View>

              <View style={styles.bloodPressureDisplay}>
                <View style={styles.bpReadingContainer}>
                  <View style={styles.bpReading}>
                    <Text style={styles.bpValue}>120</Text>
                    <Text style={styles.bpUnit}>mmHg</Text>
                  </View>
                  <Text style={styles.bpLabel}>收縮壓</Text>
                </View>
                <View style={styles.bpDivider} />
                <View style={styles.bpReadingContainer}>
                  <View style={styles.bpReading}>
                    <Text style={styles.bpValue}>80</Text>
                    <Text style={styles.bpUnit}>mmHg</Text>
                  </View>
                  <Text style={styles.bpLabel}>舒張壓</Text>
                </View>
                <View style={styles.bpReadingContainer}>
                  <View style={styles.bpReading}>
                    <Text style={styles.bpValue}>75</Text>
                    <Text style={styles.bpUnit}>bpm</Text>
                  </View>
                  <Text style={styles.bpLabel}>心率</Text>
                </View>
              </View>

              <View style={styles.statusContainer}>
                <View style={styles.statusBadge}>
                  <FontAwesome5 name="check-circle" size={14} color="#34c759" solid />
                  <Text style={styles.statusText}>血壓正常</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* 血壓趨勢卡片 */}
          <View style={styles.trendCard}>
            <LinearGradient colors={["#ffffff", "#F9F5FF"]} style={styles.cardGradient}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={[styles.cardTitleIcon, { backgroundColor: "rgba(127,61,255,0.1)" }]}>
                    <FontAwesome5 name="chart-line" size={14} color="#7F3DFF" />
                  </View>
                  <Text style={[styles.cardTitle, { color: "#7F3DFF" }]}>本週趨勢</Text>
                </View>
                <Pressable style={({ pressed }) => [styles.moreButton, { backgroundColor: pressed ? "rgba(127,61,255,0.2)" : "rgba(127,61,255,0.1)" }]} onPress={handleViewDetails}>
                  <Text style={[styles.moreButtonText, { color: "#7F3DFF" }]}>查看詳情</Text>
                  <FontAwesome5 name="chevron-right" size={12} color="#7F3DFF" />
                </Pressable>
              </View>

              <View style={styles.trendContainer}>
                <View style={styles.trendChart}>
                  {weeklyData.map((data, index) => (
                    <View key={index} style={styles.trendColumn}>
                      <View style={styles.trendLines}>
                        {/* 收縮壓線 */}
                        <View
                          style={[
                            styles.trendLine,
                            {
                              top: `${100 - ((data.systolic - 70) / 100) * 100}%`,
                              backgroundColor: "#7F3DFF",
                            },
                          ]}
                        />
                        {/* 舒張壓線 */}
                        <View
                          style={[
                            styles.trendLine,
                            {
                              top: `${100 - ((data.diastolic - 40) / 100) * 100}%`,
                              backgroundColor: "#5D5FEF",
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.trendTime}>{data.time}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.trendLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#7F3DFF" }]} />
                    <Text style={styles.legendText}>收縮壓</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#5D5FEF" }]} />
                    <Text style={styles.legendText}>舒張壓</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* 快速記錄提示卡片 */}
          <Pressable onPress={handleQuickRecord}>
            <MotiView style={styles.quickRecordCard} from={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 600 }}>
              <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} start={[0, 0]} end={[1, 1]} style={styles.quickRecordGradient}>
                <View style={styles.quickRecordHeader}>
                  <View style={styles.quickRecordTitle}>
                    <FontAwesome5 name="plus-circle" size={20} color="#fff" />
                    <Text style={styles.quickRecordTitleText}>立即記錄血壓</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={16} color="rgba(255,255,255,0.8)" />
                </View>
                <View style={styles.quickRecordHint}>
                  <Pressable style={styles.quickRecordHintItem} onPress={handleQuickRecord}>
                    <FontAwesome5 name="clock" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.quickRecordHintText}>快速記錄只需30秒</Text>
                  </Pressable>
                  <Pressable style={styles.quickRecordHintItem} onPress={handleHealthTracking}>
                    <FontAwesome5 name="chart-line" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.quickRecordHintText}>追蹤健康變化</Text>
                  </Pressable>
                </View>
              </LinearGradient>
            </MotiView>
          </Pressable>
        </MotiView>
      </ScrollView>

      {/* 快速記錄模態框 */}
      {showQuickRecord && (
        <MotiView from={{ translateY: 1000 }} animate={{ translateY: 0 }} transition={{ type: "spring", damping: 20 }} style={styles.modalContainer}>
          <BlurView intensity={90} style={styles.modalBlur}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>記錄血壓</Text>
                <Pressable onPress={() => setShowQuickRecord(false)} style={styles.closeButton}>
                  <FontAwesome5 name="times" size={20} color="#8e8e93" />
                </Pressable>
              </View>
              <BloodPressureInput />
            </View>
          </BlurView>
        </MotiView>
      )}
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
    zIndex: 10,
  },
  headerBlur: {
    width: "100%",
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
  dateWeatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weatherText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  dateText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  overviewCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(45,135,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(142,142,147,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    color: "#8e8e93",
    marginLeft: 4,
  },
  bloodPressureDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 12,
  },
  bpReadingContainer: {
    flex: 1,
    alignItems: "center",
  },
  bpReading: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bpValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  bpUnit: {
    fontSize: 14,
    color: "#8e8e93",
    marginLeft: 4,
  },
  bpLabel: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 4,
  },
  bpDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5ea",
  },
  statusContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52,199,89,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    color: "#34c759",
    marginLeft: 6,
    fontWeight: "600",
  },
  trendCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  trendContainer: {
    marginTop: 16,
    height: 220,
    width: "100%",
  },
  trendChart: {
    height: 160,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  trendColumn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
  },
  trendLines: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  trendLine: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    left: "50%",
  },
  trendTime: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 4,
  },
  trendLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(45,135,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moreButtonText: {
    fontSize: 12,
    color: "#2d87ff",
    marginRight: 4,
  },
  quickRecordCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  quickRecordGradient: {
    padding: 20,
  },
  quickRecordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  quickRecordTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickRecordTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  quickRecordHint: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickRecordHintItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  quickRecordHintText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginLeft: 6,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBlur: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(142,142,147,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
