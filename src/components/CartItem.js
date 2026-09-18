import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../theme/colors";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { movie, quantity } = item;
  return (
    <View style={styles.container}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
        <Text style={styles.subtitle}>{movie.year} · {movie.category}</Text>
        <Text style={styles.price}>${movie.price.toFixed(2)}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.qtyButton} onPress={onDecrease}>
            <Ionicons name="remove" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={onIncrease}>
            <Ionicons name="add" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  poster: { width: 60, height: 90, borderRadius: radius.sm, backgroundColor: colors.surfaceElevated },
  info: { flex: 1, marginLeft: spacing.md, justifyContent: "center" },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  price: { ...typography.body, color: colors.accentOrange, fontWeight: "700", marginTop: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.sm },
  qtyButton: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center", justifyContent: "center",
  },
  qtyText: { color: colors.textPrimary, marginHorizontal: spacing.md, fontWeight: "600" },
  removeButton: { justifyContent: "center", paddingLeft: spacing.sm },
});