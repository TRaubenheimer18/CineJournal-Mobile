import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../theme/colors";

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <SectionLabel text="Preferences" />
      <ToggleRow label="Push Notifications" value={notifications} onValueChange={setNotifications} />
      <ToggleRow label="Autoplay Trailers" value={autoplay} onValueChange={setAutoplay} />
      <ToggleRow label="Data Saver" value={dataSaver} onValueChange={setDataSaver} />

      <SectionLabel text="Account" />
      <MenuRow icon="person-outline" label="Edit Profile" />
      <MenuRow icon="lock-closed-outline" label="Privacy" />
      <MenuRow icon="card-outline" label="Payment Methods" />

      <SectionLabel text="About" />
      <MenuRow icon="information-circle-outline" label="App Version" value="1.0.0" />
      <MenuRow icon="document-text-outline" label="Terms of Service" />
      <MenuRow icon="shield-checkmark-outline" label="Privacy Policy" />

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SectionLabel({ text }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

function ToggleRow({ label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceElevated, true: colors.accentGreen }}
        thumbColor="#fff"
      />
    </View>
  );
}

function MenuRow({ icon, label, value }) {
  return (
    <TouchableOpacity style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {value ? <Text style={styles.rowValue}>{value}</Text> : <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.md },
  backButton: { marginRight: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
  sectionLabel: {
    ...typography.caption, color: colors.textMuted, textTransform: "uppercase",
    marginTop: spacing.lg, marginBottom: spacing.xs, marginLeft: spacing.md,
  },
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rowLabel: { color: colors.textPrimary, fontSize: 15 },
  rowValue: { color: colors.textMuted, fontSize: 14 },
  logoutButton: { margin: spacing.lg, alignItems: "center", paddingVertical: spacing.md },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: 15 },
});