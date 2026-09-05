import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { PermissionCard } from "@/components/PermissionCard";
import { Button, Card, Screen, ShieldMark } from "@/components/shared";
import { APP_VERSION } from "@/constants/config";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { useAnalysis } from "@/context/AnalysisContext";
import {
  getMicrophonePermission,
  requestMicrophonePermission,
} from "@/services/permissions";

interface InfoSection {
  id: string;
  icon: string;
  title: string;
  body: string;
}

const SECTIONS: InfoSection[] = [
  {
    id: "about",
    icon: "🛡️",
    title: "About VoiceShield",
    body: "VoiceShield is an AI-powered voice authenticity and scam-risk analyzer. It estimates whether a voice contains synthetic or manipulated characteristics.",
  },
  {
    id: "privacy",
    icon: "🔐",
    title: "Privacy & Security",
    body: "Audio is analyzed only when you choose to. Raw audio is never stored — only analysis metadata is kept on your device. Always use HTTPS in production.",
  },
  {
    id: "how",
    icon: "🧠",
    title: "How Voice Detection Works",
    body: "The AI model inspects acoustic and spectral characteristics of speech to estimate how likely audio is synthetic or manipulated. VoiceShield gives a probabilistic risk score — never a definite scammer claim.",
  },
  {
    id: "call",
    icon: "📞",
    title: "Call Protection",
    body: "Modern mobile operating systems do not expose real-time cellular call audio to ordinary apps. VoiceShield shows an availability warning where unsupported, and Record/Upload remain fully supported analysis paths.",
  },
];

export default function ProfileTab() {
  const { clearAll } = useAnalysis();
  const [openId, setOpenId] = useState<string | null>(null);
  const [micGranted, setMicGranted] = useState(false);

  useEffect(() => {
    let active = true;
    void getMicrophonePermission().then((state) => {
      if (active) setMicGranted(state.granted);
    });
    return () => {
      active = false;
    };
  }, []);

  const grantMic = async () => {
    const state = await requestMicrophonePermission();
    setMicGranted(state.granted);
  };

  const confirmClear = () => {
    Alert.alert(
      "Clear analysis history?",
      "This removes all saved analyses and call reports from this device.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearAll },
      ],
    );
  };

  return (
    <Screen>
      <Header title="Profile" status="Profile & preferences" />

      <Card style={styles.appCard}>
        <ShieldMark size={52} />
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>VoiceShield</Text>
          <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
        </View>
        <Text style={styles.platformBadge}>AI Voice Shield</Text>
      </Card>

      <Text style={styles.sectionLabel}>ABOUT</Text>
      {SECTIONS.map((section) => (
        <Pressable
          key={section.id}
          accessibilityRole="button"
          accessibilityState={{ expanded: openId === section.id }}
          onPress={() =>
            setOpenId((current) =>
              current === section.id ? null : section.id,
            )
          }
          style={({ pressed }) => [
            styles.sectionCard,
            pressed && { opacity: 0.8 },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{section.icon}</Text>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionChevron}>
              {openId === section.id ? "−" : "+"}
            </Text>
          </View>
          {openId === section.id ? (
            <Text style={styles.sectionBody}>{section.body}</Text>
          ) : null}
        </Pressable>
      ))}

      <Text style={styles.sectionLabel}>PERMISSIONS</Text>
      <PermissionCard
        icon="🎙️"
        title="Microphone"
        description="Used only while you actively record a voice sample."
        granted={micGranted}
        onRequest={grantMic}
      />

      <Button
        label="Clear Analysis History"
        variant="danger"
        icon="🗑"
        onPress={confirmClear}
        style={styles.clearButton}
      />

      <Text style={styles.footerNote}>
        VoiceShield never records calls, never activates the microphone
        silently, and never uploads audio without your explicit action.
      </Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  appCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: Spacing.sm,
  },
  appTitle: { color: Colors.text, fontSize: 18, fontWeight: "900" },
  appVersion: { color: Colors.textMuted, fontSize: 12, marginTop: 3 },
  platformBadge: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  sectionIcon: { fontSize: 17 },
  sectionTitle: { color: Colors.text, fontSize: 14, fontWeight: "800", flex: 1 },
  sectionChevron: { color: Colors.primary, fontSize: 20, fontWeight: "800" },
  sectionBody: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSoft,
    paddingTop: Spacing.sm,
  },
  clearButton: { marginTop: Spacing.lg },
  footerNote: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});