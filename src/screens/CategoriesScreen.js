import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import { colors, spacing, radius, typography } from "../theme/colors";
import Header from "../components/Header";
import { movieApi } from "../api/movieApi";

export default function CategoriesScreen({ navigation }) {
  const [categoryData, setCategoryData] = useState([]); // [{ name, count, thumbnail }]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    movieApi.getCategories().then(async (cats) => {
      // Fetch the exact same results CategoryMoviesScreen will show for each
      // category, so the tile's count always matches what you see after tapping in.
      const results = await Promise.all(
        cats.map((cat) => movieApi.getMoviesByCategory(cat))
      );

      if (!isMounted) return;

      const data = cats.map((cat, i) => ({
        name: cat,
        count: results[i].length,
        thumbnail: results[i][0]?.poster,
      }));

      setCategoryData(data);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.accentOrange} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Categories" showMenu />
      <FlatList
        data={categoryData}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("CategoryMovies", { category: item.name })}
          >
            <ImageBackground
              source={item.thumbnail ? { uri: item.thumbnail } : undefined}
              style={styles.image}
              imageStyle={{ borderRadius: radius.md }}
            >
              <View style={styles.overlay} />
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryCount}>{item.count} titles</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loadingScreen: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  card: { marginBottom: spacing.md },
  image: {
    height: 100, borderRadius: radius.md, justifyContent: "flex-end",
    padding: spacing.md, overflow: "hidden", backgroundColor: colors.surfaceElevated,
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(20,24,28,0.45)", borderRadius: radius.md },
  categoryName: { ...typography.h2, color: colors.textPrimary },
  categoryCount: { ...typography.caption, color: colors.textSecondary },
});