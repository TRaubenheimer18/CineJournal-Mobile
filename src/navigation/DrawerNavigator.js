import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme/colors";
import BottomTabNavigator from "./BottomTabNavigator";
import { useAuth } from "../context/authContext";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.surface, width: 260 },
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { user, logout } = useAuth();

  const navigateTo = (screen) => {
    navigation.closeDrawer();
    navigation.navigate("MainTabs", { screen });
  };

  const items = [
    { icon: "home-outline", label: "Home", onPress: () => navigateTo("HomeTab") },
    { icon: "grid-outline", label: "Categories", onPress: () => navigateTo("CategoriesTab") },
    { icon: "bag-handle-outline", label: "Cart", onPress: () => navigateTo("CartTab") },
    { icon: "person-outline", label: "Profile", onPress: () => navigateTo("ProfileTab") },
  ];

  return (
    <View style={styles.container}>
      {/* Same avatar treatment as ProfileScreen's header — circle + emoji icon, real user data */}
      <View style={styles.profileSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {items.map((item) => (
        <TouchableOpacity key={item.label} style={styles.item} onPress={item.onPress}>
          <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
          <Text style={styles.itemLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.item}
        onPress={() => { navigation.closeDrawer(); navigation.navigate("MainTabs", { screen: "HomeTab", params: { screen: "Settings" } }); }}
      >
        <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
        <Text style={styles.itemLabel}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={[styles.itemLabel, { color: colors.danger }]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: spacing.md },
  profileSection: { alignItems: "flex-start", marginBottom: spacing.lg },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surfaceElevated,
    alignItems: "center", justifyContent: "center", marginBottom: spacing.sm,
  },
  avatarIcon: { fontSize: 26 },
  name: { ...typography.h3, color: colors.textPrimary },
  email: { ...typography.caption, color: colors.textMuted },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, gap: spacing.md },
  itemLabel: { color: colors.textPrimary, fontSize: 15 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});