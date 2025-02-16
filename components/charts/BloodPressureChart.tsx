import { StyleSheet, Dimensions, Platform } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ThemedView } from "@/components/ThemedView";

const screenWidth = Dimensions.get("window").width;

export function BloodPressureChart() {
  // 模擬數據，實際應用中應從 API 獲取
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [120, 118, 122, 121, 119, 120, 118], // 收縮壓
        color: (opacity = 1) => `rgba(45, 135, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [80, 78, 82, 79, 81, 80, 78], // 舒張壓
        color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["收縮壓", "舒張壓"],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
    },
  };

  return (
    <ThemedView style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines
        withShadow={false}
        yAxisSuffix=" mmHg"
        fromZero
        segments={4}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
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
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
});
