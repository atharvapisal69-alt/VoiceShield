import { Redirect } from "expo-router";

export default function Index() {
  // The tab group hosts Home, History and Profile under /home, /history, /profile.
  return <Redirect href="/home" />;
}