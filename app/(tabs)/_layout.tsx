import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { HapticTab } from "@/components/ui/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.1)",
          height: Platform.OS === "android" ? 64 : 84,
          paddingBottom: Platform.OS === "android" ? 12 : 28,
          paddingTop: 12,
        },
        tabBarActiveTintColor: "#2d87ff",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首頁",
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: "記錄",
          tabBarIcon: ({ color, size }) => <FontAwesome name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "統計",
          tabBarIcon: ({ color, size }) => <FontAwesome name="bar-chart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "AI助手",
          tabBarIcon: ({ color, size }) => <FontAwesome name="comment" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
