import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from "react-native";
import { colors, spacing, radius, typography } from "../theme/colors";
import { useAuth } from "../context/authContext";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, isLoading, error } = useAuth();

  const handleSignup = async () => {
    if (!email.trim() || !username.trim() || !password) {
      Alert.alert("Missing fields", "Please fill in every field.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match", "Double check your password fields.");
      return;
    }
    const success = await register(email.trim(), username.trim(), password);
    if (success) {
      Alert.alert("Account created", "You can now log in.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>CineJournal</Text>
        <Text style={styles.subtitle}>Create an account to get started</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="yourusername"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
          />

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

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkAccent}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  logo: { ...typography.h1, color: colors.accentOrange, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.xl },
  form: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surfaceElevated, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    color: colors.textPrimary, fontSize: 14,
  },
  errorText: { color: colors.danger, marginTop: spacing.md, fontSize: 13 },
  signupButton: {
    backgroundColor: colors.accentGreen, borderRadius: radius.pill,
    paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.lg,
  },
  signupButtonDisabled: { opacity: 0.6 },
  signupButtonText: { color: "#000", fontWeight: "700", fontSize: 15 },
  linkRow: { alignItems: "center", marginTop: spacing.md },
  linkText: { color: colors.textSecondary, fontSize: 13 },
  linkAccent: { color: colors.accentBlue, fontWeight: "600" },
});