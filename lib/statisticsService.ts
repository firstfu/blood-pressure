import { BloodPressureRecord, BloodPressureStats, TrendDataPoint, TimePeriod, getBPCategory } from "../types/bloodPressure";

// 計算平均值
const calculateAverage = (numbers: number[]): number => {
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
};

// 計算趨勢
const calculateTrend = (data: number[]): "rising" | "falling" | "stable" => {
  if (data.length < 2) return "stable";

  const recentValues = data.slice(-5); // 取最近5個數值
  const firstValue = recentValues[0];
  const lastValue = recentValues[recentValues.length - 1];
  const difference = lastValue - firstValue;

  if (Math.abs(difference) < 5) return "stable";
  return difference > 0 ? "rising" : "falling";
};

// 生成時間標籤
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

// 分析血壓數據
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

// 生成趨勢數據
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

// 計算血壓分佈
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
