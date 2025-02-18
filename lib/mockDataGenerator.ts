import { BloodPressureRecord, TrendDataPoint, TimePeriod, BloodPressureStats } from "../types/bloodPressure";

// 生成隨機血壓數值，但保持在合理範圍內
function generateRandomBP(base: number, variance: number): number {
  return Math.round(base + (Math.random() - 0.5) * variance);
}

// 生成指定日期範圍內的隨機記錄
function generateRecordsForDateRange(startDate: Date, endDate: Date, recordsPerDay = 2): BloodPressureRecord[] {
  const records: BloodPressureRecord[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // 每天生成指定數量的記錄
    for (let i = 0; i < recordsPerDay; i++) {
      // 基準血壓值
      const baseSystolic = 120;
      const baseDiastolic = 80;
      const baseHeartRate = 75;

      // 生成略有變化的數值
      const record: BloodPressureRecord = {
        systolic: generateRandomBP(baseSystolic, 10),
        diastolic: generateRandomBP(baseDiastolic, 8),
        heartRate: generateRandomBP(baseHeartRate, 15),
        timestamp: new Date(currentDate),
      };

      records.push(record);
    }

    // 移至下一天
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return records;
}

// 計算統計數據
function calculateStats(records: BloodPressureRecord[]): BloodPressureStats {
  const average = {
    systolic: Math.round(records.reduce((sum, r) => sum + r.systolic, 0) / records.length),
    diastolic: Math.round(records.reduce((sum, r) => sum + r.diastolic, 0) / records.length),
    heartRate: Math.round(records.reduce((sum, r) => sum + r.heartRate, 0) / records.length),
  };

  const max = records.reduce((max, record) => (record.systolic > max.systolic ? record : max), records[0]);

  const min = records.reduce((min, record) => (record.systolic < min.systolic ? record : min), records[0]);

  // 計算趨勢
  const firstHalf = records.slice(0, Math.floor(records.length / 2));
  const secondHalf = records.slice(Math.floor(records.length / 2));

  const firstAvg = firstHalf.reduce((sum, r) => sum + r.systolic, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, r) => sum + r.systolic, 0) / secondHalf.length;

  const trend = secondAvg > firstAvg + 2 ? "rising" : secondAvg < firstAvg - 2 ? "falling" : "stable";

  return {
    average,
    max,
    min,
    trend,
  };
}

// 格式化時間標籤
function formatTimeLabel(date: Date, period: TimePeriod): string {
  switch (period) {
    case "week":
      return ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
    case "month":
      return `${date.getDate()}日`;
    case "quarter":
      return `${date.getMonth() + 1}/${date.getDate()}`;
    case "year":
      return `${date.getMonth() + 1}月`;
    default:
      return "";
  }
}

// 根據時間週期生成趨勢數據
export function generateTrendData(period: TimePeriod): {
  data: TrendDataPoint[];
  stats: BloodPressureStats;
} {
  const endDate = new Date();
  const startDate = new Date();

  // 設定起始日期
  switch (period) {
    case "week":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "month":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "quarter":
      startDate.setDate(endDate.getDate() - 90);
      break;
    case "year":
      startDate.setMonth(endDate.getMonth() - 12);
      break;
  }

  // 生成原始記錄
  const records = generateRecordsForDateRange(startDate, endDate);

  // 根據時間週期聚合數據
  let aggregatedData: TrendDataPoint[] = [];

  if (period === "year") {
    // 按月聚合
    const monthlyData = new Map<string, BloodPressureRecord[]>();
    records.forEach(record => {
      const key = `${record.timestamp.getFullYear()}-${record.timestamp.getMonth()}`;
      if (!monthlyData.has(key)) {
        monthlyData.set(key, []);
      }
      monthlyData.get(key)?.push(record);
    });

    aggregatedData = Array.from(monthlyData.entries()).map(([key, monthRecords]) => {
      const avg = {
        systolic: Math.round(monthRecords.reduce((sum, r) => sum + r.systolic, 0) / monthRecords.length),
        diastolic: Math.round(monthRecords.reduce((sum, r) => sum + r.diastolic, 0) / monthRecords.length),
        heartRate: Math.round(monthRecords.reduce((sum, r) => sum + r.heartRate, 0) / monthRecords.length),
      };

      return {
        ...avg,
        time: formatTimeLabel(monthRecords[0].timestamp, period),
        timestamp: monthRecords[0].timestamp,
      };
    });
  } else {
    // 按日聚合
    const dailyData = new Map<string, BloodPressureRecord[]>();
    records.forEach(record => {
      const key = record.timestamp.toDateString();
      if (!dailyData.has(key)) {
        dailyData.set(key, []);
      }
      dailyData.get(key)?.push(record);
    });

    aggregatedData = Array.from(dailyData.entries()).map(([key, dayRecords]) => {
      const avg = {
        systolic: Math.round(dayRecords.reduce((sum, r) => sum + r.systolic, 0) / dayRecords.length),
        diastolic: Math.round(dayRecords.reduce((sum, r) => sum + r.diastolic, 0) / dayRecords.length),
        heartRate: Math.round(dayRecords.reduce((sum, r) => sum + r.heartRate, 0) / dayRecords.length),
      };

      return {
        ...avg,
        time: formatTimeLabel(dayRecords[0].timestamp, period),
        timestamp: dayRecords[0].timestamp,
      };
    });
  }

  // 計算統計數據
  const stats = calculateStats(records);

  return {
    data: aggregatedData,
    stats,
  };
}
