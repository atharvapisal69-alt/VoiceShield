import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { AnimatedVoiceShieldLogo } from "@/components/AnimatedVoiceShieldLogo";
import { Icon } from "@/components/Icon";
import { BackButton, Button, Screen } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();

  return (
    <Screen>
      <BackButton />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <AnimatedVoiceShieldLogo
            size={142}
            autoPlay
            loop={false}
            showWordmark={false}
          />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.copy}>
            Start your private voice protection journey.
          </Text>
        </View>

        <View style={styles.form}>
          <Field
            label="Your name"
            icon="user"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Field
            label="Email address"
            icon="user"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Create a password"
            icon="shieldHalved"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            label="Create account"
            icon="arrowRight"
            onPress={() => {
              register(name, email);
              router.replace("/home" as never);
            }}
            style={styles.submit}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Text
            style={styles.link}
            onPress={() => router.replace("/login" as never)}
          >
            Log in
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field({
  label,
  icon,
  ...props
}: { label: string; icon: "user" | "shieldHalved" } & React.ComponentProps<
  typeof TextInput
>) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Icon name={icon} size={16} color={Colors.textMuted} />
        <TextInput
          {...props}
          placeholder={label}
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "900",
    marginTop: Spacing.md,
    textAlign: "center",
  },
  copy: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
  form: { gap: Spacing.md },
  fieldWrap: { gap: 6 },
  label: { color: Colors.text, fontSize: 13, fontWeight: "800" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 54,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  input: { flex: 1, color: Colors.text, fontSize: 15 },
  submit: { marginTop: Spacing.sm },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: Spacing.xl,
  },
  footerText: { color: Colors.textMuted, fontSize: 13 },
  link: { color: Colors.primary, fontSize: 13, fontWeight: "800" },
});
