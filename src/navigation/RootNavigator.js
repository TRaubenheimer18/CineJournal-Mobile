import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { useAuth } from "../context/authContext";
import DrawerNavigator from "./DrawerNavigator";
import AuthNavigator from "./AuthNavigator";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accentOrange,
  },
};

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}