import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type Tab = "home" | "history" | "about";

export function BottomNav({ active }: { active: Tab }) {
  const tabs = [
    { key: "home" as const, label: "Home", path: "/home" },
    { key: "history" as const, label: "History", path: "/history" },
    { key: "about" as const, label: "About", path: "/profile" },
  ];

  return (
    <View style={styles.bottom}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => router.replace(tab.path as never)}
          style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
        >
          <View
            style={[
              styles.indicator,
              active === tab.key && styles.activeIndicator,
            ]}
          />
          <Text style={active === tab.key ? styles.active : styles.label}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 36,
  },
  tab: { minWidth: 76, alignItems: "center", paddingVertical: 7 },
  indicator: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: "transparent",
    marginBottom: 8,
  },
  activeIndicator: { backgroundColor: Colors.cyan },
  label: { color: Colors.muted, fontSize: 12, fontWeight: "700" },
  active: { color: Colors.cyan, fontSize: 12, fontWeight: "800" },
  pressed: { opacity: 0.65 },
});
