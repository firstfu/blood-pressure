import { StyleSheet, View, Text, ScrollView, Pressable, Platform, Share, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";

interface ShareOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export default function ShareScreen() {
  const handleShare = async (type: string) => {
    try {
      const message = `我的血壓數據分享\n\n收縮壓: 120 mmHg\n舒張壓: 80 mmHg\n心率: 75 bpm\n\n測量時間: ${new Date().toLocaleString()}`;
      const result = await Share.share({
        message,
        title: "血壓數據分享",
      });
    } catch (error) {
      Alert.alert("錯誤", "分享失敗，請稍後再試");
    }
  };

  const shareOptions: ShareOption[] = [
    {
      id: "report",
      title: "分享健康報告",
      description: "生成詳細的健康報告並分享",
      icon: "file-medical-alt",
      action: () => handleShare("report"),
    },
    {
      id: "doctor",
      title: "發送給醫生",
      description: "直接將數據發送給您的醫生",
      icon: "user-md",
      action: () => handleShare("doctor"),
    },
    {
      id: "family",
      title: "分享給家人",
      description: "與家人共享您的健康狀況",
      icon: "users",
      action: () => handleShare("family"),
    },
    {
      id: "export",
      title: "導出數據",
      description: "導出 PDF 或 Excel 格式的數據",
      icon: "file-export",
      action: () => handleShare("export"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 頂部標題區 */}
      <LinearGradient colors={["#7F3DFF", "#5D5FEF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>分享數據</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 數據概覽卡片 */}
        <MotiView style={styles.card} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
          <Text style={styles.cardTitle}>本月數據概覽</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>120/80</Text>
              <Text style={styles.statLabel}>平均血壓</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>75</Text>
              <Text style={styles.statLabel}>平均心率</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>測量次數</Text>
            </View>
          </View>
        </MotiView>

        {/* 分享選項 */}
        <MotiView style={styles.card} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500, delay: 200 }}>
          {shareOptions.map((option, index) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [styles.shareOption, pressed && styles.shareOptionPressed, index !== shareOptions.length - 1 && styles.shareOptionBorder]}
              onPress={option.action}
            >
              <View style={styles.shareOptionIcon}>
                <FontAwesome5 name={option.icon} size={20} color="#7F3DFF" />
              </View>
              <View style={styles.shareOptionContent}>
                <Text style={styles.shareOptionTitle}>{option.title}</Text>
                <Text style={styles.shareOptionDescription}>{option.description}</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#C7C7CC" />
            </Pressable>
          ))}
        </MotiView>

        {/* 隱私提示 */}
        <MotiView
          style={[styles.card, styles.privacyCard]}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 400 }}
        >
          <View style={styles.privacyHeader}>
            <FontAwesome5 name="shield-alt" size={20} color="#7F3DFF" />
            <Text style={styles.privacyTitle}>隱私保護</Text>
          </View>
          <Text style={styles.privacyText}>我們重視您的隱私。您的健康數據僅會在您授權的情況下進行分享，且所有數據都經過加密處理。</Text>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7F3DFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#8e8e93",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#f2f2f7",
  },
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  shareOptionPressed: {
    backgroundColor: "#f9f5ff",
  },
  shareOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  shareOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(127,61,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  shareOptionContent: {
    flex: 1,
  },
  shareOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 2,
  },
  shareOptionDescription: {
    fontSize: 14,
    color: "#8e8e93",
  },
  privacyCard: {
    backgroundColor: "rgba(127,61,255,0.05)",
  },
  privacyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7F3DFF",
    marginLeft: 8,
  },
  privacyText: {
    fontSize: 14,
    color: "#8e8e93",
    lineHeight: 20,
  },
});
