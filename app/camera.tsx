import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Camera } from "expo-camera";
import type { CameraCapturedPicture } from "expo-camera";
import { useState, useRef, useEffect, ComponentType } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ocrService } from "../lib/services/ocrService";

type CameraInstance = ComponentType<any> & {
  requestCameraPermissionsAsync: () => Promise<{ status: string }>;
  takePictureAsync: (options?: { quality?: number; base64?: boolean }) => Promise<CameraCapturedPicture>;
};

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<"front" | "back">("back");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraInstance | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted" && mediaStatus.status === "granted");
    })();
  }, []);

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
      });

      // 處理圖片
      const manipResult = await manipulateAsync(photo.uri, [{ resize: { width: 1080 } }], { compress: 0.8, format: SaveFormat.JPEG, base64: true });

      setCapturedImage(manipResult.uri);

      // 使用 OCR 服務處理圖片
      const result = await ocrService.processImage(manipResult.base64 || "");

      if (result.error) {
        Alert.alert("錯誤", result.error);
        return;
      }

      if (result.confidence < 0.7) {
        Alert.alert("警告", "辨識結果可信度較低，請重新拍攝");
        return;
      }

      Alert.alert("辨識結果", `收縮壓: ${result.systolic}\n舒張壓: ${result.diastolic}\n心率: ${result.heartRate}\n可信度: ${Math.round(result.confidence * 100)}%`, [
        {
          text: "重新拍攝",
          style: "cancel",
          onPress: () => {
            setCapturedImage(null);
            setIsProcessing(false);
          },
        },
        {
          text: "確認",
          onPress: () => {
            // TODO: 儲存血壓數據
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("拍照錯誤:", error);
      Alert.alert("錯誤", "拍照時發生錯誤，請重試");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === "back" ? "front" : "back"));
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>需要相機權限才能使用此功能</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <Camera ref={cameraRef} style={styles.camera} type={type} onCameraReady={handleCameraReady}>
        <View style={styles.overlay}>
          {/* 頂部工具列 */}
          <BlurView intensity={30} tint="dark" style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>拍照識別</Text>
            <TouchableOpacity style={styles.switchButton} onPress={toggleCameraType}>
              <FontAwesome5 name="sync" size={20} color="#fff" />
            </TouchableOpacity>
          </BlurView>

          {/* 取景框 */}
          <View style={styles.frameMask}>
            <View style={styles.frame}>
              {isProcessing && (
                <BlurView intensity={50} tint="dark" style={styles.processingOverlay}>
                  <FontAwesome5 name="spinner" size={40} color="#fff" />
                  <Text style={styles.processingText}>正在識別...</Text>
                </BlurView>
              )}
            </View>
          </View>

          {/* 底部工具列 */}
          <BlurView intensity={30} tint="dark" style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.captureButton, (!isCameraReady || isProcessing) && styles.buttonDisabled]}
              onPress={takePicture}
              disabled={!isCameraReady || isProcessing}
            >
              <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.captureButtonInner} />
            </TouchableOpacity>
          </BlurView>
        </View>
      </Camera>
    </View>
  );
}

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
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  switchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  frameMask: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  processingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 4,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 36,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
