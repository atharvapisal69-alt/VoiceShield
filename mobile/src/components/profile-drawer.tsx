import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { Colors } from "@/constants/theme";
import { logOut } from "@/services/auth";

export function ProfileDrawer({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [slide] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [slide, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.layer}>
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={styles.dismiss} onPress={onClose} />
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [
                {
                  translateX: slide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 460],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.drawerHeader}>
            <BrandMark compact />
            <Pressable onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.kicker}>VOICESHIELD MENU</Text>
          <Text style={styles.title}>Navigate safely.</Text>
          <View style={styles.menu}>
            <MenuItem label="Home" path="/home" onClose={onClose} />
            <MenuItem label="History" path="/history" onClose={onClose} />
            <MenuItem label="About" path="/about" onClose={onClose} />
          </View>
          <Pressable
            style={styles.signOut}
            onPress={async () => {
              await logOut();
              onClose();
              router.replace("/login" as never);
            }}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

function MenuItem({
  label,
  path,
  onClose,
}: {
  label: string;
  path: string;
  onClose: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={() => {
        onClose();
        router.replace(path as never);
      }}
    >
      <Text style={styles.itemText}>{label}</Text>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dismiss: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(3, 9, 17, 0.42)",
  },
  drawer: {
    height: "100%",
    width: "86%",
    maxWidth: 390,
    backgroundColor: Colors.ink,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 28,
    shadowColor: Colors.cyan,
    shadowOpacity: 0.35,
    shadowRadius: 26,
    shadowOffset: { width: -8, height: 0 },
    elevation: 18,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 58,
  },
  close: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  kicker: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: Colors.text,
    fontSize: 29,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 30,
  },
  menu: { gap: 10 },
  item: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    backgroundColor: Colors.panel,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: { color: Colors.text, fontSize: 16, fontWeight: "700" },
  arrow: { color: Colors.cyan, fontSize: 27, lineHeight: 27 },
  pressed: { opacity: 0.65, transform: [{ translateX: -3 }] },
  signOut: { marginTop: "auto", paddingVertical: 14, alignItems: "center" },
  signOutText: { color: Colors.red, fontSize: 13, fontWeight: "800" },
});
