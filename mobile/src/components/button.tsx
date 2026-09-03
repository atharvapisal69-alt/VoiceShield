import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";

import { Colors } from "@/constants/theme";

type Props = PressableProps & {
  label: string;
  tone?: "primary" | "secondary" | "quiet";
};

export function Button({ label, tone = "primary", style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={(state) => [
        styles.base,
        styles[tone],
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text
        style={[
          styles.label,
          tone === "primary" ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  primary: { backgroundColor: Colors.blue },
  secondary: {
    backgroundColor: Colors.panelRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quiet: { backgroundColor: "transparent" },
  label: { fontSize: 16, fontWeight: "700" },
  primaryLabel: { color: Colors.ink },
  secondaryLabel: { color: Colors.text },
  pressed: { opacity: 0.72 },
});
