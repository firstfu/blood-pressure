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
import { BloodPressureTrendCard } from "../../components/core/BloodPressureTrendCard";
import { Colors } from "../../constants/Colors";

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

  const handleSaveRecord = (data: { systolic: number; diastolic: number; pulse: number; note: string; category: string }) => {
    const newRecord = {
      id: String(Date.now()),
      systolic: data.systolic,
      diastolic: data.diastolic,
      heartRate: data.pulse,
      timestamp: Date.now(),
      note: data.note,
      category: data.category,
    };

    // TODO: 使用 zustand store 來儲存記錄
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

  // 新增提醒處理函數
  const handleReminder = () => {
    // 這裡可以導航到提醒頁面
    console.log("Navigate to reminder page");
  };

  return (
    <View style={styles.container}>
      {/* 新設計的頂部區域 */}
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <LinearGradient colors={[Colors.light.primary, Colors.light.secondary]} style={styles.headerGradient}>
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
          {/* 最新記錄卡片 */}
          <View style={styles.latestRecordCard}>
            <LinearGradient colors={[Colors.light.background, Colors.light.background]} style={styles.cardGradient}>
              <View style={styles.latestRecordHeader}>
                <View style={[styles.latestRecordIcon, { backgroundColor: `${Colors.light.primary}1A` }]}>
                  <FontAwesome5 name="heart" size={16} color={Colors.light.primary} />
                </View>
                <Text style={[styles.latestRecordTitle, { color: Colors.light.text }]}>最新記錄</Text>
                <Text style={[styles.latestRecordTime, { color: Colors.light.textSecondary }]}>今天 15:32</Text>
              </View>

              <View style={styles.bpReadingsContainer}>
                <View style={styles.bpReadingItem}>
                  <Text style={[styles.bpLabel, { color: Colors.light.textSecondary }]}>收縮壓</Text>
                  <View style={styles.bpValueContainer}>
                    <Text style={[styles.bpValue, { color: Colors.light.primary }]}>120</Text>
                    <Text style={[styles.bpUnit, { color: Colors.light.textSecondary }]}>mmHg</Text>
                  </View>
                </View>

                <View style={styles.bpReadingItem}>
                  <Text style={[styles.bpLabel, { color: Colors.light.textSecondary }]}>舒張壓</Text>
                  <View style={styles.bpValueContainer}>
                    <Text style={[styles.bpValue, { color: Colors.light.secondary }]}>80</Text>
                    <Text style={[styles.bpUnit, { color: Colors.light.textSecondary }]}>mmHg</Text>
                  </View>
                </View>

                <View style={styles.bpReadingItem}>
                  <Text style={[styles.bpLabel, { color: Colors.light.textSecondary }]}>心率</Text>
                  <View style={styles.bpValueContainer}>
                    <Text style={[styles.bpValue, { color: Colors.light.success }]}>75</Text>
                    <Text style={[styles.bpUnit, { color: Colors.light.textSecondary }]}>BPM</Text>
                  </View>
                </View>
              </View>

              <View style={styles.bpStatusContainer}>
                <View style={[styles.bpStatusBar, { backgroundColor: `${Colors.light.success}1A` }]}>
                  <LinearGradient colors={[Colors.light.success, Colors.light.success]} style={[styles.bpStatusIndicator, { width: "30%" }]} start={[0, 0]} end={[1, 0]} />
                </View>
                <Text style={[styles.bpStatusText, { color: Colors.light.success }]}>正常</Text>
                <Text style={[styles.bpRangeText, { color: Colors.light.textSecondary }]}>收縮壓 90-119 且舒張壓 60-79</Text>
              </View>
            </LinearGradient>
          </View>

          {/* 功能按鈕區 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionButtonsScrollContainer}>
            <View style={styles.actionButtonsContainer}>
              <Pressable style={styles.actionButton} onPress={() => router.push("/camera")}>
                <View style={[styles.actionButtonIcon, { backgroundColor: `${Colors.light.success}1A` }]}>
                  <FontAwesome5 name="camera" size={20} color={Colors.light.success} />
                </View>
                <Text style={[styles.actionButtonText, { color: Colors.light.text }]}>拍照識別</Text>
                <Text style={[styles.actionButtonSubtext, { color: Colors.light.textSecondary }]}>快速輸入</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={() => router.push("/statistics")}>
                <View style={[styles.actionButtonIcon, { backgroundColor: `${Colors.light.secondary}1A` }]}>
                  <FontAwesome5 name="chart-line" size={20} color={Colors.light.secondary} />
                </View>
                <Text style={[styles.actionButtonText, { color: Colors.light.text }]}>血壓趨勢</Text>
                <Text style={[styles.actionButtonSubtext, { color: Colors.light.textSecondary }]}>查看分析</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={handleReminder}>
                <View style={[styles.actionButtonIcon, { backgroundColor: `${Colors.light.primary}1A` }]}>
                  <FontAwesome5 name="clock" size={20} color={Colors.light.primary} />
                </View>
                <Text style={[styles.actionButtonText, { color: Colors.light.text }]}>智能提醒</Text>
                <Text style={[styles.actionButtonSubtext, { color: Colors.light.textSecondary }]}>定時提醒</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={handleQuickRecord}>
                <View style={[styles.actionButtonIcon, { backgroundColor: `${Colors.light.warning}1A` }]}>
                  <FontAwesome5 name="plus" size={20} color={Colors.light.warning} />
                </View>
                <Text style={[styles.actionButtonText, { color: Colors.light.text }]}>快速記錄</Text>
                <Text style={[styles.actionButtonSubtext, { color: Colors.light.textSecondary }]}>一鍵輸入</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* 血壓趨勢圖表 */}
          <View style={styles.trendChartCard}>
            <BloodPressureTrendCard data={trendState.data} stats={trendState.stats} period={selectedPeriod} onPeriodChange={handlePeriodChange} onPointPress={handlePointPress} />
          </View>
        </MotiView>
      </ScrollView>

      {/* 快速記錄模態框 */}
      <AnimatePresence>
        {showQuickRecord && (
          <>
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "timing", duration: 200 }} style={styles.modalOverlay} />
            <MotiView
              from={{ translateY: 1000, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              exit={{ translateY: 1000, opacity: 0 }}
              transition={{ type: "timing", duration: MODAL_ANIMATION_DURATION }}
              style={styles.modalContainer}
            >
              <BloodPressureInput onClose={handleCloseQuickRecord} onSave={handleSaveRecord} />
            </MotiView>
          </>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  latestRecordCard: {
    borderRadius: 20,
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
    padding: 24,
  },
  latestRecordHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  latestRecordIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  latestRecordTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
    flex: 1,
  },
  latestRecordTime: {
    fontSize: 14,
    color: "#8e8e93",
  },
  bpReadingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  bpReadingItem: {
    alignItems: "center",
  },
  bpLabel: {
    fontSize: 15,
    color: "#8e8e93",
    marginBottom: 8,
  },
  bpValueContainer: {
    alignItems: "center",
  },
  bpValue: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 4,
  },
  bpUnit: {
    fontSize: 14,
    color: "#8e8e93",
  },
  bpStatusContainer: {
    alignItems: "center",
  },
  bpStatusBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(142,142,147,0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 12,
  },
  bpStatusIndicator: {
    height: "100%",
    borderRadius: 2,
  },
  bpStatusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34C759",
    marginBottom: 4,
  },
  bpRangeText: {
    fontSize: 13,
    color: "#8e8e93",
  },
  actionButtonsScrollContainer: {
    paddingHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
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
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  actionButtonSubtext: {
    fontSize: 13,
    color: "#8e8e93",
  },
  trendChartCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  trendChartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  trendChartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(142,142,147,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  periodText: {
    fontSize: 14,
    color: "#1c1c1e",
    fontWeight: "500",
  },
  chartWrapper: {
    height: 200,
    marginTop: 8,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(5px)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(142,142,147,0.1)",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#8e8e93",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
  },
  statUnit: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
