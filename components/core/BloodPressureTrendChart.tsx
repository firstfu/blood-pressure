/**
 * 血壓趨勢圖表組件
 * @file: BloodPressureTrendChart.tsx
 * @author: FirstFu
 * @date: 2024-03-24
 * @description: 使用 react-native-gifted-charts 實現的血壓趨勢圖表
 */

import React, { useMemo } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { TrendDataPoint, TimePeriod } from "../../types/bloodPressure";

interface Props {
  data: TrendDataPoint[];
  period: TimePeriod;
  onPointPress?: (point: TrendDataPoint) => void;
  chartWidth?: number;
}

interface ChartDataPoint {
  value: number;
  secondaryValue: number;
  label: string;
  dataPointText: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width - 40;
const CHART_PADDING = 16;

export function BloodPressureTrendChart({ data, period, onPointPress, chartWidth = SCREEN_WIDTH }: Props) {
  // 轉換數據格式
  const lineData = useMemo(() => {
    return data.map(
      (point): ChartDataPoint => ({
        value: point.systolic,
        secondaryValue: point.diastolic,
        label: point.time,
        dataPointText: point.systolic.toString(),
      })
    );
  }, [data]);

  // 計算Y軸範圍
  const yAxisRange = useMemo(() => {
    const allValues = [...data.map(d => d.systolic), ...data.map(d => d.diastolic)];
    const minValue = Math.floor(Math.min(...allValues) / 10) * 10;
    const maxValue = Math.ceil(Math.max(...allValues) / 10) * 10;
    return { min: minValue, max: maxValue };
  }, [data]);

  const getXLabel = (value: string) => {
    switch (period) {
      case "day":
        return value.split(" ")[1];
      case "week":
        return value.split("/")[1];
      case "month":
        return value.split("/")[1];
      case "year":
        return value.split("/")[0] + "月";
      default:
        return value;
    }
  };

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <LineChart
        data={lineData}
        width={chartWidth - CHART_PADDING * 2}
        height={240}
        spacing={40}
        initialSpacing={10}
        endSpacing={10}
        thickness={2}
        hideDataPoints={false}
        dataPointsColor="#7F3DFF"
        dataPointsRadius={3}
        color="#7F3DFF"
        startOpacity={0.9}
        endOpacity={0.2}
        xAxisColor="rgba(142,142,147,0.3)"
        yAxisColor="rgba(142,142,147,0.3)"
        yAxisTextStyle={styles.yAxisText}
        yAxisLabelWidth={40}
        yAxisLabelContainerStyle={styles.yAxisLabelContainer}
        xAxisLabelTextStyle={styles.xAxisLabelText}
        yAxisTextNumberOfLines={1}
        hideYAxisText={false}
        showVerticalLines
        maxValue={yAxisRange.max}
        minValue={yAxisRange.min}
        formatYLabel={(label: any) => {
          const value = parseFloat(label);
          return isNaN(value) ? label : Math.round(value).toString();
        }}
        formatXLabel={getXLabel}
        onPress={(item: ChartDataPoint, index: number) => {
          if (onPointPress) {
            onPointPress(data[index]);
          }
        }}
        secondaryData={lineData.map(item => ({
          ...item,
          value: data[lineData.indexOf(item)].diastolic,
          dataPointsColor: "#5D5FEF",
          color: "#5D5FEF",
        }))}
        secondaryLineConfig={{
          color: "#5D5FEF",
          thickness: 2,
          dataPointsRadius: 3,
          dataPointsColor: "#5D5FEF",
        }}
      />

      {/* 圖例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#7F3DFF" }]} />
          <Text style={styles.legendText}>收縮壓</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#5D5FEF" }]} />
          <Text style={styles.legendText}>舒張壓</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: CHART_PADDING,
    alignItems: "center",
  },
  yAxisText: {
    fontSize: 10,
    color: "rgba(142,142,147,0.8)",
    marginRight: 4,
  },
  xAxisLabelText: {
    fontSize: 10,
    color: "rgba(142,142,147,0.8)",
    marginTop: 4,
  },
  yAxisLabelContainer: {
    marginRight: 4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#8e8e93",
  },
});
