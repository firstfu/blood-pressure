import { TrendDataPoint, TimePeriod, BloodPressureStats, BloodPressureRecord } from "../types/bloodPressure";
import { format, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { zhTW } from "date-fns/locale";

// 生成隨機數字
const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成數據點
const generateDataPoint = (date: Date): TrendDataPoint => {
  return {
    systolic: generateRandomNumber(110, 130),
    diastolic: generateRandomNumber(60, 85),
    pulse: generateRandomNumber(60, 100),
    time: format(date, "MM/dd", { locale: zhTW }),
    timestamp: date.getTime(),
  };
};

// 計算統計數據
const calculateStats = (data: TrendDataPoint[]): BloodPressureStats => {
  const systolicValues = data.map(point => point.systolic);
  const diastolicValues = data.map(point => point.diastolic);
  const pulseValues = data.map(point => point.pulse || 0).filter(Boolean);

  // 找出最高和最低血壓記錄
  const maxIndex = systolicValues.reduce((maxIdx, curr, idx) => (curr > systolicValues[maxIdx] ? idx : maxIdx), 0);
  const minIndex = systolicValues.reduce((minIdx, curr, idx) => (curr < systolicValues[minIdx] ? idx : minIdx), 0);

  // 創建記錄對象
  const createRecord = (index: number): BloodPressureRecord => ({
    id: `mock-${index}`,
    systolic: data[index].systolic,
    diastolic: data[index].diastolic,
    heartRate: data[index].pulse || 0,
    timestamp: data[index].timestamp,
    note: "",
    category: "morning",
  });

  return {
    average: {
      systolic: Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length),
      diastolic: Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length),
      heartRate: Math.round(pulseValues.reduce((a, b) => a + b, 0) / pulseValues.length),
    },
    max: createRecord(maxIndex),
    min: createRecord(minIndex),
    trend: "stable",
  };
};

// 生成趨勢數據
export const generateTrendData = (period: TimePeriod) => {
  const now = new Date();
  const data: TrendDataPoint[] = [];
  let startDate: Date;

  switch (period) {
    case "day":
      startDate = subDays(now, 1);
      for (let i = 0; i <= 24; i += 3) {
        const date = new Date(startDate.getTime() + i * 60 * 60 * 1000);
        data.push(generateDataPoint(date));
      }
      break;
    case "week":
      startDate = subWeeks(now, 1);
      for (let i = 0; i <= 7; i++) {
        const date = subDays(now, 7 - i);
        data.push(generateDataPoint(date));
      }
      break;
    case "month":
      startDate = subMonths(now, 1);
      for (let i = 0; i <= 30; i += 2) {
        const date = subDays(now, 30 - i);
        data.push(generateDataPoint(date));
      }
      break;
    case "year":
      startDate = subYears(now, 1);
      for (let i = 0; i <= 12; i++) {
        const date = subMonths(now, 12 - i);
        data.push(generateDataPoint(date));
      }
      break;
  }

  return {
    data,
    stats: calculateStats(data),
  };
};
