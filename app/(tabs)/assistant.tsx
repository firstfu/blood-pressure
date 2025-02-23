/**
 * @file assistant.tsx
 * @author FirstFu
 * @date 2024-03-21
 * @module Screens/Assistant
 * @description AI 助手頁面
 * 提供智能健康諮詢和建議功能：
 * 1. 血壓相關知識諮詢
 * 2. 健康生活建議
 * 3. 智能數據分析
 * 4. 個人化建議
 */

import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, TextInput, Platform, KeyboardAvoidingView, Animated, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef, useEffect } from "react";
import { MotiView } from "moti";
import { Colors } from "../../constants/Colors";
import { Typography } from "../../constants/Typography";
import { StatusBar } from "expo-status-bar";

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
};

type Suggestion = {
  id: string;
  icon: "heartbeat" | "cutlery" | "question-circle" | "bed";
  title: string;
  color: string;
};

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "您好！我是您的健康助手。我可以為您解答血壓相關的問題，並提供專業的健康建議。",
      timestamp: "09:00",
    },
    {
      id: "2",
      type: "user",
      content: "我的血壓偏高，有什麼建議嗎？",
      timestamp: "09:01",
    },
    {
      id: "3",
      type: "assistant",
      content: "根據您的情況，我建議：\n1. 控制鹽分攝入\n2. 規律運動\n3. 保持良好的作息\n4. 避免壓力\n\n需要更詳細的建議嗎？",
      timestamp: "09:01",
    },
  ]);

  const [suggestions] = useState<Suggestion[]>([
    {
      id: "1",
      icon: "heartbeat",
      title: "血壓知識",
      color: Colors.light.primary,
    },
    {
      id: "2",
      icon: "cutlery",
      title: "飲食建議",
      color: Colors.light.secondary,
    },
    {
      id: "3",
      icon: "question-circle",
      title: "運動建議",
      color: Colors.light.success,
    },
    {
      id: "4",
      icon: "bed",
      title: "生活作息",
      color: Colors.light.warning,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const addMessage = (content: string, type: "user" | "assistant") => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      type,
      content,
      timestamp: getCurrentTime(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getAssistantResponse = (suggestionTitle: string) => {
    switch (suggestionTitle) {
      case "血壓知識":
        return "血壓是衡量心臟健康的重要指標。正常血壓範圍是收縮壓<120mmHg，舒張壓<80mmHg。\n\n以下是一些重要知識：\n1. 高血壓定義：≥140/90 mmHg\n2. 正常偏高：120-139/80-89 mmHg\n3. 理想血壓：<120/80 mmHg\n\n需要了解更多特定範圍的詳細資訊嗎？";
      case "飲食建議":
        return "針對血壓控制，以下是重要的飲食建議：\n\n1. 減少鹽分攝入：每日不超過6克\n2. 增加鉀的攝入：香蕉、菠菜等\n3. 限制酒精攝入\n4. 適量攝入深海魚類\n5. 多吃全穀物和蔬果\n\n想了解更具體的飲食計劃嗎？";
      case "運動建議":
        return "適當運動對控制血壓非常有幫助：\n\n1. 建議運動種類：\n- 快走\n- 游泳\n- 騎自行車\n- 太極拳\n\n2. 運動原則：\n- 每週3-5次\n- 每次30-60分鐘\n- 中等強度\n\n需要更詳細的運動計劃建議嗎？";
      case "生活作息":
        return "良好的生活作息對血壓控制至關重要：\n\n1. 睡眠建議：\n- 每晚7-8小時\n- 固定作息時間\n- 睡前避免使用電子產品\n\n2. 壓力管理：\n- 練習深呼吸\n- 冥想放鬆\n- 保持正向心態\n\n想了解更多改善作息的方法嗎？";
      default:
        return "抱歉，我沒有理解您的問題。請問您想了解哪方面的資訊？";
    }
  };

  const animateSendButton = () => {
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSuggestionPress = (suggestion: Suggestion) => {
    Animated.sequence([
      Animated.timing(new Animated.Value(1), {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(new Animated.Value(0.95), {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    addMessage(`請告訴我關於${suggestion.title}的資訊`, "user");

    setTimeout(() => {
      addMessage(getAssistantResponse(suggestion.title), "assistant");
    }, 500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    animateSendButton();

    addMessage(inputText.trim(), "user");
    setInputText("");

    setTimeout(() => {
      addMessage("我已經收到您的問題，讓我思考一下如何回答...", "assistant");
    }, 500);
  };

  const handleHelpPress = () => {
    Alert.alert(
      "AI 助手使用說明",
      "歡迎使用 AI 助手！\n\n" +
        "1. 快速提問：\n   點擊上方卡片可快速獲取相關建議\n\n" +
        "2. 自由提問：\n   在下方輸入框輸入任何血壓相關問題\n\n" +
        "3. 專業建議：\n   AI 助手會根據您的問題提供專業的健康建議\n\n" +
        "4. 隨時查看：\n   您可以隨時回顧歷史對話記錄",
      [
        {
          text: "我知道了",
          style: "default",
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar style="light" />

      {/* 頂部導航區域 */}
      <LinearGradient colors={[Colors.light.primary, Colors.light.primary]} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>AI 助手</Text>
              <Text style={styles.headerSubtitle}>智能健康諮詢</Text>
            </View>
            <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]} onPress={handleHelpPress}>
              <FontAwesome5 name="question-circle" size={20} color="#fff" />
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* 主要內容區 */}
      <View style={styles.mainContent}>
        {/* 快速提問建議 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer} contentContainerStyle={styles.suggestionsContent}>
          {suggestions.map(suggestion => (
            <Pressable
              key={suggestion.id}
              style={({ pressed }) => [styles.suggestionButton, pressed && styles.suggestionButtonPressed]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <View style={[styles.suggestionIcon, { backgroundColor: suggestion.color }]}>
                <FontAwesome5 name={suggestion.icon} size={20} color="#fff" />
              </View>
              <Text style={styles.suggestionText}>{suggestion.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* 對話區域 */}
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(message => (
            <MotiView
              key={message.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 300 }}
              style={[styles.messageContainer, message.type === "user" ? styles.userMessage : styles.assistantMessage]}
            >
              {message.type === "assistant" && (
                <View style={styles.assistantAvatar}>
                  <FontAwesome5 name="user-md" size={18} color="#fff" />
                </View>
              )}
              <View style={[styles.messageBubble, message.type === "user" ? styles.userBubble : styles.assistantBubble]}>
                <Text style={[styles.messageText, message.type === "user" && styles.userMessageText]}>{message.content}</Text>
                <Text style={[styles.messageTime, message.type === "user" && styles.userMessageTime]}>{message.timestamp}</Text>
              </View>
            </MotiView>
          ))}
        </ScrollView>

        {/* 輸入區域 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="輸入您的問題..."
            placeholderTextColor={Colors.light.textSecondary}
            multiline
            maxLength={500}
            value={inputText}
            onChangeText={setInputText}
          />
          <Animated.View style={[styles.sendButton, { transform: [{ scale: sendButtonScale }] }]}>
            <Pressable onPress={handleSendMessage} style={({ pressed }) => pressed && styles.sendButtonPressed}>
              <LinearGradient colors={[Colors.light.primary, Colors.light.primary]} style={styles.sendButtonGradient}>
                <FontAwesome5 name="paper-plane" size={16} color="#fff" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerGradient: {
    width: "100%",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.bold,
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.size.small,
    color: "rgba(255,255,255,0.9)",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPressed: {
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  suggestionsContainer: {
    maxHeight: 100,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  suggestionButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 90,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: Typography.size.small,
    color: Colors.light.text,
    fontWeight: Typography.weight.medium,
    textAlign: "center",
    paddingHorizontal: 2,
    lineHeight: Typography.lineHeight.tight * Typography.size.small,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  assistantMessage: {
    justifyContent: "flex-start",
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: Typography.size.regular,
    color: Colors.light.text,
    lineHeight: Typography.lineHeight.normal * Typography.size.regular,
  },
  userMessageText: {
    color: "#fff",
  },
  messageTime: {
    fontSize: Typography.size.caption,
    color: Colors.light.textSecondary,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: Typography.size.regular,
    color: Colors.light.text,
  },
  sendButton: {
    width: 40,
    height: 40,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
