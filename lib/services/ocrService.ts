/**
 * @file ocrService.ts
 * @author FirstFu
 * @date 2024-03-21
 * @module Services/OCR
 * @description 血壓計圖像識別服務
 * 提供血壓計顯示屏圖像的OCR識別功能：
 * 1. 識別收縮壓數值
 * 2. 識別舒張壓數值
 * 3. 識別心率數值
 *
 * @dependencies
 * - react-native: 平台判斷
 * - 待集成的OCR API服務
 */

import { Platform } from "react-native";

/**
 * OCR識別結果接口
 * @interface OCRResult
 * @property {number | null} systolic - 收縮壓數值
 * @property {number | null} diastolic - 舒張壓數值
 * @property {number | null} heartRate - 心率數值
 * @property {number} confidence - 識別結果的置信度（0-1）
 * @property {string} [error] - 錯誤信息（可選）
 */
export interface OCRResult {
  systolic: number | null;
  diastolic: number | null;
  heartRate: number | null;
  confidence: number;
  error?: string;
}

/**
 * OCR服務類
 * @class OCRService
 * @description
 * 使用單例模式實現的OCR服務類，
 * 負責處理血壓計圖像的文字識別。
 * 目前使用模擬數據，後續將接入實際的OCR API。
 */
export class OCRService {
  private static instance: OCRService;
  private apiKey: string = ""; // TODO: 替換為實際的 API Key

  private constructor() {}

  /**
   * 獲取OCR服務實例
   * @returns OCRService實例
   */
  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * 處理圖像
   * @param imageBase64 - Base64編碼的圖像數據
   * @returns Promise<OCRResult> - OCR識別結果
   * @throws {Error} 處理失敗時拋出錯誤
   * @description
   * 1. 驗證圖像數據
   * 2. 調用OCR API進行識別
   * 3. 解析並返回識別結果
   */
  public async processImage(imageBase64: string): Promise<OCRResult> {
    try {
      // TODO: 實作實際的 OCR API 調用
      // 這裡使用 Google Cloud Vision API 或其他 OCR 服務

      // 模擬 API 調用
      return await this.mockOCRProcess(imageBase64);
    } catch (error) {
      console.error("OCR 處理錯誤:", error);
      return {
        systolic: null,
        diastolic: null,
        heartRate: null,
        confidence: 0,
        error: "圖片處理失敗，請重試",
      };
    }
  }

  /**
   * 模擬OCR處理過程
   * @param imageBase64 - Base64編碼的圖像數據
   * @returns Promise<OCRResult> - 模擬的OCR識別結果
   * @description
   * 開發階段使用的模擬數據：
   * - 收縮壓：120 mmHg
   * - 舒張壓：80 mmHg
   * - 心率：75 次/分
   * - 置信度：0.95
   */
  private async mockOCRProcess(imageBase64: string): Promise<OCRResult> {
    // 模擬處理延遲
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模擬辨識結果
    return {
      systolic: 120,
      diastolic: 80,
      heartRate: 75,
      confidence: 0.95,
    };
  }

  /**
   * 設置API密鑰
   * @param key - API密鑰
   */
  public setApiKey(key: string) {
    this.apiKey = key;
  }
}

/**
 * OCR服務實例
 * 全局單例，用於處理圖像識別
 */
export const ocrService = OCRService.getInstance();
