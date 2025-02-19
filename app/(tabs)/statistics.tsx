import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, Platform, Alert, Dimensions, Share } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useCallback, useRef } from "react";
import * as Calendar from "expo-calendar";
import * as FileSystem from "expo-file-system";
import ViewShot, { captureRef } from "react-native-view-shot";
import { MotiView } from "moti";

type DateRange = "week" | "month" | "year" | "custom";
type ChartType = "line" | "bar" | "pie";
type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
};

export default function StatisticsScreen() {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateRange, setDateRange] = useState<DateRange>("week");
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
  const viewShotRef = useRef(null);

  // 生成模擬數據
  const generateMockData = useCallback(
    (range: DateRange) => {
      let labels: string[] = [];
      let systolicData: number[] = [];
      let diastolicData: number[] = [];
      let recordCounts: number[] = [];

      switch (range) {
        case "week":
          labels = ["一", "二", "三", "四", "五", "六", "日"];
          systolicData = [120, 125, 118, 128, 122, 130, 125];
          diastolicData = [80, 82, 78, 85, 80, 88, 82];
          recordCounts = [3, 2, 4, 3, 2, 3, 2];
          break;
        case "month":
          // 生成本月天數的數據
          const daysInMonth = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth() + 1, 0).getDate();
          labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
          systolicData = Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 20 + 115));
          diastolicData = Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 15 + 75));
          recordCounts = Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 4 + 1));
          break;
        case "year":
          labels = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
          systolicData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 20 + 115));
          diastolicData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 15 + 75));
          recordCounts = Array.from({ length: 12 }, () => Math.floor(Math.random() * 50 + 30));
          break;
        default:
          labels = ["一", "二", "三", "四", "五", "六", "日"];
          systolicData = [120, 125, 118, 128, 122, 130, 125];
          diastolicData = [80, 82, 78, 85, 80, 88, 82];
          recordCounts = [3, 2, 4, 3, 2, 3, 2];
      }

      // 計算統計數據
      const systolicStats = {
        avg: Math.round(systolicData.reduce((a, b) => a + b, 0) / systolicData.length),
        min: Math.min(...systolicData),
        max: Math.max(...systolicData),
        trend: systolicData[systolicData.length - 1] > systolicData[systolicData.length - 2] ? "up" : "down",
        status: "warning",
      };

      const diastolicStats = {
        avg: Math.round(diastolicData.reduce((a, b) => a + b, 0) / diastolicData.length),
        min: Math.min(...diastolicData),
        max: Math.max(...diastolicData),
        trend: diastolicData[diastolicData.length - 1] > diastolicData[diastolicData.length - 2] ? "up" : "down",
        status: "normal",
      };

      const totalRecords = recordCounts.reduce((a, b) => a + b, 0);

      return {
        trendData: {
          labels,
          datasets: [
            {
              data: systolicData,
              color: (opacity = 1) => `rgba(45, 135, 255, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: diastolicData,
              color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        },
        recordsData: {
          labels,
          datasets: [
            {
              data: recordCounts,
              color: (opacity = 1) => `rgba(45, 135, 255, ${opacity})`,
            },
          ],
        },
        stats: {
          systolic: systolicStats,
          diastolic: diastolicStats,
          heartRate: {
            avg: 78,
            min: 65,
            max: 85,
            trend: "stable",
            status: "normal",
          },
          weeklyRecords: totalRecords,
          lastUpdate: new Date().toLocaleDateString(),
        },
      };
    },
    [selectedEndDate]
  );

  // 更新圖表數據
  const [chartData, setChartData] = useState(() => generateMockData("week"));

  // 更新圖表數據
  const updateChartData = useCallback(
    (range: DateRange, startDate: Date, endDate: Date) => {
      const newData = generateMockData(range);
      setChartData(newData);
    },
    [generateMockData]
  );

  // 模擬分布數據
  const distributionData = [
    {
      name: "正常",
      population: 65,
      color: "#34c759",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "偏高",
      population: 25,
      color: "#ffd60a",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "高血壓",
      population: 10,
      color: "#ff3b30",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ];

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "arrow-up";
      case "down":
        return "arrow-down";
      default:
        return "arrows-h";
    }
  };

  // 處理日期選擇
  const handleCalendarPress = useCallback(async () => {
    try {
      // 檢查日曆權限
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("需要權限", "請允許應用訪問日曆以選擇日期範圍");
        return;
      }

      Alert.alert("選擇日期範圍", "請選擇要查看的時間範圍", [
        {
          text: "本週",
          onPress: () => {
            const now = new Date();
            const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
            const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            setSelectedStartDate(firstDay);
            setSelectedEndDate(lastDay);
            setDateRange("week");
            updateChartData("week", firstDay, lastDay);
          },
        },
        {
          text: "本月",
          onPress: () => {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setSelectedStartDate(firstDay);
            setSelectedEndDate(lastDay);
            setDateRange("month");
            updateChartData("month", firstDay, lastDay);
          },
        },
        {
          text: "今年",
          onPress: () => {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), 0, 1);
            const lastDay = new Date(now.getFullYear(), 11, 31);
            setSelectedStartDate(firstDay);
            setSelectedEndDate(lastDay);
            setDateRange("year");
            updateChartData("year", firstDay, lastDay);
          },
        },
        {
          text: "自訂範圍",
          onPress: async () => {
            try {
              // 這裡可以使用 DatePickerModal 或其他日期選擇組件
              // 為了示例，我們使用簡單的 Alert
              Alert.alert("自訂範圍", "此功能需要實現日期選擇器");
            } catch (error) {
              console.error("選擇日期時出錯:", error);
              Alert.alert("錯誤", "選擇日期時發生錯誤");
            }
          },
        },
        {
          text: "取消",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("處理日曆時出錯:", error);
      Alert.alert("錯誤", "無法訪問日曆");
    }
  }, []);

  // 處理分享
  const handleShare = useCallback(async () => {
    try {
      Alert.alert("分享統計數據", "選擇分享方式", [
        {
          text: "生成圖片",
          onPress: async () => {
            if (viewShotRef.current) {
              try {
                // 使用 captureRef 替代 capture
                const uri = await captureRef(viewShotRef, {
                  format: "png",
                  quality: 0.8,
                });

                // 分享圖片
                const result = await Share.share({
                  url: uri,
                  title: "血壓統計數據",
                  message: `分享我的血壓統計數據 (${selectedStartDate.toLocaleDateString()} - ${selectedEndDate.toLocaleDateString()})`,
                });

                if (result.action === Share.sharedAction) {
                  if (result.activityType) {
                    console.log("分享成功，活動類型:", result.activityType);
                  } else {
                    console.log("分享成功");
                  }
                }
              } catch (error) {
                console.error("生成或分享圖片時出錯:", error);
                Alert.alert("錯誤", "無法生成或分享圖片");
              }
            }
          },
        },
        {
          text: "分享連結",
          onPress: async () => {
            try {
              // 生成分享連結（這裡使用示例 URL）
              const shareUrl = `https://yourapp.com/statistics?start=${selectedStartDate.toISOString()}&end=${selectedEndDate.toISOString()}`;

              const result = await Share.share({
                title: "血壓統計數據",
                message: `查看我的血壓統計數據：${shareUrl}`,
                url: shareUrl,
              });

              if (result.action === Share.sharedAction) {
                console.log("分享成功");
              }
            } catch (error) {
              console.error("分享連結時出錯:", error);
              Alert.alert("錯誤", "無法分享連結");
            }
          },
        },
        {
          text: "取消",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("處理分享時出錯:", error);
      Alert.alert("錯誤", "無法執行分享操作");
    }
  }, [selectedStartDate, selectedEndDate]);

  // 處理圖表更多選項
  const handleChartOptions = () => {
    Alert.alert("圖表選項", "選擇要顯示的數據", [
      {
        text: "趨勢折線圖",
        onPress: () => setChartType("line"),
      },
      {
        text: "分布餅圖",
        onPress: () => setChartType("pie"),
      },
      {
        text: "記錄柱狀圖",
        onPress: () => setChartType("bar"),
      },
      {
        text: "取消",
        style: "cancel",
      },
    ]);
  };

  // 處理導出 PDF
  const handleExportPDF = () => {
    Alert.alert("導出 PDF 報告", "選擇報告類型", [
      {
        text: "詳細報告",
        onPress: () => console.log("導出詳細報告"),
      },
      {
        text: "簡要報告",
        onPress: () => console.log("導出簡要報告"),
      },
      {
        text: "取消",
        style: "cancel",
      },
    ]);
  };

  // 處理導出 Excel
  const handleExportExcel = () => {
    Alert.alert("導出 Excel 表格", "選擇導出範圍", [
      {
        text: "全部數據",
        onPress: () => console.log("導出全部數據"),
      },
      {
        text: "選定範圍",
        onPress: () => console.log("導出選定範圍"),
      },
      {
        text: "取消",
        style: "cancel",
      },
    ]);
  };

  // 圖表配置
  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(45, 135, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#2d87ff",
    },
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.header}>
        <Text style={styles.headerTitle}>數據統計</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MotiView style={styles.card} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
          <Text style={styles.cardTitle}>本月概覽</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>120/80</Text>
              <Text style={styles.statLabel}>平均血壓</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>72</Text>
              <Text style={styles.statLabel}>平均心率</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>測量次數</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>93%</Text>
              <Text style={styles.statLabel}>完成率</Text>
            </View>
          </View>
        </MotiView>

        <MotiView
          style={[styles.card, styles.chartCard]}
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500, delay: 200 }}
        >
          <Text style={styles.cardTitle}>趨勢圖</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>圖表區域</Text>
            <Text style={styles.placeholderSubtext}>即將推出</Text>
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
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  statItem: {
    width: "50%",
    padding: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#7F3DFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#8e8e93",
  },
  chartCard: {
    marginBottom: 32,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: "#f5f7fa",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8e8e93",
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
