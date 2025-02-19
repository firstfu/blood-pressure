import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { TrendDataPoint } from "../../types/bloodPressure";

interface Props {
  data: TrendDataPoint[];
  onPointPress?: (point: TrendDataPoint) => void;
}

interface ChartDataPoint {
  value: number;
  date: Date;
  label: string;
  dataPointText: string;
}

export const BloodPressureTrendChart: React.FC<Props> = ({ data, onPointPress }) => {
  // 將數據轉換為圖表所需的格式
  const systolicData = data.map(point => ({
    value: point.systolic,
    date: new Date(point.timestamp),
    label: new Date(point.timestamp).toLocaleDateString("zh-TW", { month: "short", day: "numeric" }),
    dataPointText: point.systolic.toString(),
  }));

  const diastolicData = data.map(point => ({
    value: point.diastolic,
    date: new Date(point.timestamp),
    label: new Date(point.timestamp).toLocaleDateString("zh-TW", { month: "short", day: "numeric" }),
    dataPointText: point.diastolic.toString(),
  }));

  // 定義血壓正常範圍的背景區域
  const normalRange = {
    systolic: { min: 90, max: 120 },
    diastolic: { min: 60, max: 80 },
  };

  return (
    <View style={styles.container}>
      <LineChart
        areaChart
        data={systolicData}
        data2={diastolicData}
        height={200}
        width={Dimensions.get("window").width - 40}
        spacing={40}
        initialSpacing={20}
        color1="#7F3DFF"
        color2="#5D5FEF"
        textColor1="#7F3DFF"
        textColor2="#5D5FEF"
        textShiftY={-8}
        textShiftX={-5}
        dataPointsHeight={6}
        dataPointsWidth={6}
        curved
        thickness={2}
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={styles.yAxisText}
        xAxisLabelTextStyle={styles.xAxisText}
        noOfSections={6}
        maxValue={180}
        minValue={40}
        yAxisLabelSuffix=" mmHg"
        renderTooltip={(item: ChartDataPoint) => (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{item.dataPointText} mmHg</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  yAxisText: {
    color: "#8e8e93",
    fontSize: 12,
  },
  xAxisText: {
    color: "#8e8e93",
    fontSize: 10,
    width: 60,
    textAlign: "center",
  },
  tooltip: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 8,
    borderRadius: 4,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
  },
});
