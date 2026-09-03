import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.mark}>
        <View style={styles.innerMark} />
      </View>
      {!compact && (
        <Text style={styles.name}>
          VOICE<Text style={styles.accent}>SHIELD</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
  },
  innerMark: {
    width: 13,
    height: 13,
    borderRadius: 5,
    backgroundColor: Colors.ink,
  },
  name: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  accent: { color: Colors.cyan },
});
