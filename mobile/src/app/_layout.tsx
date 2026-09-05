import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AnalysisProvider } from "@/context/AnalysisContext";
import { CallProtectionProvider } from "@/context/CallProtectionContext";
import { Colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AnalysisProvider>
        <CallProtectionProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.dark },
            }}
          />
        </CallProtectionProvider>
      </AnalysisProvider>
    </SafeAreaProvider>
  );
}
