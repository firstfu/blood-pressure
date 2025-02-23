/**
 * 應用程序的排版系統
 * @file: Typography.ts
 * @description: 定義應用程序的字體大小、字重和行高
 * @author: FirstFu
 * @date: 2024-03-21
 */

export const Typography = {
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
} as const;
