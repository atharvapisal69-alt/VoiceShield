import { Colors } from "@/constants/theme";
import { analyzeAudio } from "@/services/api";
import type { AnalysisHistoryItem } from "@/types/analysis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Analyzing() {
  const params = useLocalSearchParams<{
    uri: string;
    name?: string;
    mimeType?: string;
  }>();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const result = await analyzeAudio({
          uri: params.uri,
          name: params.name ?? "Audio recording",
          mimeType: params.mimeType,
        });
        const item: AnalysisHistoryItem = {
          ...result,
          id: Date.now().toString(),
          fileName: params.name ?? "Audio recording",
          createdAt: new Date().toISOString(),
        };
        const saved = await AsyncStorage.getItem("voiceshield.history");
        const history = saved
          ? (JSON.parse(saved) as AnalysisHistoryItem[])
          : [];
        await AsyncStorage.setItem(
          "voiceshield.history",
          JSON.stringify([item, ...history].slice(0, 20)),
        );
        if (active)
          router.replace({ pathname: "/result", params: item } as never);
      } catch {
        if (active)
          setError(
            "Analysis could not be completed. Check your connection and try again.",
          );
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [params.mimeType, params.name, params.uri]);
  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        <View style={styles.bar} />
        <View style={[styles.bar, styles.barTwo]} />
        <View style={[styles.bar, styles.barThree]} />
      </View>
      <Text style={styles.kicker}>VOICESHIELD ENGINE</Text>
      <Text style={styles.title}>
        {error ? "Something went wrong" : "Listening for signals"}
      </Text>
      <Text style={styles.copy}>
        {error ||
          "Comparing vocal patterns against known synthetic signatures."}
      </Text>
      {error && (
        <Text style={styles.back} onPress={() => router.back()}>
          Try again
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  loader: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 45,
  },
  bar: { width: 8, height: 36, borderRadius: 4, backgroundColor: Colors.blue },
  barTwo: { height: 70, backgroundColor: Colors.cyan },
  barThree: { height: 50, backgroundColor: Colors.purple },
  kicker: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: Colors.text,
    fontSize: 29,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },
  copy: {
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 290,
    marginTop: 14,
  },
  back: { color: Colors.blue, marginTop: 28, fontWeight: "800" },
});
