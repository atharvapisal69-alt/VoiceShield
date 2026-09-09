import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Header } from "@/components/Header";
import { Icon, type IconName } from "@/components/Icon";
import { PermissionCard } from "@/components/PermissionCard";
import { Button, Card, Screen, ShieldMark } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { APP_VERSION } from "@/constants/config";
import { useAnalysis } from "@/context/AnalysisContext";
import { useAuth } from "@/context/AuthContext";
import {
    getMicrophonePermission,
    requestMicrophonePermission,
} from "@/services/permissions";

interface InfoSection {
  id: string;
  icon: IconName;
  title: string;
  body: string;
}

const SECTIONS: InfoSection[] = [
  {
    id: "about",
    icon: "shieldHalved",
    title: "About VoiceShield",
    body: "VoiceShield is an AI-powered voice authenticity and scam-risk analyzer. It estimates whether a voice contains synthetic or manipulated characteristics.",
  },
  {
    id: "privacy",
    icon: "shieldHalved",
    title: "Privacy & Security",
    body: "Audio is analyzed only when you choose to. Raw audio is never stored — only analysis metadata is kept on your device. Always use HTTPS in production.",
  },
  {
    id: "how",
    icon: "magnifyingGlass",
    title: "How Voice Detection Works",
    body: "The AI model inspects acoustic and spectral characteristics of speech to estimate how likely audio is synthetic or manipulated. VoiceShield gives a probabilistic risk score — never a definite scammer claim.",
  },
  {
    id: "call",
    icon: "phone",
    title: "Call Protection",
    body: "Modern mobile operating systems do not expose real-time cellular call audio to ordinary apps. VoiceShield shows an availability warning where unsupported, and Record/Upload remain fully supported analysis paths.",
  },
];

export default function ProfileTab() {
  const { clearAll } = useAnalysis();
  const { user, signOut, updateProfile } = useAuth();
  const [openId, setOpenId] = useState<string | null>(null);
  const [micGranted, setMicGranted] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");

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

  const openProfileEditor = () => {
    if (!user) return;
    setDraftName(user.name);
    setDraftEmail(user.email);
    setEditingProfile(true);
  };

  const saveProfile = () => {
    updateProfile(draftName, draftEmail);
    setEditingProfile(false);
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Sign out of VoiceShield?",
      "Your saved analyses will remain on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            signOut();
            router.replace("/getting-started" as never);
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <Header title="Profile" status="Profile & preferences" />

      <Card style={styles.appCard}>
        <ShieldMark size={52} />
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>VoiceShield AI</Text>
          <Text style={styles.modelName}>Voice intelligence model</Text>
          <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
        </View>
        <Text style={styles.platformBadge}>AI Voice Shield</Text>
      </Card>

      <Card style={styles.modelCard}>
        <View style={styles.modelHeader}>
          <Icon name="waveSquare" size={16} color={Colors.cyan} />
          <Text style={styles.modelTitle}>VoiceShield AI Model</Text>
          <Text style={styles.readyBadge}>READY</Text>
        </View>
        <Text style={styles.modelCopy}>
          Analyzes acoustic and spectral patterns to estimate synthetic voice
          risk. Results are probabilistic and designed to support safer
          decisions.
        </Text>
        <View style={styles.modelStats}>
          <ModelStat label="Engine" value="Voice AI v1.0" />
          <ModelStat label="Mode" value="On-device metadata" />
          <ModelStat label="Audio" value="Never stored" />
        </View>
      </Card>

      {user ? (
        <Card style={styles.accountCard}>
          <View style={styles.accountIcon}>
            <Icon name="user" size={17} color={Colors.cyan} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.accountEyebrow}>SIGNED IN ACCOUNT</Text>
            {editingProfile ? (
              <View style={styles.editFields}>
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="Full name"
                  placeholderTextColor={Colors.textMuted}
                  style={styles.editInput}
                />
                <TextInput
                  value={draftEmail}
                  onChangeText={setDraftEmail}
                  placeholder="Email address"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.editInput}
                />
                <View style={styles.editActions}>
                  <Button
                    label="Save"
                    compact
                    icon="check"
                    onPress={saveProfile}
                    style={styles.editButton}
                  />
                  <Button
                    label="Cancel"
                    compact
                    variant="secondary"
                    onPress={() => setEditingProfile(false)}
                    style={styles.editButton}
                  />
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.accountName}>{user.name}</Text>
                <Text style={styles.accountEmail}>{user.email}</Text>
              </>
            )}
          </View>
          {!editingProfile ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={openProfileEditor}
              style={styles.editIcon}
            >
              <Icon name="pencil" size={14} color={Colors.cyan} />
            </Pressable>
          ) : null}
        </Card>
      ) : null}

      <Text style={styles.sectionLabel}>ABOUT</Text>
      {SECTIONS.map((section) => (
        <Pressable
          key={section.id}
          accessibilityRole="button"
          accessibilityState={{ expanded: openId === section.id }}
          onPress={() =>
            setOpenId((current) => (current === section.id ? null : section.id))
          }
          style={({ pressed }) => [
            styles.sectionCard,
            pressed && { opacity: 0.8 },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name={section.icon} size={17} color={Colors.primary} />
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
        icon="microphone"
        title="Microphone"
        description="Used only while you actively record a voice sample."
        granted={micGranted}
        onRequest={grantMic}
      />

      <Button
        label="Clear Analysis History"
        variant="danger"
        icon="trash"
        onPress={confirmClear}
        style={styles.clearButton}
      />

      <Button
        label="Sign Out"
        variant="secondary"
        icon="rightFromBracket"
        onPress={confirmSignOut}
        style={styles.signOutButton}
      />

      <Text style={styles.footerNote}>
        VoiceShield never records calls, never activates the microphone
        silently, and never uploads audio without your explicit action.
      </Text>
    </Screen>
  );
}

function ModelStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.modelStat}>
      <Text style={styles.modelStatLabel}>{label}</Text>
      <Text style={styles.modelStatValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
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
  modelName: { color: Colors.textMuted, fontSize: 11, marginTop: 3 },
  platformBadge: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  modelCard: { marginTop: Spacing.md },
  modelHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  modelTitle: { color: Colors.text, fontSize: 14, fontWeight: "900", flex: 1 },
  readyBadge: {
    color: Colors.success,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  modelCopy: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
  modelStats: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  modelStat: { flex: 1, minWidth: 0 },
  modelStatLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  modelStatValue: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 3,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: Spacing.md,
  },
  accountIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: `${Colors.cyan}18`,
    borderWidth: 1,
    borderColor: `${Colors.cyan}55`,
    alignItems: "center",
    justifyContent: "center",
  },
  accountEyebrow: {
    color: Colors.cyan,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  accountName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 3,
  },
  accountEmail: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  editFields: { gap: 6, marginTop: 6 },
  editInput: {
    minHeight: 38,
    color: Colors.text,
    backgroundColor: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  editActions: { flexDirection: "row", gap: 6, marginTop: 3 },
  editButton: { flex: 1, minHeight: 38 },
  editIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${Colors.cyan}55`,
    alignItems: "center",
    justifyContent: "center",
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
  sectionTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
  },
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
  signOutButton: { marginTop: Spacing.sm },
});
