// 血壓數據記錄
export interface BloodPressureRecord {
  systolic: number; // 收縮壓
  diastolic: number; // 舒張壓
  heartRate: number; // 心率
  timestamp: Date; // 記錄時間
  note?: string; // 備註（選填）
}

// 血壓統計數據
export interface BloodPressureStats {
  average: {
    systolic: number;
    diastolic: number;
    heartRate: number;
  };
  max: BloodPressureRecord;
  min: BloodPressureRecord;
  trend: "rising" | "falling" | "stable";
}

// 時間週期選項
export type TimePeriod = "week" | "month" | "quarter" | "year";

// 趨勢數據點
export interface TrendDataPoint {
  systolic: number;
  diastolic: number;
  heartRate: number;
  time: string; // 顯示用時間標籤
  timestamp: Date; // 實際時間戳
}

// 趨勢數據集
export interface TrendDataSet {
  data: TrendDataPoint[];
  period: TimePeriod;
  stats: BloodPressureStats;
}

// 血壓狀態範圍
export const BP_RANGES = {
  systolic: {
    low: { min: 0, max: 90 },
    normal: { min: 90, max: 120 },
    elevated: { min: 120, max: 130 },
    high: { min: 130, max: 180 },
    crisis: { min: 180, max: 300 },
  },
  diastolic: {
    low: { min: 0, max: 60 },
    normal: { min: 60, max: 80 },
    elevated: { min: 80, max: 90 },
    high: { min: 90, max: 120 },
    crisis: { min: 120, max: 200 },
  },
};

// 血壓分類判斷
export const getBPCategory = (systolic: number, diastolic: number): keyof typeof BP_RANGES.systolic => {
  if (systolic >= BP_RANGES.systolic.crisis.min || diastolic >= BP_RANGES.diastolic.crisis.min) {
    return "crisis";
  }
  if (systolic >= BP_RANGES.systolic.high.min || diastolic >= BP_RANGES.diastolic.high.min) {
    return "high";
  }
  if (systolic >= BP_RANGES.systolic.elevated.min || diastolic >= BP_RANGES.diastolic.elevated.min) {
    return "elevated";
  }
  if (systolic <= BP_RANGES.systolic.low.max || diastolic <= BP_RANGES.diastolic.low.max) {
    return "low";
  }
  return "normal";
};
