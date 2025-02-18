import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { TrendDataPoint, BP_RANGES, getBPCategory } from "../../types/bloodPressure";
import { TimePeriod } from "../../types/bloodPressure";
import Svg, { Path, Circle, Line, Rect, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";

interface BloodPressureTrendChartProps {
  data: TrendDataPoint[];
  period: TimePeriod;
  onPointPress?: (point: TrendDataPoint) => void;
  height?: number;
  showHeartRate?: boolean;
}

export function BloodPressureTrendChart({ data, period, onPointPress, height = 200, showHeartRate = false }: BloodPressureTrendChartProps) {
  const CHART_WIDTH = Dimensions.get("window").width - 40; // 左右各留20的padding
  const CHART_HEIGHT = height;
  const PADDING = { top: 20, right: 20, bottom: 30, left: 40 };
  const POINT_RADIUS = 4;

  // 計算數值範圍
  const valueRange = useMemo(() => {
    const allSystolic = data.map(d => d.systolic);
    const allDiastolic = data.map(d => d.diastolic);
    const minValue = Math.min(...allDiastolic) - 10;
    const maxValue = Math.max(...allSystolic) + 10;
    return { min: minValue, max: maxValue };
  }, [data]);

  // 座標轉換函數
  const getX = useCallback(
    (index: number) => {
      const availableWidth = CHART_WIDTH - PADDING.left - PADDING.right;
      return PADDING.left + (index * availableWidth) / (data.length - 1);
    },
    [data.length, CHART_WIDTH]
  );

  const getY = useCallback(
    (value: number) => {
      const availableHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
      return PADDING.top + availableHeight - ((value - valueRange.min) * availableHeight) / (valueRange.max - valueRange.min);
    },
    [CHART_HEIGHT, valueRange]
  );

  // 生成路徑
  const createLinePath = (values: number[]) => {
    return values.reduce((path, value, index) => {
      const x = getX(index);
      const y = getY(value);
      return path + `${index === 0 ? "M" : "L"} ${x} ${y} `;
    }, "");
  };

  // 生成區域漸層路徑
  const createAreaPath = (values: number[]) => {
    const linePath = createLinePath(values);
    const lastX = getX(values.length - 1);
    const firstX = getX(0);
    return `${linePath} L ${lastX} ${CHART_HEIGHT - PADDING.bottom} L ${firstX} ${CHART_HEIGHT - PADDING.bottom} Z`;
  };

  // 背景區間
  const renderBackgroundRanges = () => {
    const ranges = BP_RANGES.systolic;
    const availableHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    return Object.entries(ranges).map(([key, range]) => {
      const rangeHeight = ((range.max - range.min) * availableHeight) / (valueRange.max - valueRange.min);
      const rangeY = getY(range.max);

      let color;
      switch (key) {
        case "low":
          color = "rgba(255, 159, 64, 0.1)";
          break;
        case "normal":
          color = "rgba(75, 192, 192, 0.1)";
          break;
        case "elevated":
          color = "rgba(255, 205, 86, 0.1)";
          break;
        case "high":
          color = "rgba(255, 99, 132, 0.1)";
          break;
        case "crisis":
          color = "rgba(255, 0, 0, 0.1)";
          break;
        default:
          color = "transparent";
      }

      return <Rect key={key} x={PADDING.left} y={rangeY} width={CHART_WIDTH - PADDING.left - PADDING.right} height={rangeHeight} fill={color} />;
    });
  };

  // 渲染網格線
  const renderGrid = () => {
    const horizontalLines = [];
    const step = Math.round((valueRange.max - valueRange.min) / 5);

    for (let i = valueRange.min; i <= valueRange.max; i += step) {
      const y = getY(i);
      horizontalLines.push(
        <React.Fragment key={i}>
          <Line x1={PADDING.left} y1={y} x2={CHART_WIDTH - PADDING.right} y2={y} stroke="rgba(142, 142, 147, 0.1)" strokeWidth="1" />
          <Text style={[styles.gridLabel, { position: "absolute", left: 0, top: y - 10 }]}>{i}</Text>
        </React.Fragment>
      );
    }
    return horizontalLines;
  };

  return (
    <MotiView style={styles.container} from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
      <View style={[styles.chartContainer, { height }]}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <SvgGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#7F3DFF" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#7F3DFF" stopOpacity="0" />
            </SvgGradient>
            <SvgGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#5D5FEF" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#5D5FEF" stopOpacity="0" />
            </SvgGradient>
          </Defs>

          {renderBackgroundRanges()}
          {renderGrid()}

          {/* 收縮壓區域 */}
          <Path d={createAreaPath(data.map(d => d.systolic))} fill="url(#systolicGradient)" />

          {/* 舒張壓區域 */}
          <Path d={createAreaPath(data.map(d => d.diastolic))} fill="url(#diastolicGradient)" />

          {/* 收縮壓線 */}
          <Path d={createLinePath(data.map(d => d.systolic))} stroke="#7F3DFF" strokeWidth="2" fill="none" />

          {/* 舒張壓線 */}
          <Path d={createLinePath(data.map(d => d.diastolic))} stroke="#5D5FEF" strokeWidth="2" fill="none" />

          {/* 數據點 */}
          {data.map((point, index) => (
            <React.Fragment key={index}>
              <Circle cx={getX(index)} cy={getY(point.systolic)} r={POINT_RADIUS} fill="#7F3DFF" onPress={() => onPointPress?.(point)} />
              <Circle cx={getX(index)} cy={getY(point.diastolic)} r={POINT_RADIUS} fill="#5D5FEF" onPress={() => onPointPress?.(point)} />
            </React.Fragment>
          ))}
        </Svg>

        {/* X軸標籤 */}
        <View style={styles.xAxisLabels}>
          {data.map((point, index) => (
            <Text key={index} style={styles.xAxisLabel}>
              {point.time}
            </Text>
          ))}
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  chartContainer: {
    position: "relative",
  },
  xAxisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  gridLabel: {
    fontSize: 10,
    color: "#8E8E93",
    width: 30,
    textAlign: "right",
  },
});
