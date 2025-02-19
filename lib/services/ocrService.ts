import { Platform } from "react-native";

export interface OCRResult {
  systolic: number | null;
  diastolic: number | null;
  heartRate: number | null;
  confidence: number;
  error?: string;
}

export class OCRService {
  private static instance: OCRService;
  private apiKey: string = ""; // TODO: 替換為實際的 API Key

  private constructor() {}

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

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

  public setApiKey(key: string) {
    this.apiKey = key;
  }
}

export const ocrService = OCRService.getInstance();
