import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function Result() {
  const p = useLocalSearchParams<{
    label: string;
    risk_score: string;
    confidence: string;
    explanation: string;
    fileName?: string;
  }>();
  const label = p.label ?? "LOW RISK";
  const color = label.includes("HIGH")
    ? Colors.red
    : label.includes("MEDIUM")
      ? Colors.orange
      : Colors.green;
  const score = Number(p.risk_score ?? 0);
  const confidence = Number(p.confidence ?? 0);
  return (
    <Screen>
      <Text
        style={styles.back}
        onPress={() => router.replace("/home" as never)}
      >
        Home
      </Text>
      <Text style={styles.kicker}>ANALYSIS COMPLETE</Text>
      <Text style={styles.title}>Your voice check</Text>
      <Text style={styles.file}>{p.fileName ?? "Audio recording"}</Text>
      <View style={[styles.risk, { borderColor: color }]}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        <Text style={styles.big}>{(score * 100).toFixed(2)}%</Text>
        <Text style={styles.small}>RISK SCORE</Text>
      </View>
      <View style={styles.metrics}>
        <View>
          <Text style={styles.metricValue}>
            {(confidence * 100).toFixed(2)}%
          </Text>
          <Text style={styles.small}>CONFIDENCE</Text>
        </View>
        <View>
          <Text style={styles.metricValue}>
            {label.includes("LOW") ? "CLEAR" : "REVIEW"}
          </Text>
          <Text style={styles.small}>RECOMMENDATION</Text>
        </View>
      </View>
      <View style={styles.explanation}>
        <Text style={styles.small}>WHY THIS RESULT</Text>
        <Text style={styles.body}>{p.explanation}</Text>
      </View>
      <Button
        label="Scan another voice"
        onPress={() => router.replace("/home" as never)}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { color: Colors.muted, marginTop: 12, marginBottom: 38 },
  kicker: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: { color: Colors.text, fontSize: 30, fontWeight: "800", marginTop: 9 },
  file: { color: Colors.muted, fontSize: 13, marginTop: 8 },
  risk: {
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 30,
    marginTop: 30,
  },
  label: { fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  big: { color: Colors.text, fontSize: 52, fontWeight: "800", marginTop: 14 },
  small: {
    color: Colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 5,
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metricValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  explanation: {
    backgroundColor: Colors.panel,
    borderRadius: 16,
    padding: 18,
    marginVertical: 24,
  },
  body: { color: Colors.text, lineHeight: 22, fontSize: 14, marginTop: 10 },
});
