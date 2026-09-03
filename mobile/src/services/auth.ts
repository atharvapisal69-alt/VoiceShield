import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "voiceshield.user";
const SESSION_KEY = "voiceshield.session";

export type AuthUser = {
  name: string;
  email: string;
  password: string;
};

export async function signUp(user: AuthUser) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(SESSION_KEY, "true");
}

export async function logIn(email: string, password: string) {
  const saved = await AsyncStorage.getItem(USER_KEY);
  if (!saved) throw new Error("No account found. Create an account first.");
  const user = JSON.parse(saved) as AuthUser;
  if (
    user.email.toLowerCase() !== email.trim().toLowerCase() ||
    user.password !== password
  ) {
    throw new Error("Email or password is incorrect.");
  }
  await AsyncStorage.setItem(SESSION_KEY, "true");
}

export async function getCurrentUser() {
  const [saved, session] = await Promise.all([
    AsyncStorage.getItem(USER_KEY),
    AsyncStorage.getItem(SESSION_KEY),
  ]);
  return saved && session === "true" ? (JSON.parse(saved) as AuthUser) : null;
}

export async function logOut() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
