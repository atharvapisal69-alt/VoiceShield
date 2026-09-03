/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { Platform } from "react-native";

export const Colors = {
  ink: "#07111F",
  panel: "#0E1C2D",
  panelRaised: "#14263C",
  border: "#233A55",
  text: "#F4F8FC",
  muted: "#91A6BB",
  blue: "#4BA3FF",
  cyan: "#65E1E8",
  purple: "#9B8CFF",
  green: "#52D69A",
  orange: "#FFB454",
  red: "#FF6B7A",
  light: {
    text: "#07111F",
    background: "#F4F8FC",
    backgroundElement: "#E3EDF7",
    backgroundSelected: "#D5E4F2",
    textSecondary: "#526B84",
  },
  dark: {
    text: "#F4F8FC",
    background: "#07111F",
    backgroundElement: "#14263C",
    backgroundSelected: "#1A3451",
    textSecondary: "#91A6BB",
  },
} as const;

export type ThemeColor =
  | "text"
  | "background"
  | "backgroundElement"
  | "backgroundSelected"
  | "textSecondary";

export const Fonts = {
  sans: Platform.select({ ios: "Avenir Next", default: "sans-serif" }),
  serif: Platform.select({ ios: "Georgia", default: "serif" }),
  rounded: Platform.select({ ios: "Avenir Next", default: "sans-serif" }),
  mono: Platform.select({ ios: "Menlo", default: "monospace" }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
