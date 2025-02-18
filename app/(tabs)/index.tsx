import { StyleSheet, Platform, Pressable, View, Text, SafeAreaView, ScrollView, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { BloodPressureInput } from "../../components/core/BloodPressureInput";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";
import { TimePeriodSelector } from "../../components/ui/TimePeriodSelector";
import { BloodPressureTrendChart } from "../../components/core/BloodPressureTrendChart";
import { generateTrendData } from "../../lib/mockDataGenerator";
import { TimePeriod, TrendDataPoint, BloodPressureStats } from "../../types/bloodPressure";
import { useRouter } from "expo-router";

interface TrendState {
  data: TrendDataPoint[];
  stats: BloodPressureStats;
}

const DEFAULT_PERIOD: TimePeriod = "week";
const TREND_UPDATE_INTERVAL = 1000 * 60 * 60; // 每小時更新一次
const MODAL_ANIMATION_DURATION = 300;
const WEATHER_UPDATE_INTERVAL = 1000 * 60 * 30; // 每30分鐘更新一次

export default function HomeScreen() {
  const [showQuickRecord, setShowQuickRecord] = useState(false);
  const [weather, setWeather] = useState({ temp: "23°", condition: "sunny" });
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(DEFAULT_PERIOD);
  const [trendState, setTrendState] = useState<TrendState>(() => generateTrendData(DEFAULT_PERIOD));
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 定期更新趨勢數據
    const trendTimer = setInterval(() => {
      setTrendState(generateTrendData(selectedPeriod));
    }, TREND_UPDATE_INTERVAL);

    return () => clearInterval(trendTimer);
  }, [selectedPeriod]);

  // 處理時間週期變更
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    const newTrendData = generateTrendData(period);
    setTrendState(newTrendData);
  };

  const handleQuickRecord = () => {
    setShowQuickRecord(true);
  };

  const handleCloseQuickRecord = () => {
    setShowQuickRecord(false);
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

  // 處理數據點點擊
  const handlePointPress = (point: TrendDataPoint) => {
    console.log("Pressed point:", point);
  };

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
    router.push("/records");
  };

  // 新增通知處理函數
  const handleNotification = () => {
    router.push("/profile/notifications");
  };

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
                  <Text style={[styles.cardTitle, { color: "#7F3DFF" }]}>血壓趨勢</Text>
                </View>
                <Pressable style={({ pressed }) => [styles.moreButton, { backgroundColor: pressed ? "rgba(127,61,255,0.2)" : "rgba(127,61,255,0.1)" }]} onPress={handleViewDetails}>
                  <Text style={[styles.moreButtonText, { color: "#7F3DFF" }]}>查看詳情</Text>
                  <FontAwesome5 name="chevron-right" size={12} color="#7F3DFF" />
                </Pressable>
              </View>

              <View style={styles.periodSelectorContainer}>
                <TimePeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
              </View>
              <View style={styles.chartContainer}>
                <BloodPressureTrendChart data={trendState.data} period={selectedPeriod} onPointPress={handlePointPress} />
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
      <AnimatePresence>
        {showQuickRecord && (
          <MotiView
            from={{ translateY: 1000, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 1000, opacity: 0 }}
            transition={{ type: "timing", duration: MODAL_ANIMATION_DURATION }}
            style={styles.modalContainer}
          >
            <BlurView intensity={90} style={styles.modalBlur}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>記錄血壓</Text>
                  <Pressable onPress={handleCloseQuickRecord} style={styles.closeButton}>
                    <FontAwesome5 name="times" size={20} color="#8e8e93" />
                  </Pressable>
                </View>
                <BloodPressureInput />
              </View>
            </BlurView>
          </MotiView>
        )}
      </AnimatePresence>
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
    justifyContent: "space-between",
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
  periodSelectorContainer: {
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
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
