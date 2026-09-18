import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, typography } from "../theme/colors";
import { useAuth } from "../context/authContext";
import { profileApi } from "../api/profileApi";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdbConfig";

function formatDate(dateString, style = "short") {
  if (!dateString) return "";
  const date = new Date(dateString);
  return style === "short"
    ? date.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
    : date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("rentals"); // "rentals" | "history"
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await profileApi.getProfile(user.email);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleReturn = async (rentalId) => {
    try {
      await profileApi.returnRental(rentalId);
      await loadProfile(); // refresh so the item moves to Rental History
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.accentOrange} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const currentlyRenting = profile?.currentlyRenting || [];
  const pastRentals = profile?.pastRentals || [];
  const stats = profile?.stats || {};

  return (
    <FlatList
      style={styles.screen}
      data={activeTab === "rentals" ? currentlyRenting : pastRentals}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={{ gap: spacing.md }}
      contentContainerStyle={{ padding: spacing.md, paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentOrange} />}
      ListHeaderComponent={
        <>
          {/* Header: avatar, username/email, stats */}
          <View style={styles.profileHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
              <View style={styles.userMeta}>
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.headerStats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{stats.activeRentalsCount || 0}</Text>
                <Text style={styles.statLabel}>RENTING</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{stats.pastRentalsCount || 0}</Text>
                <Text style={styles.statLabel}>PAST RENTALS</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{stats.totalFilms || 0}</Text>
                <Text style={styles.statLabel}>LOGGED</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.profileNav}>
            <TouchableOpacity onPress={() => setActiveTab("rentals")} style={styles.navButton}>
              <Text style={[styles.navButtonText, activeTab === "rentals" && styles.navButtonTextActive]}>
                Currently Renting
              </Text>
              {activeTab === "rentals" && <View style={styles.navUnderline} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("history")} style={styles.navButton}>
              <Text style={[styles.navButtonText, activeTab === "history" && styles.navButtonTextActive]}>
                Rental History
              </Text>
              {activeTab === "history" && <View style={styles.navUnderline} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            {activeTab === "rentals"
              ? "CURRENTLY RENTING (ACTIVE 48-HOUR ACCESS)"
              : "PAST RENTALS (EXPIRED ACCESS)"}
          </Text>

          <TouchableOpacity style={styles.logoutRow} onPress={logout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </>
      }
      renderItem={({ item }) => {
        const isActive = activeTab === "rentals";
        return (
          <View style={[styles.movieCard, !isActive && styles.movieCardExpired]}>
            <View style={styles.posterWrapper}>
              <Image
                source={{ uri: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : undefined }}
                style={styles.posterImg}
              />
              <View style={[styles.badge, isActive ? styles.activeBadge : styles.expiredBadge]}>
                <Text style={[styles.badgeText, !isActive && styles.badgeTextExpired]}>
                  {isActive ? "Active" : "Expired"}
                </Text>
              </View>
            </View>
            <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.rentalDate}>
              Rented: {formatDate(item.rented_at, isActive ? "short" : "medium")}
            </Text>
            {isActive && (
              <TouchableOpacity style={styles.returnBtn} onPress={() => handleReturn(item.id)}>
                <Text style={styles.returnBtnText}>Return Movie</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {activeTab === "rentals"
              ? "You have no active movie rentals right now."
              : "No past rental history found."}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loadingScreen: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  errorText: { color: colors.danger, textAlign: "center", paddingHorizontal: spacing.lg },

  profileHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: spacing.lg, marginTop: spacing.sm, flexWrap: "wrap", gap: spacing.md,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatarCircle: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: colors.surfaceElevated,
    alignItems: "center", justifyContent: "center",
  },
  avatarIcon: { fontSize: 32 },
  userMeta: {},
  username: { ...typography.h1, color: colors.textPrimary, fontSize: 22 },
  userEmail: { ...typography.caption, color: colors.textMuted },

  headerStats: { flexDirection: "row", gap: spacing.lg },
  statBox: { alignItems: "center" },
  statNumber: { color: colors.textPrimary, fontSize: 18, fontWeight: "700" },
  statLabel: { color: colors.textMuted, fontSize: 10, letterSpacing: 1 },

  profileNav: {
    flexDirection: "row", gap: spacing.md, borderBottomWidth: 1,
    borderBottomColor: colors.border, marginBottom: spacing.lg,
  },
  navButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  navButtonText: { color: colors.textSecondary, fontSize: 13, fontWeight: "700" },
  navButtonTextActive: { color: colors.textPrimary },
  navUnderline: { height: 2, backgroundColor: colors.accentGreen, marginTop: spacing.xs, borderRadius: 1 },

  sectionTitle: {
    color: colors.textSecondary, fontSize: 12, letterSpacing: 1,
    marginBottom: spacing.md, fontWeight: "700",
  },

  logoutRow: { alignItems: "flex-end", marginBottom: spacing.md },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: 13 },

  movieCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.sm,
    overflow: "hidden", marginBottom: spacing.md,
  },
  movieCardExpired: { opacity: 0.85 },
  posterWrapper: { width: "100%", aspectRatio: 2 / 3, position: "relative", backgroundColor: colors.surfaceElevated },
  posterImg: { width: "100%", height: "100%" },
  badge: {
    position: "absolute", top: spacing.xs, right: spacing.xs,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm,
  },
  activeBadge: { backgroundColor: colors.accentGreen },
  expiredBadge: { backgroundColor: colors.surfaceElevated },
  badgeText: { color: colors.background, fontSize: 11, fontWeight: "700" },
  badgeTextExpired: { color: colors.textPrimary },

  movieTitle: { color: colors.textPrimary, fontSize: 13, marginTop: spacing.sm, marginHorizontal: spacing.sm },
  rentalDate: { color: colors.textMuted, fontSize: 11, marginHorizontal: spacing.sm, marginTop: 2, marginBottom: spacing.sm },
  returnBtn: {
    backgroundColor: colors.surfaceElevated, marginHorizontal: spacing.sm, marginBottom: spacing.sm,
    borderRadius: radius.sm, paddingVertical: 6, alignItems: "center",
  },
  returnBtnText: { color: colors.accentGreen, fontSize: 12, fontWeight: "700" },

  emptyState: {
    alignItems: "center", padding: spacing.xl, backgroundColor: colors.surface,
    borderRadius: radius.md, marginTop: spacing.md,
  },
  emptyText: { color: colors.textMuted, textAlign: "center" },
});