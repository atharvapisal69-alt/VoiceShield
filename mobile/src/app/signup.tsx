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
import { signUp } from "@/services/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!name.trim() || !email.trim() || password.length < 6)
      return setError(
        "Add your name, a valid email, and a password with 6+ characters.",
      );
    setBusy(true);
    setError("");
    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      router.replace("/home" as never);
    } catch {
      setError("Unable to create your account.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
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
        <Text style={styles.kicker}>CREATE YOUR ACCOUNT</Text>
        <Text style={styles.title}>Make every voice count.</Text>
        <Text style={styles.copy}>
          Your private analysis history stays on this device.
        </Text>
        <View style={styles.form}>
          <Field
            label="YOUR NAME"
            value={name}
            onChangeText={setName}
            placeholder="Alex Morgan"
          />
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
            placeholder="6+ characters"
            secureTextEntry
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <Button
          label={busy ? "Creating..." : "Create account"}
          onPress={submit}
          disabled={busy}
        />
        <Text style={styles.switch}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <Text
            style={styles.link}
            onPress={() => router.push("/login" as never)}
          >
            Sign in
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
        autoCapitalize={props.keyboardType ? "none" : "words"}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { color: Colors.muted, marginTop: 14 },
  brand: { marginTop: 36 },
  kicker: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 30,
  },
  title: { color: Colors.text, fontSize: 29, fontWeight: "800", marginTop: 10 },
  copy: { color: Colors.muted, fontSize: 15, marginTop: 10 },
  form: { gap: 14, marginTop: 28, marginBottom: 10 },
  field: { gap: 7 },
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
    minHeight: 51,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  error: { color: Colors.red, fontSize: 13, marginBottom: 12 },
  switch: { textAlign: "center", marginTop: 20 },
  switchText: { color: Colors.muted, fontSize: 13 },
  link: { color: Colors.cyan, fontWeight: "800", fontSize: 13 },
});
