import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { AnalysisProvider } from "@/context/AnalysisContext";
import { AuthProvider } from "@/context/AuthContext";
import { CallProtectionProvider } from "@/context/CallProtectionContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AnalysisProvider>
        <AuthProvider>
          <CallProtectionProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.dark },
              }}
            />
          </CallProtectionProvider>
        </AuthProvider>
      </AnalysisProvider>
    </SafeAreaProvider>
  );
}
