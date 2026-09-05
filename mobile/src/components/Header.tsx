import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ShieldMark } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";

/**
 * Page header. In `brand` mode it renders the VoiceShield wordmark;
 * otherwise it renders a title/subtitle with an optional status pill.
 */
export function Header({
  title,
  subtitle,
  status,
  right,
  brand = false,
}: {
  title?: string;
  subtitle?: string;
  status?: string;
  right?: ReactNode;
  brand?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      {brand ? (
        <View style={styles.brandRow}>
          <ShieldMark size={44} />
          <View style={styles.brandText}>
            <Text style={styles.brandTitle}>VoiceShield</Text>
            <Text style={styles.brandSub}>
              Stay protected from suspicious voices.
            </Text>
          </View>
        </View>
      ) : null}

      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {status ? (
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      ) : null}

      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.lg },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  brandText: { flex: 1 },
  brandTitle: { color: Colors.text, fontSize: 24, fontWeight: "900" },
  brandSub: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: Spacing.sm,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  statusRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    backgroundColor: `${Colors.success}14`,
    borderColor: `${Colors.success}3D`,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  statusText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});