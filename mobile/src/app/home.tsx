import { BrandMark } from "@/components/brand-mark";
import { ProfileDrawer } from "@/components/profile-drawer";
import { Screen, SectionTitle } from "@/components/screen";
import { Colors } from "@/constants/theme";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Screen>
      <View style={styles.header}>
        <BrandMark />
        <Pressable onPress={() => setDrawerOpen(true)}>
          <Text style={styles.avatar}>VS</Text>
        </Pressable>
      </View>
      <Text style={styles.greeting}>GOOD MORNING</Text>
      <Text style={styles.title}>Keep every conversation honest.</Text>
      <Text style={styles.copy}>
        Protect yourself from AI-generated and manipulated voices.
      </Text>
      <View style={styles.actions}>
        <ActionCard
          primary
          icon={
            <FontAwesomeIcon icon={faMicrophone} size={42} color={Colors.ink} />
          }
          title="Record voice"
          hint="Analyze live audio"
          onPress={() => router.push("/record" as never)}
        />
        <ActionCard
          icon={<FileIcon />}
          title="Upload audio"
          hint="WAV, MP3, M4A"
          onPress={() => router.push("/upload" as never)}
        />
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
      <ProfileDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Screen>
  );
}

function ActionCard({
  primary = false,
  icon,
  title,
  hint,
  onPress,
}: {
  primary?: boolean;
  icon: ReactNode;
  title: string;
  hint: string;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.action,
        primary && styles.primary,
        hovered && styles.actionHovered,
      ]}
    >
      <View style={styles.actionIcon}>{icon}</View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={[styles.actionHint, primary && styles.primaryHint]}>
        {hint}
      </Text>
    </Pressable>
  );
}

function FileIcon() {
  return (
    <View style={styles.fileIcon}>
      <View style={styles.fileFold} />
      <View style={styles.audioWave}>
        <View style={styles.audioBarShort} />
        <View style={styles.audioBarTall} />
        <View style={styles.audioBarMedium} />
        <View style={styles.audioBarTall} />
        <View style={styles.audioBarShort} />
      </View>
    </View>
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
    marginBottom: "auto",
    height: 56,
    justifyContent: "flex-start",
  },
  actionHovered: {
    transform: [{ translateY: -5 }],
    shadowColor: Colors.cyan,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  actionTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
  },
  actionHint: { color: Colors.muted, fontSize: 12 },
  primaryHint: { color: "#DCEEFF" },
  fileIcon: {
    width: 38,
    height: 45,
    borderWidth: 2,
    borderColor: Colors.purple,
    borderRadius: 5,
    paddingTop: 18,
    paddingHorizontal: 7,
  },
  fileFold: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.purple,
    backgroundColor: Colors.panel,
    borderBottomLeftRadius: 3,
  },
  audioWave: {
    height: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  audioBarShort: {
    width: 2,
    height: 6,
    backgroundColor: Colors.purple,
    borderRadius: 1,
  },
  audioBarTall: {
    width: 2,
    height: 15,
    backgroundColor: Colors.purple,
    borderRadius: 1,
  },
  audioBarMedium: {
    width: 2,
    height: 10,
    backgroundColor: Colors.purple,
    borderRadius: 1,
  },
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
});
