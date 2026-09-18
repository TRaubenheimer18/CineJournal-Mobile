import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { colors, spacing, typography } from "../theme/colors";
import { movieApi } from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import Header from "../components/Header";
import { CATEGORIES } from "../data/movies";

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMovies = async () => {
    const data = await movieApi.getAllMovies();
    setMovies(data);
  };

  useEffect(() => {
    loadMovies().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  const goToDetail = (movie) => navigation.navigate("MovieDetail", { movieId: movie.id });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accentOrange} size="large" />
      </View>
    );
  }

  const trending = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const newest = [...movies].sort((a, b) => b.year - a.year).slice(0, 6);

  return (
    <View style={styles.screen}>
      <Header title="Home" showMenu />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentOrange} />}
      >
        <Section title="Trending Now" movies={trending} onPressMovie={goToDetail} />
        <Section title="New Releases" movies={newest} onPressMovie={goToDetail} />
        {CATEGORIES.slice(0, 4).map((cat) => (
          <Section
            key={cat}
            title={cat}
            movies={movies.filter((m) => m.category === cat)}
            onPressMovie={goToDetail}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Section({ title, movies, onPressMovie }) {
  if (!movies.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        renderItem={({ item }) => <MovieCard movie={item} onPress={() => onPressMovie(item)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h2, color: colors.textPrimary, marginLeft: spacing.md, marginBottom: spacing.sm },
});