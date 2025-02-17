import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, Platform, Alert, Dimensions, Share } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useCallback, useRef } from "react";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import * as Calendar from "expo-calendar";
import * as FileSystem from "expo-file-system";
import ViewShot, { captureRef } from "react-native-view-shot";

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

  // 渲染圖表
  const renderChart = () => {
    const screenWidth = Dimensions.get("window").width - 32;

    switch (chartType) {
      case "line":
        return (
          <LineChart
            data={{
              labels: ["一", "二", "三", "四", "五", "六", "日"],
              datasets: [
                {
                  data: [120, 125, 118, 128, 122, 130, 125],
                  color: (opacity = 1) => `rgba(45, 135, 255, ${opacity})`,
                  strokeWidth: 2,
                },
                {
                  data: [80, 82, 78, 85, 80, 88, 82],
                  color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 12,
            }}
          />
        );
      case "pie":
        return (
          <PieChart
            data={[
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
            ]}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={{
              marginVertical: 8,
              borderRadius: 12,
            }}
          />
        );
      case "bar":
        return (
          <BarChart
            data={{
              labels: ["一", "二", "三", "四", "五", "六", "日"],
              datasets: [
                {
                  data: [3, 2, 4, 3, 2, 3, 2],
                },
              ],
            }}
            width={screenWidth}
            height={180}
            chartConfig={{
              ...chartConfig,
              barPercentage: 0.5,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 12,
            }}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* 頂部區域 */}
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.headerGradient}>
          <SafeAreaView>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>數據統計</Text>
                <Text style={styles.headerSubtitle}>
                  {dateRange === "custom"
                    ? `${selectedStartDate.toLocaleDateString()} - ${selectedEndDate.toLocaleDateString()}`
                    : `本${dateRange === "week" ? "週" : dateRange === "month" ? "月" : "年"}記錄 ${chartData.stats.weeklyRecords} 次`}
                </Text>
              </View>
              <View style={styles.headerButtons}>
                <Pressable style={styles.iconButton} onPress={handleCalendarPress}>
                  <FontAwesome name="calendar" size={18} color="#fff" />
                </Pressable>
                <Pressable style={styles.iconButton} onPress={handleShare}>
                  <FontAwesome name="share" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.8 }}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {/* 主要內容區 */}
          <View style={styles.mainContent}>
            {/* 趨勢分析卡片 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={styles.cardTitleIcon}>
                    <FontAwesome name="line-chart" size={16} color="#2d87ff" />
                  </View>
                  <Text style={styles.cardTitle}>趨勢分析</Text>
                </View>
                <Pressable style={styles.moreButton} onPress={handleChartOptions}>
                  <FontAwesome name="ellipsis-h" size={20} color="#8e8e93" />
                </Pressable>
              </View>
              <View style={styles.chartWrapper}>
                {renderChart()}
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#2d87ff" }]} />
                    <Text style={styles.legendText}>收縮壓</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#34c759" }]} />
                    <Text style={styles.legendText}>舒張壓</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 數據報告卡片 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={styles.cardTitleIcon}>
                    <FontAwesome name="file-text-o" size={16} color="#2d87ff" />
                  </View>
                  <Text style={styles.cardTitle}>數據報告</Text>
                </View>
              </View>
              <View style={styles.reportContainer}>
                <View style={styles.reportItem}>
                  <Text style={styles.reportLabel}>平均收縮壓</Text>
                  <View style={styles.reportDataContainer}>
                    <Text style={[styles.reportValue, { color: getStatusColor(chartData.stats.systolic.status) }]}>{chartData.stats.systolic.avg}</Text>
                    <FontAwesome
                      name={getTrendIcon(chartData.stats.systolic.trend)}
                      size={12}
                      color={getStatusColor(chartData.stats.systolic.status)}
                      style={styles.trendIconStyle}
                    />
                  </View>
                  <Text style={styles.reportUnit}>mmHg</Text>
                </View>
                <View style={styles.reportDivider} />
                <View style={styles.reportItem}>
                  <Text style={styles.reportLabel}>平均舒張壓</Text>
                  <View style={styles.reportDataContainer}>
                    <Text style={[styles.reportValue, { color: getStatusColor(chartData.stats.diastolic.status) }]}>{chartData.stats.diastolic.avg}</Text>
                    <FontAwesome
                      name={getTrendIcon(chartData.stats.diastolic.trend)}
                      size={12}
                      color={getStatusColor(chartData.stats.diastolic.status)}
                      style={styles.trendIconStyle}
                    />
                  </View>
                  <Text style={styles.reportUnit}>mmHg</Text>
                </View>
                <View style={styles.reportDivider} />
                <View style={styles.reportItem}>
                  <Text style={styles.reportLabel}>平均心率</Text>
                  <View style={styles.reportDataContainer}>
                    <Text style={[styles.reportValue, { color: getStatusColor(chartData.stats.heartRate.status) }]}>{chartData.stats.heartRate.avg}</Text>
                    <FontAwesome
                      name={getTrendIcon(chartData.stats.heartRate.trend)}
                      size={12}
                      color={getStatusColor(chartData.stats.heartRate.status)}
                      style={styles.trendIconStyle}
                    />
                  </View>
                  <Text style={styles.reportUnit}>BPM</Text>
                </View>
              </View>
            </View>

            {/* 導出選項卡片 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <View style={styles.cardTitleIcon}>
                    <FontAwesome name="download" size={16} color="#2d87ff" />
                  </View>
                  <Text style={styles.cardTitle}>導出選項</Text>
                </View>
              </View>
              <View style={styles.exportContainer}>
                <Pressable style={styles.exportButton} onPress={handleExportPDF}>
                  <FontAwesome name="file-pdf-o" size={24} color="#ff3b30" />
                  <View style={styles.exportTextContainer}>
                    <Text style={styles.exportButtonText}>導出 PDF 報告</Text>
                    <Text style={styles.exportButtonSubtext}>上次更新：{chartData.stats.lastUpdate}</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.exportButton} onPress={handleExportExcel}>
                  <FontAwesome name="file-excel-o" size={24} color="#34c759" />
                  <View style={styles.exportTextContainer}>
                    <Text style={styles.exportButtonText}>導出 Excel 表格</Text>
                    <Text style={styles.exportButtonSubtext}>包含詳細數據記錄</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </ViewShot>
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(45,135,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(142,142,147,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  chartWrapper: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#8e8e93",
  },
  reportContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportItem: {
    flex: 1,
    alignItems: "center",
  },
  reportDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5ea",
    marginHorizontal: 16,
  },
  reportLabel: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 8,
  },
  reportValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  reportUnit: {
    fontSize: 13,
    color: "#8e8e93",
  },
  exportContainer: {
    gap: 12,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "rgba(142,142,147,0.1)",
    borderRadius: 12,
  },
  exportButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  exportTextContainer: {
    flex: 1,
  },
  exportButtonSubtext: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  reportDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendIconStyle: {
    marginTop: 4,
  },
});
