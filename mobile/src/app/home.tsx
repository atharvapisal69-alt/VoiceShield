import { BrandMark } from "@/components/brand-mark";
import { Screen, SectionTitle } from "@/components/screen";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <Screen>
      <View style={styles.header}>
        <BrandMark />
        <Pressable onPress={() => router.push("/profile" as never)}>
          <Text style={styles.avatar}>VS</Text>
        </Pressable>
      </View>
      <Text style={styles.greeting}>GOOD MORNING</Text>
      <Text style={styles.title}>Keep every conversation honest.</Text>
      <Text style={styles.copy}>
        Protect yourself from AI-generated and manipulated voices.
      </Text>
      <View style={styles.actions}>
        <Pressable
          style={[styles.action, styles.primary]}
          onPress={() => router.push("/record" as never)}
        >
          <Text style={styles.actionIcon}>REC</Text>
          <Text style={styles.actionTitle}>Record voice</Text>
          <Text style={styles.actionHint}>Analyze live audio</Text>
        </Pressable>
        <Pressable
          style={styles.action}
          onPress={() => router.push("/upload" as never)}
        >
          <Text style={[styles.actionIcon, { color: Colors.purple }]}>
            FILE
          </Text>
          <Text style={styles.actionTitle}>Upload audio</Text>
          <Text style={styles.actionHint}>WAV, MP3, M4A</Text>
        </Pressable>
      </View>
      <SectionTitle
        eyebrow="YOUR ACTIVITY"
        title="Recent analyses"
        action={
          <Pressable onPress={() => router.push("/history" as never)}>
            <Text style={styles.link}>View all</Text>
          </Pressable>
        }
      />
      <View style={styles.recent}>
        <View style={styles.dot} />
        <View style={{ flex: 1 }}>
          <Text style={styles.recentName}>No analyses yet</Text>
          <Text style={styles.actionHint}>
            Your scan history will appear here
          </Text>
        </View>
        <Text style={styles.chevron}>+</Text>
      </View>
      <View style={styles.bottom}>
        <Pressable onPress={() => router.push("/home" as never)}>
          <Text style={styles.activeNav}>Home</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/history" as never)}>
          <Text style={styles.nav}>History</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/profile" as never)}>
          <Text style={styles.nav}>About</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 42,
  },
  avatar: {
    color: Colors.ink,
    backgroundColor: Colors.cyan,
    width: 38,
    height: 38,
    borderRadius: 19,
    textAlign: "center",
    paddingTop: 11,
    fontWeight: "800",
    fontSize: 12,
  },
  greeting: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    marginTop: 8,
  },
  copy: {
    color: Colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 28,
  },
  actions: { flexDirection: "row", gap: 12, marginBottom: 42 },
  action: {
    flex: 1,
    minHeight: 165,
    padding: 18,
    borderRadius: 18,
    backgroundColor: Colors.panel,
    borderColor: Colors.border,
    borderWidth: 1,
    justifyContent: "flex-end",
  },
  primary: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  actionIcon: {
    color: Colors.ink,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: "auto",
  },
  actionTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
  },
  actionHint: { color: Colors.muted, fontSize: 12 },
  link: { color: Colors.blue, fontSize: 12, fontWeight: "700" },
  recent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  recentName: { color: Colors.text, fontWeight: "700", marginBottom: 4 },
  chevron: { color: Colors.muted, fontSize: 20 },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 20,
    marginTop: 36,
  },
  nav: { color: Colors.muted, fontSize: 12, fontWeight: "700" },
  activeNav: { color: Colors.cyan, fontSize: 12, fontWeight: "800" },
});
