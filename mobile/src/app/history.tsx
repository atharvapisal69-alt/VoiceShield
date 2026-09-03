import { Screen, SectionTitle } from "@/components/screen";
import { Colors } from "@/constants/theme";
import type { AnalysisHistoryItem } from "@/types/analysis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
export default function History() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("voiceshield.history").then((value) =>
      setItems(value ? JSON.parse(value) : []),
    );
  }, []);
  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.fileName.toLowerCase().includes(query.toLowerCase()) ||
          item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );
  const deleteItem = async (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    await AsyncStorage.setItem("voiceshield.history", JSON.stringify(next));
  };
  const clearHistory = () =>
    Alert.alert(
      "Clear history?",
      "This removes all saved analysis results from this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setItems([]);
            await AsyncStorage.removeItem("voiceshield.history");
          },
        },
      ],
    );
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
      {items.length > 0 && (
        <View style={styles.tools}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search analyses"
            placeholderTextColor={Colors.muted}
            style={styles.search}
          />
          <Pressable onPress={clearHistory}>
            <Text style={styles.clear}>Clear all</Text>
          </Pressable>
        </View>
      )}
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
      ) : filteredItems.length === 0 ? (
        <Text style={styles.noResults}>No matching analyses.</Text>
      ) : (
        filteredItems.map((item) => (
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
            <Pressable onPress={() => deleteItem(item.id)} hitSlop={10}>
              <Text style={styles.delete}>×</Text>
            </Pressable>
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
  tools: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 22,
    marginBottom: 8,
  },
  search: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
    color: Colors.text,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  clear: { color: Colors.red, fontSize: 12, fontWeight: "800" },
  delete: { color: Colors.red, fontSize: 22, lineHeight: 22, paddingLeft: 5 },
  noResults: { color: Colors.muted, textAlign: "center", paddingVertical: 32 },
});
