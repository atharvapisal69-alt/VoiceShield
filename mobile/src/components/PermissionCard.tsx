import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "@/constants/colors";
import { Icon, type IconName } from "@/components/Icon";

/**
 * Permission status card with an inline grant action.
 */
export function PermissionCard({
  icon,
  title,
  description,
  granted,
  onRequest,
  requestLabel = "Grant Access",
}: {
  icon: IconName;
  title: string;
  description: string;
  granted: boolean;
  onRequest?: () => void;
  requestLabel?: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.icon}>
          <Icon name={icon} size={18} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: granted ? Colors.success : Colors.mediumRisk,
                },
              ]}
            />
            <Text
              style={[
                styles.status,
                { color: granted ? Colors.success : Colors.mediumRisk },
              ]}
            >
              {granted ? "Allowed" : "Not granted"}
            </Text>
          </View>
        </View>
      </View>
      {!granted && onRequest ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRequest}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>{requestLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  left: { flexDirection: "row", gap: 14 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: { fontSize: 18 },
  title: { color: Colors.text, fontSize: 15, fontWeight: "900" },
  description: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 7,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  status: { fontSize: 11, fontWeight: "800" },
  button: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}1F`,
    borderRadius: Radius.md,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: Colors.primary, fontSize: 13, fontWeight: "900" },
  pressed: { opacity: 0.8 },
});
