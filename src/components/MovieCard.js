import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../theme/colors";

const CARD_WIDTH = 110;

export default function MovieCard({ movie, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.75}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={10} color={colors.ratingStar} />
        <Text style={styles.ratingText}>{movie.rating}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
      <Text style={styles.year}>{movie.year}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: CARD_WIDTH, marginRight: spacing.sm },
  poster: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
  },
  ratingBadge: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20,24,28,0.85)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 2,
  },
  ratingText: { color: colors.textPrimary, fontSize: 10, fontWeight: "700", marginLeft: 2 },
  title: { ...typography.caption, color: colors.textPrimary, fontWeight: "600", marginTop: spacing.xs },
  year: { ...typography.caption, color: colors.textMuted },
});