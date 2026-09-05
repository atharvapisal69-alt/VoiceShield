import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { formatDuration } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";

/**
 * Reusable audio preview: play / pause / seek / stop with live timing.
 * Audio is never auto-played.
 */
export function AudioPlayer({ uri }: { uri: string }) {
  const player = useAudioPlayer(uri || null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    player.replace(uri || null);
  }, [player, uri]);

  const duration =
    status.duration && isFinite(status.duration) ? status.duration : 0;
  const current = status.currentTime ?? 0;
  const progress = duration > 0 ? Math.min(1, current / duration) : 0;

  const togglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (duration > 0 && current >= duration - 0.1) void player.seekTo(0);
      player.play();
    }
  };

  const stop = () => {
    player.pause();
    void player.seekTo(0);
  };

  const seek = (event: { nativeEvent: { locationX: number } }) => {
    if (!trackWidth || !duration) return;
    const ratio = Math.max(0, Math.min(1, event.nativeEvent.locationX / trackWidth));
    void player.seekTo(ratio * duration);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={status.playing ? "Pause" : "Play"}
          onPress={togglePlay}
          style={({ pressed }) => [
            styles.playButton,
            pressed && { transform: [{ scale: 0.92 }] },
          ]}
        >
          <Text style={styles.playIcon}>
            {status.playing ? "⏸" : "▶"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.track}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          onPress={seek}
        >
          <View style={styles.trackBg} />
          <View
            style={[styles.trackFill, { width: `${progress * 100}%` }]}
          />
          <View
            style={[
              styles.thumb,
              { left: `${progress * 100}%` },
            ]}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Stop"
          onPress={stop}
          style={({ pressed }) => [styles.stopButton, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.stopIcon}>⏹</Text>
        </Pressable>
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.time}>{formatDuration(current)}</Text>
        <Text style={styles.time}>{formatDuration(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardRaised,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: { color: Colors.white, fontSize: 18 },
  track: {
    flex: 1,
    height: 32,
    justifyContent: "center",
  },
  trackBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: "hidden",
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.text,
    marginLeft: -7,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stopIcon: { color: Colors.textMuted, fontSize: 15 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});