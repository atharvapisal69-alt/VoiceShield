import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import type { AuthUser } from "@/services/auth";

export default function ProfileDetails() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("voiceshield.user").then((value) => {
      if (value) setUser(JSON.parse(value) as AuthUser);
    });
  }, []);

  return (
    <Screen>
      <Pressable
        onPress={() => router.replace("/home" as never)}
        style={styles.backButton}
      >
        <Text style={styles.back}>Back to home</Text>
      </Pressable>
      <BrandMark />
      <Text style={styles.kicker}>PROFILE DETAILS</Text>
      <Text style={styles.title}>{user?.name ?? "Your profile"}</Text>
      <Text style={styles.copy}>
        Your VoiceShield account is ready for private voice analysis.
      </Text>
      <View style={styles.card}>
        <Text style={styles.key}>NAME</Text>
        <Text style={styles.value}>{user?.name ?? "Not available"}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.key}>EMAIL</Text>
        <Text style={styles.value}>{user?.email ?? "Not available"}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.key}>ACCOUNT STATUS</Text>
        <Text style={styles.status}>ACTIVE</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 42,
  },
  back: { color: Colors.muted, fontSize: 14 },
  kicker: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 48,
  },
  title: { color: Colors.text, fontSize: 30, fontWeight: "800", marginTop: 10 },
  copy: {
    color: Colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    marginBottom: 30,
  },
  card: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
  },
  key: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  value: { color: Colors.text, fontSize: 13, textAlign: "right", flex: 1 },
  status: {
    color: Colors.green,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
