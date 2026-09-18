import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieDetailScreen from "../screens/MovieDetailScreen";
import CategoryMoviesScreen from "../screens/CategoryMoviesScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CartScreen from "../screens/CartScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

// Every bottom tab gets its own native stack so each tab keeps its own back
// history, but they all share the same detail/search/settings/cart screens.
// This mirrors how Letterboxd lets you open a film from any tab and still
// have a proper back button. 
export default function createTabStack(rootName, RootComponent) {
  return function TabStack() {
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
      >
        <Stack.Screen name={rootName} component={RootComponent} />
        <Stack.Screen name="CategoryMovies" component={CategoryMoviesScreen} />
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    );
  };
}