import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Pressable,
} from "react-native";
import { colors, spacing, radius, typography } from "../theme/colors";
import { useAuth } from "../context/authContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    await login(email.trim(), password);
    // If login succeeds, isAuthenticated flips to true and RootNavigator
    // automatically swaps to the main app — nothing else to do here.
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>CineJournal</Text>
        <Text style={styles.subtitle}>Log in to rent and track films</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonHover, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowHover]}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkAccent}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  logo: { ...typography.h1, color: colors.accentOrange, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.textPrimary, textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.xl },
  form: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surfaceElevated, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    color: colors.textPrimary, fontSize: 14,
  },
  errorText: { color: colors.danger, marginTop: spacing.md, fontSize: 13 },
  loginButton: {
    backgroundColor: colors.accentOrange, borderRadius: radius.pill,
    paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.lg,
  },
  loginButtonHover: { backgroundColor: colors.accentGreen },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: "#000", fontWeight: "700", fontSize: 15 },
  linkRow: { alignItems: "center", marginTop: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill },
  linkRowHover: { backgroundColor: colors.accentGreen },
  linkText: { color: colors.textSecondary, fontSize: 13 },
  linkAccent: { color: colors.accentBlue, fontWeight: "600" },
});