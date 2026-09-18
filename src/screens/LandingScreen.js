import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, typography } from "../theme/colors";
import { useAuth } from "../context/authContext";

export default function LandingScreen() {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const { login, register, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  const openAuthModal = (signUpMode) => {
    setIsSignUp(signUpMode);
    setMessage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEmail("");
    setUsername("");
    setPassword("");
    setMessage(null);
  };

  const onSubmit = async () => {
    setMessage(null);

    if (!email.trim() || !password || (isSignUp && !username.trim())) {
      setMessage("Please fill in every field.");
      return;
    }

    if (isSignUp) {
      const success = await register(email.trim(), username.trim(), password);
      if (success) {
        setMessage("Account created! You can now sign in.");
        setTimeout(() => {
          setIsSignUp(false);
          setMessage(null);
        }, 1200);
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } else {
      const success = await login(email.trim(), password);
      if (success) {
        closeModal(); // isAuthenticated flips true -> RootNavigator swaps to the main app
      } else {
        setMessage("Invalid email or password.");
      }
    }
  };

  return (
    <View style={[styles.landingPage, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.landingHeader}>
        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.navBtn} onPress={() => openAuthModal(false)}>
            <Text style={styles.navBtnText}>SIGN IN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => openAuthModal(true)}>
            <Text style={[styles.navBtnText, styles.createBtnText]}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>
          Track films you've watched.{"\n"}
          Save those you want to see.{"\n"}
          Tell your friends what's good.
        </Text>
        <TouchableOpacity style={styles.btnGetStarted} onPress={() => openAuthModal(true)}>
          <Text style={styles.btnGetStartedText}>Get started — it's free!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.landingFooter}>
        <Text style={styles.footerText}>The social network for film lovers.</Text>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalWrapper}
          >
            <ScrollView
              contentContainerStyle={styles.modalCard}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{isSignUp ? "Create Account" : "Sign In"}</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {isSignUp && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Choose a username"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.submitBtnText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
                )}
              </TouchableOpacity>

              {message && <Text style={styles.message}>{message}</Text>}

              <View style={styles.switchMode}>
                {!isSignUp ? (
                  <Text style={styles.switchModeText}>
                    Need an account?{" "}
                    <Text style={styles.switchModeLink} onPress={() => { setIsSignUp(true); setMessage(null); }}>
                      Sign up here
                    </Text>
                  </Text>
                ) : (
                  <Text style={styles.switchModeText}>
                    Already registered?{" "}
                    <Text style={styles.switchModeLink} onPress={() => { setIsSignUp(false); setMessage(null); }}>
                      Sign in here
                    </Text>
                  </Text>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  landingPage: {
    flex: 1,
    backgroundColor: colors.background, // RN has no radial-gradient without extra libs — flat bg is the closest match
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  landingHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  authButtons: { flexDirection: "row" },
  navBtn: { marginLeft: spacing.lg },
  navBtnText: {
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
  },
  createBtnText: { color: colors.accentGreen },

  heroContent: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  heroTitle: {
    ...typography.h1,
    textAlign: "center",
    lineHeight: 36,
    marginBottom: spacing.xl,
    color: colors.textPrimary,
  },
  btnGetStarted: {
    backgroundColor: colors.accentGreen,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  btnGetStartedText: {
    color: colors.background,
    fontWeight: "800",
    fontSize: 16,
  },

  landingFooter: { alignItems: "center" },
  footerText: { color: colors.textMuted, fontSize: 13 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: { width: "88%", maxWidth: 380 },
  modalCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  closeBtn: { position: "absolute", top: spacing.md, right: spacing.md, zIndex: 1 },
  closeBtnText: { color: colors.textSecondary, fontSize: 18 },
  modalTitle: {
    ...typography.h2,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  formGroup: { marginBottom: spacing.md },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surfaceElevated,
    borderRadius: radius.sm,
    padding: spacing.md,
    color: colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: colors.accentGreen,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitBtnText: {
    color: colors.background,
    fontWeight: "800",
    fontSize: 15,
  },
  message: {
    textAlign: "center",
    color: colors.accentGreen,
    marginTop: spacing.md,
  },
  switchMode: { alignItems: "center", marginTop: spacing.lg },
  switchModeText: { color: colors.textSecondary, fontSize: 13 },
  switchModeLink: { color: colors.accentGreen, textDecorationLine: "underline" },
});