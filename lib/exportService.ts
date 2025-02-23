/**
 * @file exportService.ts
 * @author FirstFu
 * @date 2024-03-21
 * @module Services/Export
 * @description 血壓數據導出服務
 * 提供將血壓記錄導出為不同格式的功能：
 * 1. CSV格式導出
 * 2. PDF格式導出
 *
 * @dependencies
 * - expo-file-system: 文件系統操作
 * - expo-sharing: 文件分享功能
 * - types/bloodPressure.ts: 血壓相關類型定義
 */

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { BloodPressureRecord } from "../types/bloodPressure";

/**
 * 生成CSV格式的內容
 * @param records - 血壓記錄數組
 * @returns CSV格式的字符串
 * @description
 * 生成的CSV包含以下列：
 * - 日期：記錄的時間戳（本地時間格式）
 * - 收縮壓：mmHg
 * - 舒張壓：mmHg
 * - 心率：次/分
 * - 備註：可選的記錄備註
 */
const generateCSVContent = (records: BloodPressureRecord[]): string => {
  const header = "日期,收縮壓,舒張壓,心率,備註\n";
  const rows = records
    .map(record => {
      const date = new Date(record.timestamp).toLocaleString();
      return `${date},${record.systolic},${record.diastolic},${record.heartRate},"${record.note || ""}"\n`;
    })
    .join("");
  return header + rows;
};

/**
 * 生成PDF格式的內容
 * @param records - 血壓記錄數組
 * @returns HTML格式的字符串（用於生成PDF）
 * @description
 * 生成帶有樣式的HTML表格，包含：
 * - 響應式表格布局
 * - 自定義表格樣式
 * - 主題顏色：#7F3DFF
 * - 數據列：日期、收縮壓、舒張壓、心率、備註
 */
const generatePDFContent = (records: BloodPressureRecord[]): string => {
  const rows = records
    .map(record => {
      const date = new Date(record.timestamp).toLocaleString();
      return `
      <tr>
        <td>${date}</td>
        <td>${record.systolic}</td>
        <td>${record.diastolic}</td>
        <td>${record.heartRate}</td>
        <td>${record.note || ""}</td>
      </tr>
    `;
    })
    .join("");

  return `
    <html>
      <head>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #7F3DFF; color: white; }
        </style>
      </head>
      <body>
        <h1>血壓記錄報告</h1>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>收縮壓</th>
              <th>舒張壓</th>
              <th>心率</th>
              <th>備註</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

/**
 * 導出血壓記錄為CSV文件
 * @param records - 血壓記錄數組
 * @returns Promise<void>
 * @throws {Error} 導出失敗時拋出錯誤
 * @description
 * 1. 生成CSV內容
 * 2. 寫入臨時文件
 * 3. 使用系統分享功能分享文件
 */
export const exportToCSV = async (records: BloodPressureRecord[]): Promise<void> => {
  try {
    const csvContent = generateCSVContent(records);
    const fileName = `bloodpressure_${new Date().toISOString().split("T")[0]}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/csv",
        dialogTitle: "導出血壓記錄",
        UTI: "public.comma-separated-values-text",
      });
    }
  } catch (error) {
    console.error("CSV 導出錯誤:", error);
    throw new Error("導出 CSV 失敗");
  }
};

/**
 * 導出血壓記錄為PDF文件
 * @param records - 血壓記錄數組
 * @returns Promise<void>
 * @throws {Error} 導出失敗時拋出錯誤
 * @description
 * 1. 生成HTML內容
 * 2. 寫入臨時文件
 * 3. 使用系統分享功能分享文件
 * 注意：目前直接分享HTML內容，後續可考慮使用PDF生成庫
 */
export const exportToPDF = async (records: BloodPressureRecord[]): Promise<void> => {
  try {
    const htmlContent = generatePDFContent(records);
    const fileName = `bloodpressure_${new Date().toISOString().split("T")[0]}.pdf`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    const options = {
      html: htmlContent,
      fileName: fileName,
      directory: "Documents",
    };

    // 使用 expo-file-system 直接寫入 HTML 內容
    await FileSystem.writeAsStringAsync(filePath, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/pdf",
        dialogTitle: "導出血壓記錄",
        UTI: "com.adobe.pdf",
      });
    }
  } catch (error) {
    console.error("PDF 導出錯誤:", error);
    throw new Error("導出 PDF 失敗");
  }
};
