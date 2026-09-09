import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (email: string) => void;
  register: (name: string, email: string) => void;
  updateProfile: (name: string, email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: (email) =>
        setUser({
          email: email.trim(),
          name: email.trim().split("@")[0] || "VoiceShield user",
        }),
      register: (name, email) =>
        setUser({
          name: name.trim() || "VoiceShield user",
          email: email.trim(),
        }),
      updateProfile: (name, email) =>
        setUser((current) =>
          current
            ? {
                name: name.trim() || current.name,
                email: email.trim() || current.email,
              }
            : current,
        ),
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
