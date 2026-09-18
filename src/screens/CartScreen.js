import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, typography } from "../theme/colors";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { rentalApi } from "../api/rentalApi";
import { useAuth } from "../context/authContext";

export default function CartScreen({ navigation }) {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const insets = useSafeAreaInsets();

 const handleCheckout = async () => {
  try {
    await rentalApi.checkout(items, user.email);
    Alert.alert("Success", `Rented ${totalItems} title(s) for $${totalPrice.toFixed(2)}.`);
    clearCart();
  } catch (err) {
    Alert.alert("Checkout failed", err.message);
  }
};

  if (items.length === 0) {
    return (
      <View style={styles.emptyScreen}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={56} color={colors.textMuted} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("HomeTab")}>
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.movie.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrease={() => updateQuantity(item.movie.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.movie.id, item.quantity - 1)}
            onRemove={() => removeFromCart(item.movie.id)}
          />
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items ({totalItems})</Text>
          <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  emptyScreen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  headerTitle: { ...typography.h1, color: colors.textPrimary },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
  browseButton: {
    marginTop: spacing.md, backgroundColor: colors.accentOrange,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill,
  },
  browseButtonText: { color: "#000", fontWeight: "700" },
  summary: {
    padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  summaryLabel: { color: colors.textSecondary },
  summaryValue: { color: colors.textSecondary },
  totalLabel: { ...typography.h3, color: colors.textPrimary },
  totalValue: { ...typography.h3, color: colors.accentOrange },
  checkoutButton: {
    marginTop: spacing.md, backgroundColor: colors.accentGreen,
    paddingVertical: spacing.sm, borderRadius: radius.pill, alignItems: "center",
  },
  checkoutButtonText: { color: "#000", fontWeight: "700", fontSize: 16 },
});