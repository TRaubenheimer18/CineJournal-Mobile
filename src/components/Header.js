import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../theme/colors";
import { useCart } from "../context/CartContext";

export default function Header({ title, showMenu = false, showSearch = true, showCart = true }) {
  const navigation = useNavigation();
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.left}>
        {showMenu && (
          <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.right}>
        {showSearch && (
          <TouchableOpacity onPress={() => navigation.navigate("Search")} style={styles.iconButton}>
            <Ionicons name="search" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.iconButton}>
            <Ionicons name="bag-handle-outline" size={22} color={colors.textPrimary} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  left: { flexDirection: "row", alignItems: "center" },
  right: { flexDirection: "row", alignItems: "center" },
  title: { ...typography.h1, color: colors.textPrimary },
  iconButton: { marginLeft: spacing.md, padding: 2 },
  badge: {
    position: "absolute", top: -4, right: -6,
    backgroundColor: colors.accentOrange,
    borderRadius: 8, minWidth: 16, height: 16,
    alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
  },
  badgeText: { color: "#000", fontSize: 10, fontWeight: "700" },
});