# 血壓追蹤應用程序 UI/UX 設計規範

## 0. 整體設計風格

### 視覺風格

- 專業醫療：採用現代簡約的設計，突出專業性
- 清晰易讀：重要數據採用大字體，確保清晰可見
- 溫和互動：使用適當的觸覺反饋，提供良好的操作體驗
- 一致性：所有元件採用統一的設計語言，提供連貫的視覺體驗

### 關鍵設計元素

- 數據展示卡片：採用純白背景、大字體顯示血壓數值
- 狀態指示：使用醫療級別的狀態顏色系統（正常-警告-危險）
- 趨勢圖表：使用專業的數據可視化方案
- 操作按鈕：清晰的視覺層級和觸覺反饋

### 交互設計

- 快速記錄：首頁提供快速記錄功能
- 即時反饋：數據輸入後立即顯示狀態評估
- 手勢操作：支援滑動和觸覺反饋
- 智能輔助：AI 助手提供專業建議

## 1. 品牌識別

### 品牌色彩系統

```typescript
// 主要色彩（來自 Colors.ts）
const primary = "#2B7DE9"; // 主色調：專業藍色
const secondary = "#5C9CE6"; // 次要色調：淺藍色
const success = "#4CAF50"; // 成功狀態：綠色
const warning = "#FFA726"; // 警告狀態：橙色
const danger = "#EF5350"; // 危險狀態：紅色

// 中性色彩
const background = "#F8F9FA"; // 背景色：淺灰色
const textPrimary = "#2C3E50"; // 主要文字：深灰色
const textSecondary = "#7F8C8D"; // 次要文字：中灰色
const border = "#E0E6ED"; // 邊框色：淺灰色
const divider = "#E0E6ED"; // 分隔線：淺灰色

// 血壓數值專用色彩
const systolic = primary; // 收縮壓：主色調
const diastolic = secondary; // 舒張壓：次要色調
const heartRate = "#5C9CE6"; // 心率：次要色調

// 深色模式調整
const darkPrimary = "#3498DB";
const darkSecondary = "#5DADE2";
const darkBackground = "#1A1A1A";
const darkTextPrimary = "#FFFFFF";
const darkTextSecondary = "#B0B3B8";
```

### 字體系統（來自 Typography.ts）

```typescript
const Typography = {
  // 字體大小
  size: {
    h1: 32, // 大標題
    h2: 28, // 次標題
    h3: 24, // 小標題
    large: 20, // 大型文字
    regular: 17, // 正常文字
    small: 15, // 小型文字
    caption: 13, // 說明文字
  },

  // 字重
  weight: {
    bold: "700",
    semibold: "600",
    medium: "500",
    regular: "400",
  },

  // 行高倍數
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};
```

## 2. 組件設計

### 核心組件

- BloodPressureTrendChart：血壓趨勢圖表
- StatisticsTrendCard：統計趨勢卡片
- BloodPressureInput：血壓數據輸入
- TimePeriodSelector：時間週期選擇器

### UI 基礎組件

- Button：通用按鈕組件
- Card：卡片容器組件
- Input：輸入框組件
- HapticTab：帶觸覺反饋的標籤頁

## 3. 頁面佈局

### 導航結構

```
首頁
├── 快速記錄
├── 今日概覽
├── 趨勢圖表
└── 健康建議

記錄
├── 數據列表
├── 詳細記錄
└── 編輯記錄

統計
├── 趨勢分析
├── 數據報告
└── 導出選項

AI 助手
├── 對話界面
├── 健康建議
└── 知識庫
```

### 響應式斷點

```scss
$breakpoints: (
  "mobile": 320px,
  "tablet": 768px,
  "desktop": 1024px,
  "wide": 1440px,
);
```

## 4. 交互規範

### 手勢操作

- 左滑：顯示操作選項
- 右滑：返回上一頁
- 下拉：刷新數據
- 雙擊：展開詳情
- 長按：進入編輯模式

### 動畫效果

```scss
// 過渡動畫
$transition-fast: 0.2s ease-out;
$transition-normal: 0.3s ease-out;
$transition-slow: 0.4s ease-out;

// 常用動畫
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

## 5. 無障礙設計

### 色彩對比

- 確保所有文字顏色與背景的對比度達到 WCAG 2.1 標準
- 提供高對比度模式選項
- 使用圖案配合顏色來傳達信息

### 操作適配

- 最小點擊區域：44x44pt
- 提供鍵盤導航支持
- 支持 VoiceOver 朗讀
- 提供操作提示和反饋

## 6. 圖標系統

### 圖標尺寸

```scss
$icon-sizes: (
  "xs": 16px,
  "sm": 20px,
  "md": 24px,
  "lg": 32px,
  "xl": 40px,
);
```

### 常用圖標

- 添加記錄：plus-circle
- 編輯：pencil
- 刪除：trash
- 分享：share
- 設置：gear
- 通知：bell
- 返回：chevron-left
- 更多：ellipsis-h

## 7. 載入狀態

### 骨架屏

- 使用淡灰色背景
- 保持與實際內容相同的佈局
- 添加淡入淡出動畫

### 加載指示器

```scss
.loader {
  width: 24px;
  height: 24px;
  border: 2px solid $border;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## 8. 錯誤處理

### 錯誤狀態

- 輸入錯誤：紅色邊框 + 錯誤提示
- 網絡錯誤：重試選項
- 數據異常：警告提示
- 系統錯誤：友好提示 + 反饋入口

### 空狀態

- 提供清晰的引導信息
- 顯示操作建議
- 使用適當的插圖

## 9. 數據可視化

### 圖表配置

```typescript
// 圖表顏色（與主題色系統一致）
const chartColors = {
  systolic: primary, // 收縮壓
  diastolic: secondary, // 舒張壓
  pulse: heartRate, // 心率
};

// 圖表設定
const chartConfig = {
  spacing: 45, // 數據點間距
  initialSpacing: 45, // 初始間距
  thickness: 3, // 線條粗細
  dataPointsRadius: 5, // 數據點半徑
  curvature: 0.25, // 曲線平滑度
  gridColor: GRID_COLOR, // 網格顏色
  axisColor: AXIS_COLOR, // 座標軸顏色
};
```

### 圖表類型

- LineChart：用於展示血壓趨勢
- BarChart：用於統計分析
- ScatterPlot：用於數據分布
- AreaChart：用於範圍展示

### 圖表交互

- 點擊數據點：顯示詳細資訊
- 縮放手勢：調整時間範圍
- 左右滑動：瀏覽歷史數據
- 雙指縮放：調整視圖範圍

## 10. 無障礙支援

### 顏色對比度

- 確保所有文字顏色與背景的對比度符合 WCAG 2.1 標準
- 提供高對比度模式
- 使用圖形配合顏色傳達信息

### 操作支援

- 支援 VoiceOver 和 TalkBack
- 提供鍵盤導航
- 觸控目標最小尺寸：44x44pt
- 提供清晰的操作反饋

## 11. 效能優化

### 動畫效能

- 使用 React Native Reanimated
- 優化圖表渲染
- 減少不必要的重繪
- 使用記憶體緩存

### 載入優化

- 實作骨架屏
- 優化圖片載入
- 實作數據預載
- 支援離線模式

以上設計規範將確保應用程序具有一致的視覺風格和良好的用戶體驗。在實施過程中，應當嚴格遵循這些規範，確保產品質量。
