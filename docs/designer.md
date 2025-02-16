# 血壓追蹤應用程序 UI/UX 設計規範

## 1. 品牌識別

### 品牌色彩系統

```scss
// 主要色彩
$primary-blue: #2d87ff; // 主色調，代表專業醫療
$success-green: #34c759; // 健康狀態良好
$warning-yellow: #ffd60a; // 需要注意
$danger-red: #ff3b30; // 需要警惕

// 中性色彩
$background: #f5f7fa; // 背景色
$text-primary: #1c1c1e; // 主要文字
$text-secondary: #8e8e93; // 次要文字
$border: #e5e5ea; // 邊框
$divider: #c6c6c8; // 分隔線

// 狀態色彩
$active: rgba(45, 135, 255, 0.1); // 激活狀態
$hover: rgba(45, 135, 255, 0.05); // 懸浮狀態
$disabled: rgba(142, 142, 147, 0.1); // 禁用狀態
```

### 字體系統

```scss
// 字體家族
$font-family-display: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
$font-family-text: "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;

// 字體大小
$font-size-h1: 24px; // 大標題
$font-size-h2: 20px; // 標題
$font-size-h3: 17px; // 副標題
$font-size-body: 15px; // 正文
$font-size-caption: 13px; // 說明文字

// 字體粗細
$font-weight-bold: 600;
$font-weight-medium: 500;
$font-weight-regular: 400;
```

### 間距系統

```scss
// 基礎間距單位
$spacing-unit: 8px;

// 常用間距
$spacing-xs: $spacing-unit; // 8px
$spacing-sm: $spacing-unit * 2; // 16px
$spacing-md: $spacing-unit * 3; // 24px
$spacing-lg: $spacing-unit * 4; // 32px
$spacing-xl: $spacing-unit * 5; // 40px
```

## 2. 組件設計

### 按鈕設計

```scss
.button {
  // 主要按鈕
  &--primary {
    background-color: $primary-blue;
    color: white;
    border-radius: 12px;
    padding: $spacing-sm $spacing-md;
  }

  // 次要按鈕
  &--secondary {
    background-color: white;
    color: $primary-blue;
    border: 1px solid $primary-blue;
  }

  // 警告按鈕
  &--warning {
    background-color: $warning-yellow;
  }

  // 危險按鈕
  &--danger {
    background-color: $danger-red;
  }
}
```

### 卡片設計

```scss
.card {
  background: white;
  border-radius: 16px;
  padding: $spacing-md;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &__header {
    margin-bottom: $spacing-sm;
  }

  &__content {
    margin-bottom: $spacing-md;
  }

  &__footer {
    border-top: 1px solid $divider;
    padding-top: $spacing-sm;
  }
}
```

### 表單元素

```scss
.input {
  border: 1px solid $border;
  border-radius: 8px;
  padding: $spacing-sm;
  font-size: $font-size-body;

  &:focus {
    border-color: $primary-blue;
    box-shadow: 0 0 0 2px rgba($primary-blue, 0.1);
  }
}

.label {
  font-size: $font-size-caption;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}
```

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
  border-top-color: $primary-blue;
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

### 圖表風格

```scss
// 圖表顏色
$chart-colors: (
  "systolic": #ff6b6b,
  "diastolic": #4ecdc4,
  "pulse": #45b7d1,
);

// 圖表配置
$chart-config: (
  "line-width": 2px,
  "point-radius": 4px,
  "grid-color": rgba(0, 0, 0, 0.1),
  "axis-color": rgba(0, 0, 0, 0.2),
);
```

### 圖表類型

- 折線圖：展示趨勢
- 柱狀圖：數據對比
- 散點圖：數據分布
- 區域圖：範圍展示

以上設計規範將確保應用程序具有一致的視覺風格和良好的用戶體驗。在實施過程中，應當嚴格遵循這些規範，確保產品質量。
