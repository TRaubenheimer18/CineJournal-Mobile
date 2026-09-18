import React, { useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../theme/colors";
import { movieApi } from "../api/movieApi";
import { useCart } from "../context/CartContext";

export default function MovieDetailScreen({ route, navigation }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isWatched, setIsWatched] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [rentMessage, setRentMessage] = useState(null);

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    setIsLoading(true);
    movieApi
      .getMovieById(movieId)
      .then((data) => {
        if (!data) {
          setErrorMessage("This film couldn't be found.");
        } else {
          setMovie(data);
        }
      })
      .catch(() => setErrorMessage("Something went wrong loading this film."))
      .finally(() => setIsLoading(false));
  }, [movieId]);

  const toggleWatched = () => setIsWatched((prev) => !prev);
  const toggleLike = () => setIsLiked((prev) => !prev);
  const toggleWatchlist = () => setIsInWatchlist((prev) => !prev);
  const setStarRating = (star) => setRating((prev) => (prev === star ? 0 : star));

  const openLogModal = () => {
    // Hook this up to a real review/log screen later.
    Alert.alert("Review or log", "This will open your review/log screen once it's built.");
  };

  const rentMovie = () => {
    addToCart(movie);
    setRentMessage(`"${movie.title}" was added to your cart.`);
    setTimeout(() => setRentMessage(null), 3000);
  };

  // --- Loading / error states ---
  if (isLoading) {
    return (
      <View style={styles.statusBlock}>
        <ActivityIndicator color={colors.accentOrange} size="large" />
        <Text style={styles.statusMuted}>Loading film details...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.statusBlock}>
        <Text style={styles.statusError}>{errorMessage}</Text>
        <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate("HomeMain")}>
          <Text style={styles.returnButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) return null;

  const inCart = isInCart(movie.id);

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Backdrop */}
      <View style={styles.backdropWrapper}>
        <Image source={{ uri: movie.poster }} style={styles.backdropImg} />
        <View style={styles.backdropGradient} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Poster */}
        <View style={styles.posterCol}>
          <View style={styles.posterCard}>
            <Image source={{ uri: movie.poster }} style={styles.posterImg} />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCol}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <View style={styles.movieMeta}>
            <Text style={styles.releaseYear}>{movie.year}</Text>
            <Text style={styles.tagline}> · {movie.category}</Text>
          </View>
          <Text style={styles.overview}>{movie.synopsis}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsCol}>
          <View style={styles.actionCard}>
            <View style={styles.actionTopRow}>
              <TouchableOpacity
                style={[styles.actionBtn, isWatched && styles.actionBtnActive]}
                onPress={toggleWatched}
              >
                <Text style={styles.btnIcon}>👁</Text>
                <Text style={[styles.btnLabel, isWatched && styles.btnLabelActive]}>Watch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, isLiked && styles.actionBtnActive]}
                onPress={toggleLike}
              >
                <Text style={styles.btnIcon}>♥</Text>
                <Text style={[styles.btnLabel, isLiked && styles.btnLabelActive]}>Like</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, isInWatchlist && styles.actionBtnActive]}
                onPress={toggleWatchlist}
              >
                <Text style={[styles.btnLabel, isInWatchlist && styles.btnLabelActive]}>Watchlist</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Rate</Text>
              <View style={styles.starsPicker}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setStarRating(star)}>
                    <Text style={[styles.star, star <= rating && styles.starActive]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.actionList}>
              <TouchableOpacity onPress={openLogModal}>
                <Text style={styles.listLinkBtn}>Review or log...</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rentalAction}>
              <TouchableOpacity
                style={[styles.rentButton, inCart && styles.rentButtonDisabled]}
                onPress={rentMovie}
                disabled={inCart}
              >
                <Text style={styles.rentButtonText}>
                  {inCart ? "✓ In Cart" : `🛒 Rent Film · $${movie.price.toFixed(2)}`}
                </Text>
              </TouchableOpacity>
              {rentMessage && <Text style={styles.rentMessage}>{rentMessage}</Text>}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  statusBlock: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  statusMuted: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
  statusError: { ...typography.h3, color: colors.danger, textAlign: "center" },
  returnButton: {
    marginTop: spacing.lg, borderWidth: 1, borderColor: colors.textSecondary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill,
  },
  returnButtonText: { color: colors.textPrimary, fontWeight: "600" },

  backdropWrapper: { width: "100%", height: 220, position: "relative" },
  backdropImg: { width: "100%", height: "100%" },
  backdropGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,24,28,0.55)",
  },
  backButton: {
    position: "absolute", top: 50, left: spacing.md,
    backgroundColor: "rgba(20,24,28,0.7)", borderRadius: 20, padding: 6,
  },

  mainContent: { padding: spacing.lg, marginTop: -70 },

  posterCol: { alignItems: "flex-start" },
  posterCard: {
    borderRadius: radius.md, overflow: "hidden",
    borderWidth: 3, borderColor: colors.background,
    shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  posterImg: { width: 130, height: 195, backgroundColor: colors.surfaceElevated },

  infoCol: { marginTop: spacing.md },
  movieTitle: { ...typography.h1, color: colors.textPrimary },
  movieMeta: { flexDirection: "row", marginTop: spacing.xs },
  releaseYear: { ...typography.body, color: colors.textSecondary },
  tagline: { ...typography.body, color: colors.textMuted },
  overview: { ...typography.body, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.sm },

  actionsCol: { marginTop: spacing.lg },
  actionCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },

  actionTopRow: { flexDirection: "row", gap: spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: colors.surfaceElevated, borderRadius: radius.sm,
    paddingVertical: spacing.sm, gap: 4,
  },
  actionBtnActive: { backgroundColor: colors.accentGreen },
  btnIcon: { fontSize: 14 },
  btnLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  btnLabelActive: { color: "#000" },

  ratingSection: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, gap: spacing.sm },
  ratingLabel: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  starsPicker: { flexDirection: "row", gap: 2 },
  star: { fontSize: 20, color: colors.surfaceElevated },
  starActive: { color: colors.ratingStar },

  actionList: { marginTop: spacing.md },
  listLinkBtn: { color: colors.accentBlue, fontSize: 13, fontWeight: "600" },

  rentalAction: { marginTop: spacing.md },
  rentButton: {
    backgroundColor: colors.accentGreen, borderRadius: radius.pill,
    paddingVertical: spacing.md, alignItems: "center",
  },
  rentButtonDisabled: { backgroundColor: colors.surfaceElevated },
  rentButtonText: { color: "#000", fontWeight: "700", fontSize: 15 },
  rentMessage: { color: colors.accentGreen, textAlign: "center", marginTop: spacing.sm, fontSize: 13 },
});