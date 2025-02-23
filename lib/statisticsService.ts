/**
 * @file statisticsService.ts
 * @author FirstFu
 * @date 2024-03-21
 * @module Services/Statistics
 * @description 血壓數據統計服務
 * 提供血壓數據的統計分析功能，包括：
 * 1. 計算平均值
 * 2. 分析趨勢
 * 3. 生成時間標籤
 * 4. 分析血壓數據
 * 5. 生成趨勢數據
 * 6. 計算血壓分佈
 *
 * @dependencies
 * - types/bloodPressure.ts: 血壓相關類型定義
 */

import { BloodPressureRecord, BloodPressureStats, TrendDataPoint, TimePeriod, getBPCategory } from "../types/bloodPressure";

/**
 * 計算數字數組的平均值
 * @param numbers - 要計算平均值的數字數組
 * @returns 四捨五入後的平均值
 */
const calculateAverage = (numbers: number[]): number => {
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
};

/**
 * 計算數據趨勢
 * @param data - 要分析趨勢的數字數組
 * @returns 趨勢狀態："rising" | "falling" | "stable"
 * @description
 * - 取最近5個數值進行分析
 * - 如果首尾差值小於5，判定為穩定
 * - 如果差值大於0，判定為上升
 * - 如果差值小於0，判定為下降
 */
const calculateTrend = (data: number[]): "rising" | "falling" | "stable" => {
  if (data.length < 2) return "stable";

  const recentValues = data.slice(-5); // 取最近5個數值
  const firstValue = recentValues[0];
  const lastValue = recentValues[recentValues.length - 1];
  const difference = lastValue - firstValue;

  if (Math.abs(difference) < 5) return "stable";
  return difference > 0 ? "rising" : "falling";
};

/**
 * 根據時間週期生成時間標籤
 * @param period - 時間週期：day | week | month | year
 * @param count - 需要生成的標籤數量
 * @returns 時間標籤數組
 * @description
 * - day: 每2小時一個標籤
 * - week: 週一到週日
 * - month: 1日到N日
 * - year: 1月到12月
 */
const generateTimeLabels = (period: TimePeriod, count: number): string[] => {
  switch (period) {
    case "day":
      return Array.from({ length: count }, (_, i) => `${i * 2}:00`);
    case "week":
      return ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];
    case "month":
      return Array.from({ length: count }, (_, i) => `${i + 1}日`);
    case "year":
      return ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    default:
      return [];
  }
};

/**
 * 分析血壓記錄數據
 * @param records - 血壓記錄數組
 * @returns 血壓統計數據，包含平均值、最大值、最小值和趨勢
 * @throws {Error} 當沒有可用記錄時拋出錯誤
 */
export const analyzeBloodPressure = (records: BloodPressureRecord[]): BloodPressureStats => {
  if (records.length === 0) {
    throw new Error("No records available for analysis");
  }

  const systolicValues = records.map(r => r.systolic);
  const diastolicValues = records.map(r => r.diastolic);
  const heartRateValues = records.map(r => r.heartRate);

  const maxRecord = records.reduce((max, current) => (current.systolic > max.systolic ? current : max));

  const minRecord = records.reduce((min, current) => (current.systolic < min.systolic ? current : min));

  return {
    average: {
      systolic: calculateAverage(systolicValues),
      diastolic: calculateAverage(diastolicValues),
      heartRate: calculateAverage(heartRateValues),
    },
    max: maxRecord,
    min: minRecord,
    trend: calculateTrend(systolicValues),
  };
};

/**
 * 生成趨勢數據
 * @param records - 血壓記錄數組
 * @param period - 時間週期
 * @returns 趨勢數據點數組
 * @description
 * 1. 按時間排序記錄
 * 2. 根據時間週期分組數據
 * 3. 計算每組的統計數據
 * 4. 生成趨勢數據點
 */
export const generateTrendData = (records: BloodPressureRecord[], period: TimePeriod): TrendDataPoint[] => {
  // 按時間排序
  const sortedRecords = [...records].sort((a, b) => a.timestamp - b.timestamp);

  // 根據時間週期分組數據
  const groupedData = new Map<string, BloodPressureRecord[]>();

  sortedRecords.forEach(record => {
    const date = new Date(record.timestamp);
    let key: string;

    switch (period) {
      case "day":
        key = `${date.getHours()}`;
        break;
      case "week":
        key = date.getDay().toString();
        break;
      case "month":
        key = date.getDate().toString();
        break;
      case "year":
        key = date.getMonth().toString();
        break;
    }

    if (!groupedData.has(key)) {
      groupedData.set(key, []);
    }
    groupedData.get(key)?.push(record);
  });

  // 生成趨勢數據點
  const trendData: TrendDataPoint[] = [];
  const timeLabels = generateTimeLabels(period, period === "year" ? 12 : groupedData.size);

  timeLabels.forEach((label, index) => {
    const groupRecords = groupedData.get(index.toString()) || [];
    if (groupRecords.length > 0) {
      const stats = analyzeBloodPressure(groupRecords);
      trendData.push({
        time: label,
        systolic: stats.average.systolic,
        diastolic: stats.average.diastolic,
        pulse: stats.average.heartRate,
        timestamp: groupRecords[0].timestamp,
      });
    }
  });

  return trendData;
};

/**
 * 計算血壓分佈情況
 * @param records - 血壓記錄數組
 * @returns 各類型血壓的分佈統計，包含類別、百分比和數量
 * @description
 * 統計以下血壓類型的分佈：
 * - normal: 正常
 * - elevated: 偏高
 * - high: 高血壓
 * - crisis: 高血壓危象
 * - low: 低血壓
 */
export const calculateBPDistribution = (records: BloodPressureRecord[]) => {
  const distribution = {
    normal: 0,
    elevated: 0,
    high: 0,
    crisis: 0,
    low: 0,
  };

  records.forEach(record => {
    const category = getBPCategory(record.systolic, record.diastolic);
    distribution[category]++;
  });

  const total = records.length;
  return Object.entries(distribution).map(([category, count]) => ({
    category,
    percentage: Math.round((count / total) * 100),
    count,
  }));
};
