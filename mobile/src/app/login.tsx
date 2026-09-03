import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import { logIn } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password)
      return setError("Enter your email and password.");
    setBusy(true);
    setError("");
    try {
      await logIn(email, password);
      router.replace("/home" as never);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to log in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/" as never)
          }
        >
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <View style={styles.brand}>
          <BrandMark />
        </View>
        <Text style={styles.kicker}>WELCOME BACK</Text>
        <Text style={styles.title}>Sign in to your shield.</Text>
        <Text style={styles.copy}>
          Continue protecting the voices that matter.
        </Text>
        <View style={styles.form}>
          <Field
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <Field
            label="PASSWORD"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <Button
          label={busy ? "Signing in..." : "Sign in"}
          onPress={submit}
          disabled={busy}
        />
        <Text style={styles.switch}>
          <Text style={styles.switchText}>New to VoiceShield? </Text>
          <Text
            style={styles.link}
            onPress={() => router.push("/signup" as never)}
          >
            Create an account
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        style={styles.input}
        placeholderTextColor={Colors.muted}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { color: Colors.muted, marginTop: 14, fontSize: 14 },
  brand: { marginTop: 46 },
  kicker: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 42,
  },
  title: { color: Colors.text, fontSize: 30, fontWeight: "800", marginTop: 10 },
  copy: { color: Colors.muted, fontSize: 15, marginTop: 10 },
  form: { gap: 18, marginTop: 34, marginBottom: 10 },
  field: { gap: 8 },
  label: {
    color: Colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  input: {
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    color: Colors.text,
    minHeight: 54,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  error: { color: Colors.red, fontSize: 13, marginBottom: 12 },
  switch: { textAlign: "center", marginTop: 24 },
  switchText: { color: Colors.muted, fontSize: 13 },
  link: { color: Colors.cyan, fontWeight: "800", fontSize: 13 },
});
