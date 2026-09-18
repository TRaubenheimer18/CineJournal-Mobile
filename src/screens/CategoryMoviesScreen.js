import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../theme/colors";
import { movieApi } from "../api/movieApi";
import MovieCard from "../components/MovieCard";

export default function CategoryMoviesScreen({ route, navigation }) {
  const { category } = route.params;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    movieApi.getMoviesByCategory(category).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accentOrange} size="large" style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ padding: spacing.md }}
          columnWrapperStyle={{ justifyContent: "flex-start", gap: spacing.sm, marginBottom: spacing.md }}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  backButton: { marginRight: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
});