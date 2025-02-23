/**
 * 血壓監測應用程序的顏色系統
 * @file: Colors.ts
 * @description: 定義應用程序的顏色主題，包括淺色和深色模式
 * @author: FirstFu
 * @date: 2024-03-21
 */

// 主要色彩
const primary = "#2B7DE9"; // 主色調：沉穩的藍色
const secondary = "#5C9CE6"; // 次要色調：較淺的藍色
const success = "#4CAF50"; // 成功狀態：綠色
const warning = "#FFA726"; // 警告狀態：橙色
const danger = "#EF5350"; // 危險狀態：紅色

// 中性色彩
const background = "#F8F9FA"; // 背景色：淺灰色
const textPrimary = "#2C3E50"; // 主要文字：深灰色
const textSecondary = "#7F8C8D"; // 次要文字：中灰色
const border = "#E0E6ED"; // 邊框色：淺灰色
const divider = "#E0E6ED"; // 分隔線：淺灰色

// 血壓數值專用色彩（統一使用主色系）
const systolic = primary; // 收縮壓：主色調
const diastolic = secondary; // 舒張壓：次要色調
const heartRate = "#5C9CE6"; // 心率：次要色調

// 圖表色彩（保持一致性）
const chartSystolic = systolic;
const chartDiastolic = diastolic;
const chartPulse = heartRate;

// 深色模式調整
const darkPrimary = "#3498DB"; // 深色主色調
const darkSecondary = "#5DADE2"; // 深色次要色調
const darkSuccess = "#66BB6A"; // 深色成功狀態
const darkWarning = "#FFB74D"; // 深色警告狀態
const darkDanger = "#EF5350"; // 深色危險狀態
const darkBackground = "#1A1A1A"; // 深色背景
const darkTextPrimary = "#FFFFFF"; // 深色主要文字
const darkTextSecondary = "#B0B3B8"; // 深色次要文字
const darkBorder = "#2C3E50"; // 深色邊框
const darkDivider = "#2C3E50"; // 深色分隔線

// 漸層色彩（簡化為單一色系）
const gradients = {
  primary: ["#2B7DE9", "#5C9CE6"], // 主色系漸層
  secondary: ["#5C9CE6", "#7FB3F0"], // 次要色系漸層
  success: ["#4CAF50", "#66BB6A"], // 成功狀態漸層
  warning: ["#FFA726", "#FFB74D"], // 警告狀態漸層
  danger: ["#EF5350", "#E57373"], // 危險狀態漸層
};

export const Colors = {
  light: {
    // 主要色彩
    primary,
    secondary,
    success,
    warning,
    danger,

    // 中性色彩
    text: textPrimary,
    textSecondary,
    background,
    border,
    divider,

    // 血壓數值專用色彩
    systolic,
    diastolic,
    heartRate,

    // 圖表色彩
    chartSystolic,
    chartDiastolic,
    chartPulse,

    // 漸層色彩
    gradients,

    // 狀態色彩
    active: `${primary}1A`, // 10% opacity
    hover: `${primary}0D`, // 5% opacity
    disabled: `${textSecondary}1A`, // 10% opacity

    // 遺留支持
    tint: primary,
    icon: textSecondary,
    tabIconDefault: textSecondary,
    tabIconSelected: primary,
  },
  dark: {
    // 主要色彩
    primary: darkPrimary,
    secondary: darkSecondary,
    success: darkSuccess,
    warning: darkWarning,
    danger: darkDanger,

    // 中性色彩
    text: darkTextPrimary,
    textSecondary: darkTextSecondary,
    background: darkBackground,
    border: darkBorder,
    divider: darkDivider,

    // 血壓數值專用色彩
    systolic: darkPrimary,
    diastolic: darkSecondary,
    heartRate: darkSuccess,

    // 圖表色彩
    chartSystolic: darkPrimary,
    chartDiastolic: darkSecondary,
    chartPulse: darkSuccess,

    // 漸層色彩
    gradients: {
      primary: ["#5B9FE8", "#4A90E2"],
      secondary: ["#FFB746", "#F5A623"],
      success: ["#2ECC71", "#27AE60"],
      warning: ["#FFB746", "#F5A623"],
      danger: ["#FF6B6B", "#EB5757"],
    },

    // 狀態色彩
    active: `${darkPrimary}1A`,
    hover: `${darkPrimary}0D`,
    disabled: `${darkTextSecondary}1A`,

    // 遺留支持
    tint: darkPrimary,
    icon: darkTextSecondary,
    tabIconDefault: darkTextSecondary,
    tabIconSelected: darkPrimary,
  },
} as const;
