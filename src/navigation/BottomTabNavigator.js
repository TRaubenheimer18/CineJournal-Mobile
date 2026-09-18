import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { useCart } from "../context/CartContext";

import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import createTabStack from "./createTabStack";

const Tab = createBottomTabNavigator();

const HomeTabStack = createTabStack("HomeMain", HomeScreen);
const CategoriesTabStack = createTabStack("CategoriesMain", CategoriesScreen);
const CartTabStack = createTabStack("CartMain", CartScreen);
const ProfileTabStack = createTabStack("ProfileMain", ProfileScreen);

const ICONS = {
  HomeTab: "home",
  CategoriesTab: "grid",
  CartTab: "bag-handle",
  ProfileTab: "person-circle",
};

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accentOrange,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom || 8, height: 56 + (insets.bottom || 8) }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => (
          <TabIcon routeName={route.name} color={color} size={size} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeTabStack} options={{ title: "Home" }} />
      <Tab.Screen name="CategoriesTab" component={CategoriesTabStack} options={{ title: "Categories" }} />
      <Tab.Screen name="CartTab" component={CartTabStack} options={{ title: "Cart" }} />
      <Tab.Screen name="ProfileTab" component={ProfileTabStack} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}

function TabIcon({ routeName, color, size, focused }) {
  const { totalItems } = useCart();
  return (
    <View>
      <Ionicons name={focused ? ICONS[routeName] : `${ICONS[routeName]}-outline`} color={color} size={size} />
      {routeName === "CartTab" && totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  tabLabel: { fontSize: 11, fontWeight: "600" },
  badge: {
    position: "absolute", top: -4, right: -8,
    backgroundColor: colors.accentOrange, borderRadius: 8,
    minWidth: 15, height: 15, alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
  },
  badgeText: { color: "#000", fontSize: 9, fontWeight: "700" },
});