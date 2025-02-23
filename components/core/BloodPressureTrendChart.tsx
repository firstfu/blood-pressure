import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { TrendDataPoint, TimePeriod } from "../../types/bloodPressure";

interface Props {
  data: TrendDataPoint[];
  period: TimePeriod;
  onPointPress?: (point: TrendDataPoint) => void;
}

export function BloodPressureTrendChart({ data, period, onPointPress }: Props) {
  const chartData = {
    labels: data.map(point => point.time),
    datasets: [
      {
        data: data.map(point => point.systolic),
        color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`, // 收縮壓（紅色）
        strokeWidth: 2,
      },
      {
        data: data.map(point => point.diastolic),
        color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`, // 舒張壓（綠色）
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

  // 根據時間週期調整圖表顯示
  const getChartHeight = () => {
    switch (period) {
      case "day":
        return 200;
      case "week":
        return 220;
      case "month":
        return 250;
      case "year":
        return 280;
      default:
        return 220;
    }
  };

  const screenWidth = Dimensions.get("window").width - 32; // 考慮左右邊距

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={getChartHeight()}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
        yAxisInterval={20}
        segments={5}
        getDotColor={(dataPoint, dataSetIndex) => {
          const value = dataSetIndex === 0 ? dataPoint : null;
          if (value && value > 140) return "#ff3b30"; // 高
          if (value && value < 90) return "#5856d6"; // 低
          return dataSetIndex === 0 ? "#ff3b30" : "#34c759"; // 正常
        }}
        renderDotContent={({ x, y, index, indexData }) => (
          <Text
            key={`${index}-${indexData}-${x}-${y}`}
            style={[
              styles.dotLabel,
              {
                position: "absolute",
                top: y - 20,
                left: x - 15,
              },
            ]}
          >
            {indexData}
          </Text>
        )}
      />
      <View style={styles.legend}>
        {chartData.legend.map((label, index) => (
          <View key={label} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {
                  backgroundColor: chartData.datasets[index].color(1),
                },
              ]}
            />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#8e8e93",
  },
  dotLabel: {
    fontSize: 10,
    color: "#8e8e93",
  },
});
