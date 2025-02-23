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
const SYSTOLIC_COLOR = "#FF3B30"; // 收縮壓改用紅色
const DIASTOLIC_COLOR = "#007AFF"; // 舒張壓改用藍色
const CHART_HEIGHT = 200; // 減少圖表高度

export function BloodPressureTrendChart({ data, period, onPointPress, chartWidth = SCREEN_WIDTH }: Props) {
  // 處理 X 軸標籤格式
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

  // 轉換數據格式
  const lineData = useMemo(() => {
    return data.map(
      (point): ChartDataPoint => ({
        value: point.systolic,
        secondaryValue: point.diastolic,
        label: getXLabel(point.time),
        dataPointText: point.systolic.toString(),
      })
    );
  }, [data, period]);

  // 計算Y軸範圍
  const yAxisRange = useMemo(() => {
    const allValues = [...data.map(d => d.systolic), ...data.map(d => d.diastolic)];
    const minValue = Math.floor(Math.min(...allValues) / 10) * 10;
    const maxValue = Math.ceil(Math.max(...allValues) / 10) * 10;
    return { min: minValue, max: maxValue };
  }, [data]);

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <LineChart
        data={lineData}
        width={chartWidth}
        height={CHART_HEIGHT}
        spacing={45}
        initialSpacing={45}
        endSpacing={0}
        thickness={2}
        hideDataPoints={false}
        dataPointsColor={SYSTOLIC_COLOR}
        dataPointsRadius={4}
        color={SYSTOLIC_COLOR}
        startOpacity={1}
        endOpacity={1}
        xAxisColor="rgba(142,142,147,0.3)"
        yAxisColor="rgba(142,142,147,0.3)"
        yAxisTextStyle={styles.yAxisText}
        yAxisLabelWidth={35}
        yAxisLabelContainerStyle={styles.yAxisLabelContainer}
        xAxisLabelTextStyle={styles.xAxisLabelText}
        xAxisTextNumberOfLines={1}
        yAxisTextNumberOfLines={1}
        hideYAxisText={false}
        showVerticalLines
        maxValue={yAxisRange.max}
        noOfSections={5}
        yAxisOffset={yAxisRange.min}
        formatYLabel={(label: any) => {
          const value = parseFloat(label);
          return isNaN(value) ? label : Math.round(value).toString();
        }}
        onPress={(item: ChartDataPoint, index: number) => {
          if (onPointPress) {
            onPointPress(data[index]);
          }
        }}
        secondaryData={lineData.map(item => ({
          ...item,
          value: data[lineData.indexOf(item)].diastolic,
          dataPointsColor: DIASTOLIC_COLOR,
          color: DIASTOLIC_COLOR,
          dataPointsRadius: 4,
          thickness: 2,
        }))}
        secondaryLineConfig={{
          color: DIASTOLIC_COLOR,
          thickness: 2,
          dataPointsRadius: 4,
          dataPointsColor: DIASTOLIC_COLOR,
          startOpacity: 1,
          endOpacity: 1,
        }}
      />

      {/* 圖例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: SYSTOLIC_COLOR }]} />
          <Text style={styles.legendText}>收縮壓</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: DIASTOLIC_COLOR }]} />
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
    fontSize: 12,
    color: "rgba(142,142,147,0.8)",
    marginRight: 0,
    textAlign: "right",
    width: "100%",
  },
  xAxisLabelText: {
    fontSize: 12,
    color: "rgba(142,142,147,0.8)",
    marginTop: 4,
  },
  yAxisLabelContainer: {
    marginRight: 4,
    paddingRight: 0,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
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
