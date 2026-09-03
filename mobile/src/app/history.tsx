import { Screen, SectionTitle } from "@/components/screen";
import { Colors } from "@/constants/theme";
import type { AnalysisHistoryItem } from "@/types/analysis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
export default function History() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  useEffect(() => {
    AsyncStorage.getItem("voiceshield.history").then((value) =>
      setItems(value ? JSON.parse(value) : []),
    );
  }, []);
  return (
    <Screen>
      <Text
        style={styles.back}
        onPress={() => router.replace("/home" as never)}
      >
        Home
      </Text>
      <SectionTitle eyebrow="YOUR ACTIVITY" title="Analysis history" />
      <Text style={styles.copy}>
        A private record of the voices you have checked on this device.
      </Text>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nothing scanned yet</Text>
          <Text style={styles.copy}>
            Run your first voice check to see results here.
          </Text>
          <Pressable onPress={() => router.push("/home" as never)}>
            <Text style={styles.link}>Start a scan</Text>
          </Pressable>
        </View>
      ) : (
        items.map((item) => (
          <Pressable
            key={item.id}
            style={styles.item}
            onPress={() =>
              router.push({ pathname: "/result", params: item } as never)
            }
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: item.label.includes("HIGH")
                    ? Colors.red
                    : item.label.includes("MEDIUM")
                      ? Colors.orange
                      : Colors.green,
                },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.fileName}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.label}>{item.label.replace(" RISK", "")}</Text>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { color: Colors.muted, marginTop: 12, marginBottom: 38 },
  copy: { color: Colors.muted, lineHeight: 22, marginTop: 10 },
  empty: {
    backgroundColor: Colors.panel,
    alignItems: "center",
    padding: 28,
    borderRadius: 18,
    marginTop: 34,
  },
  emptyTitle: { color: Colors.text, fontWeight: "800", fontSize: 17 },
  link: { color: Colors.blue, fontWeight: "800", marginTop: 18 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 19,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { color: Colors.text, fontWeight: "700" },
  date: { color: Colors.muted, fontSize: 12, marginTop: 5 },
  label: {
    color: Colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
