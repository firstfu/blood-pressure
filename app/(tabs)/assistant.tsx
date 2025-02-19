import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, TextInput, Platform, KeyboardAvoidingView, Animated, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef, useEffect } from "react";
import { MotiView } from "moti";

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
      color: "#ff6b6b",
    },
    {
      id: "2",
      icon: "cutlery",
      title: "飲食建議",
      color: "#4ecdc4",
    },
    {
      id: "3",
      icon: "question-circle",
      title: "運動建議",
      color: "#45b7d1",
    },
    {
      id: "4",
      icon: "bed",
      title: "生活作息",
      color: "#96c",
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
      {/* 頂部區域 */}
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.headerGradient}>
          <SafeAreaView>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>AI 助手</Text>
              <Pressable style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]} onPress={handleHelpPress}>
                <FontAwesome name="question-circle" size={20} color="#fff" />
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* 主要內容區 */}
      <View style={styles.mainContent}>
        {/* 快速提問建議 */}
        <View style={styles.suggestionsContainer}>
          {suggestions.map(suggestion => (
            <Pressable
              key={suggestion.id}
              style={({ pressed }) => [styles.suggestionButton, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <View style={[styles.suggestionIcon, { backgroundColor: `${suggestion.color}20` }]}>
                <FontAwesome name={suggestion.icon} size={20} color={suggestion.color} />
              </View>
              <Text style={styles.suggestionText}>{suggestion.title}</Text>
            </Pressable>
          ))}
        </View>

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
                  <FontAwesome name="user-md" size={18} color="#fff" />
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
          <Pressable style={({ pressed }) => [styles.inputButton, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}>
            <FontAwesome name="image" size={20} color="#8e8e93" />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="輸入您的問題..."
            placeholderTextColor="#8e8e93"
            multiline
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
          />
          <Animated.View style={[styles.sendButton, { transform: [{ scale: sendButtonScale }] }]}>
            <Pressable onPress={handleSendMessage}>
              <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.sendButtonGradient}>
                <FontAwesome name="send" size={16} color="#fff" />
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
    backgroundColor: "#f5f7fa",
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#2d87ff",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  headerGradient: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: Platform.OS === "android" ? 64 : 56,
    paddingTop: Platform.OS === "android" ? 12 : 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  suggestionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  suggestionButton: {
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 12,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionText: {
    fontSize: 13,
    color: "#1c1c1e",
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 20,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  assistantMessage: {
    justifyContent: "flex-start",
  },
  assistantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2d87ff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#2d87ff",
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 15,
    color: "#1c1c1e",
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  messageTime: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 6,
    alignSelf: "flex-end",
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.8)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    padding: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(142,142,147,0.08)",
    borderRadius: 21,
    fontSize: 15,
    color: "#1c1c1e",
    lineHeight: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
