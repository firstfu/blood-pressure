/**
 * 血壓數據生成器
 * @file: mockDataGenerator.ts
 * @description: 用於生成模擬的血壓數據，包括趨勢數據和統計數據
 * @author: FirstFu
 * @date: 2024-02-23
 * @module: lib/mockDataGenerator
 * @dependencies:
 * - date-fns: 用於日期處理
 * - types/bloodPressure: 血壓相關的型別定義
 */

import { TrendDataPoint, TimePeriod, BloodPressureStats, BloodPressureRecord } from "../types/bloodPressure";
import { format, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { zhTW } from "date-fns/locale";

/**
 * 生成指定範圍內的隨機數字
 * @param min - 最小值
 * @param max - 最大值
 * @returns 隨機整數
 */
const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 生成單個血壓數據點
 * @param date - 數據點的日期
 * @returns TrendDataPoint - 包含血壓和脈搏數據的數據點
 * @description:
 * - 收縮壓範圍：110-130 mmHg（正常範圍）
 * - 舒張壓範圍：60-85 mmHg（正常範圍）
 * - 脈搏範圍：60-100 BPM（正常範圍）
 */
const generateDataPoint = (date: Date): TrendDataPoint => {
  return {
    systolic: generateRandomNumber(110, 130),
    diastolic: generateRandomNumber(60, 85),
    pulse: generateRandomNumber(60, 100),
    time: format(date, "MM/dd", { locale: zhTW }),
    timestamp: date.getTime(),
  };
};

/**
 * 計算血壓統計數據
 * @param data - 血壓趨勢數據數組
 * @returns BloodPressureStats - 血壓統計結果
 * @description:
 * 計算並返回以下統計數據：
 * 1. 平均值（收縮壓、舒張壓、心率）
 * 2. 最高記錄
 * 3. 最低記錄
 * 4. 趨勢狀態
 */
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

/**
 * 生成血壓趨勢數據
 * @param period - 時間週期（日、週、月、年）
 * @returns {data: TrendDataPoint[], stats: BloodPressureStats} - 趨勢數據和統計數據
 * @description:
 * 根據不同時間週期生成對應的數據點：
 * - day: 每3小時一個數據點，共9個點
 * - week: 每天一個數據點，共8個點
 * - month: 從當月1號開始，每天一個數據點
 * - year: 從當年1月開始，每月一個數據點
 */
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
      // 設置為當月1號
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth(), i + 1);
        if (date <= now) {
          // 只生成到今天為止的數據
          data.push(generateDataPoint(date));
        }
      }
      break;
    case "year":
      // 設置為當年1月1號
      startDate = new Date(now.getFullYear(), 0, 1);
      const currentMonth = now.getMonth();

      for (let i = 0; i <= currentMonth; i++) {
        const date = new Date(now.getFullYear(), i, 1);
        data.push(generateDataPoint(date));
      }
      break;
  }

  return {
    data,
    stats: calculateStats(data),
  };
};
