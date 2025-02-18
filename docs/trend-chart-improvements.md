# 血壓趨勢圖表改進計劃

## 當前問題

1. 僅顯示一週數據，時間跨度受限
2. 圖表呈現方式過於簡單（點狀顯示）
3. 缺乏時間週期選擇功能
4. 模擬數據量不足
5. 缺乏詳細的統計分析

## 改進方案

### 1. 時間週期選擇功能

- 新增時間週期選擇器組件
- 支援的時間範圍：
  - 週（預設，顯示最近 7 天）
  - 月（顯示最近 30 天）
  - 季（顯示最近 90 天）
  - 年（顯示最近 12 個月的月平均值）

### 2. 圖表視覺優化

- 將點狀顯示改為連續曲線
- 添加數值區間背景色標示（正常/偏高/偏低）
- 優化圖表交互，支援：
  - 點擊查看具體數值
  - 縮放查看細節
  - 左右滑動查看歷史數據

### 3. 數據模型擴充

```typescript
interface BloodPressureRecord {
  systolic: number; // 收縮壓
  diastolic: number; // 舒張壓
  heartRate: number; // 心率
  timestamp: Date; // 紀錄時間
  note?: string; // 備註（可選）
}

interface BloodPressureStats {
  average: {
    systolic: number;
    diastolic: number;
    heartRate: number;
  };
  max: BloodPressureRecord;
  min: BloodPressureRecord;
  trend: "rising" | "falling" | "stable";
}
```

### 4. 統計資訊增強

- 添加以下統計指標：
  - 平均值（時段內）
  - 最高/最低值
  - 趨勢分析（上升/下降/穩定）
  - 異常值標記

### 5. 性能優化

- 實現數據分頁加載
- 圖表渲染優化
- 大數據量下的效能處理

## 實施步驟

1. 新建時間週期選擇器組件
2. 改進圖表組件，支援新的展示方式
3. 擴充數據模型和模擬數據生成
4. 實現統計分析功能
5. 整合到現有界面
6. 性能測試和優化

## 預期效果

1. 提供更完整的血壓趨勢分析
2. 更直觀的數據可視化
3. 更豐富的數據分析維度
4. 更好的使用者體驗
