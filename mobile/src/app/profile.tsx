import { BrandMark } from "@/components/brand-mark";
import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import { logOut } from "@/services/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
export default function Profile() {
  const [slide] = useState(() => new Animated.Value(-1));

  useEffect(() => {
    Animated.spring(slide, {
      toValue: 0,
      damping: 18,
      stiffness: 140,
      mass: 0.8,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [slide]);

  return (
    <Screen scroll={false}>
      <View style={styles.drawerBackdrop}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [
                {
                  translateX: slide.interpolate({
                    inputRange: [-1, 0],
                    outputRange: [-420, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>Close menu</Text>
          </Pressable>
          <BrandMark />
          <Text style={styles.title}>Your VoiceShield menu.</Text>
          <Text style={styles.copy}>Choose where you want to go.</Text>
          <Text style={styles.menuLabel}>MAIN MENU</Text>
          <View style={styles.menu}>
            <MenuItem label="Home" path="/home" />
            <MenuItem label="History" path="/history" />
            <MenuItem label="About" path="/about" />
          </View>
          <Text
            style={styles.signOut}
            onPress={async () => {
              await logOut();
              router.replace("/login" as never);
            }}
          >
            Sign out
          </Text>
        </Animated.View>
      </View>
    </Screen>
  );
}

function MenuItem({
  label,
  path,
  active = false,
}: {
  label: string;
  path: string;
  active?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        active && styles.activeItem,
        pressed && styles.pressed,
      ]}
      onPress={() => router.replace(path as never)}
    >
      <Text style={active ? styles.activeMenuText : styles.menuText}>
        {label}
      </Text>
      <Text style={active ? styles.activeArrow : styles.arrow}>›</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  drawerBackdrop: { flex: 1, backgroundColor: "rgba(3, 9, 17, 0.72)" },
  drawer: {
    flex: 1,
    width: "88%",
    maxWidth: 420,
    backgroundColor: Colors.ink,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 26,
    shadowColor: Colors.cyan,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 8, height: 0 },
    elevation: 12,
  },
  back: { color: Colors.muted, marginBottom: 42, fontSize: 14 },
  title: {
    color: Colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    marginTop: 55,
  },
  copy: {
    color: Colors.muted,
    lineHeight: 23,
    fontSize: 15,
    marginTop: 16,
    marginBottom: 36,
  },
  signOut: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 38,
  },
  menuLabel: {
    color: Colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    textAlign: "center",
    marginTop: 38,
  },
  menu: { gap: 10, marginTop: 14 },
  menuItem: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeItem: { borderColor: Colors.cyan, backgroundColor: Colors.panelRaised },
  menuText: { color: Colors.text, fontSize: 15, fontWeight: "700" },
  activeMenuText: { color: Colors.cyan, fontSize: 15, fontWeight: "800" },
  arrow: { color: Colors.muted, fontSize: 25, lineHeight: 25 },
  activeArrow: { color: Colors.cyan, fontSize: 25, lineHeight: 25 },
  pressed: { opacity: 0.65, transform: [{ translateX: 2 }] },
});
