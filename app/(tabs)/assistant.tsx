import { StyleSheet, View, Text, SafeAreaView, ScrollView, Pressable, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

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
  const [messages] = useState<Message[]>([
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* 頂部區域 */}
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.headerGradient}>
          <SafeAreaView>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>AI 助手</Text>
              <Pressable style={styles.iconButton}>
                <FontAwesome name="question-circle" size={18} color="#fff" />
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
            <Pressable key={suggestion.id} style={styles.suggestionButton}>
              <View style={[styles.suggestionIcon, { backgroundColor: `${suggestion.color}20` }]}>
                <FontAwesome name={suggestion.icon} size={16} color={suggestion.color} />
              </View>
              <Text style={styles.suggestionText}>{suggestion.title}</Text>
            </Pressable>
          ))}
        </View>

        {/* 對話區域 */}
        <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
          {messages.map(message => (
            <View key={message.id} style={[styles.messageContainer, message.type === "user" ? styles.userMessage : styles.assistantMessage]}>
              {message.type === "assistant" && (
                <View style={styles.assistantAvatar}>
                  <FontAwesome name="user-md" size={16} color="#fff" />
                </View>
              )}
              <View style={[styles.messageBubble, message.type === "user" ? styles.userBubble : styles.assistantBubble]}>
                <Text style={[styles.messageText, message.type === "user" && styles.userMessageText]}>{message.content}</Text>
                <Text style={[styles.messageTime, message.type === "user" && styles.userMessageTime]}>{message.timestamp}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 輸入區域 */}
        <View style={styles.inputContainer}>
          <Pressable style={styles.inputButton}>
            <FontAwesome name="image" size={20} color="#8e8e93" />
          </Pressable>
          <TextInput style={styles.input} placeholder="輸入您的問題..." placeholderTextColor="#8e8e93" multiline />
          <Pressable style={styles.sendButton}>
            <LinearGradient colors={["#2d87ff", "#1a6cd4"]} start={[0, 0]} end={[1, 1]} style={styles.sendButtonGradient}>
              <FontAwesome name="send" size={16} color="#fff" />
            </LinearGradient>
          </Pressable>
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
  },
  headerGradient: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: Platform.OS === "android" ? 56 : 44,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  suggestionButton: {
    alignItems: "center",
    gap: 4,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionText: {
    fontSize: 12,
    color: "#1c1c1e",
    fontWeight: "500",
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 16,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2d87ff",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    backgroundColor: "#2d87ff",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: "#1c1c1e",
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
  },
  messageTime: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.8)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  inputButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(142,142,147,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 32,
    maxHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(142,142,147,0.1)",
    borderRadius: 16,
    fontSize: 15,
    color: "#1c1c1e",
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
