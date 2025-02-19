import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { BloodPressureRecord } from "../types/bloodPressure";

// 生成 CSV 內容
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

// 生成 PDF 內容
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

// 導出為 CSV
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

// 導出為 PDF
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
