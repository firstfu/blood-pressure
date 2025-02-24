/**
 * 檔案名稱：CameraView.tsx
 * 作者：AI Assistant
 * 修改日期：2024-02-23
 * 檔案描述：血壓計拍照識別的相機組件
 */

import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import { CameraView as ExpoCamera, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Props {
  onClose?: () => void;
  onRecognized?: (data: { systolic: number; diastolic: number; pulse?: number }) => void;
}

export const CameraView: React.FC<Props> = ({ onClose, onRecognized }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ExpoCamera>(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  const processImage = async (uri: string) => {
    try {
      // 圖片預處理：調整大小
      const processedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      // 執行 OCR
      const result = await TextRecognition.recognize(processedImage.uri);

      // 解析數字
      const numbers = result.text.match(/\d+/g)?.map(Number) || [];

      // 尋找合理範圍的血壓值
      const validNumbers = numbers.filter(n => n >= 40 && n <= 200);

      if (validNumbers.length >= 2) {
        // 假設最大的兩個數字是收縮壓和舒張壓
        const sorted = validNumbers.sort((a, b) => b - a);
        const systolic = sorted[0];
        const diastolic = sorted[1];

        // 如果找到第三個數字且在合理範圍內，可能是心率
        const pulse = validNumbers.length > 2 ? sorted[2] : undefined;

        if (systolic > diastolic) {
          onRecognized?.({ systolic, diastolic, pulse });
          return;
        }
      }

      throw new Error("無法識別有效的血壓數值");
    } catch (error) {
      console.error("OCR 處理失敗:", error);
      alert("無法識別數值，請重試或手動輸入");
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error("拍照失敗：無法取得照片");
      }

      await processImage(photo.uri);
    } catch (error) {
      console.error("拍照失敗:", error);
      alert("拍照失敗，請重試");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>需要相機權限才能使用此功能</Text>
        <Pressable onPress={requestPermission} style={styles.captureButton}>
          <Text style={styles.text}>授予權限</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCamera ref={cameraRef} style={styles.camera} facing="back" active={true}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.guide}>
            <View style={styles.guideFrame} />
            <Text style={styles.guideText}>將血壓計螢幕對準框框內</Text>
          </View>

          <View style={styles.controls}>
            <Pressable onPress={takePicture} disabled={isProcessing} style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}>
              {isProcessing ? <ActivityIndicator color="#fff" /> : <View style={styles.captureButtonInner} />}
            </Pressable>
          </View>
        </View>
      </ExpoCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  guide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  guideFrame: {
    width: 280,
    height: 120,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
  },
  guideText: {
    color: "#fff",
    fontSize: 15,
    marginTop: 20,
    textAlign: "center",
  },
  controls: {
    padding: 20,
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    margin: 20,
  },
});
