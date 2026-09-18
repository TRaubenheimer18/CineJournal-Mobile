import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../theme/colors";
import SearchBar from "../components/SearchBar";
import { movieApi } from "../api/movieApi";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      movieApi.searchMovies(query).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery("")} autoFocus />
      </View>

      {loading && <ActivityIndicator color={colors.accentOrange} style={{ marginTop: spacing.lg }} />}

      {!loading && query.length > 0 && results.length === 0 && (
        <Text style={styles.emptyText}>No results for "{query}"</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultRow}
            onPress={() => navigation.navigate("MovieDetail", { movieId: item.id })}
          >
            <View>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <Text style={styles.resultMeta}>{item.year} · {item.category}</Text>
            </View>
            <Text style={styles.resultPrice}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
  backButton: { padding: 2 },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: "center", marginTop: spacing.lg },
  resultRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  resultTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: "600" },
  resultMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  resultPrice: { color: colors.accentOrange, fontWeight: "700" },
});