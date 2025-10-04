import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#b91c1c",
};

export default function SaveDonationProgramModal({ visible, onClose, onSubmit, program }) {
  const { t } = useTranslation("donateScreen");

  const [idProgram, setIdProgram] = useState(null);
  const [nameProgram, setNameProgram] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (!visible) return;
    setErr("");
    setSubmitting(false);
    setIdProgram(program?.programId ?? null);
    setNameProgram(program?.programName ?? "");
  }, [visible, program]);

  const handleSubmit = async () => {
    if (!nameProgram.trim()) {
      setErr(t("form.nameRequired", "Name is required"));
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit?.({ idProgram: idProgram, nameProgram: nameProgram.trim() });
      onClose?.();
    } catch (e) {
      setErr(e?.message || t("form.errorSave", "Error saving program"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centerWrap}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.centerCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {program ? t("editProgram") : t("createProgram")}
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <TextInput
              placeholder={t("programName")}
              placeholderTextColor={COLORS.muted}
              value={nameProgram}
              onChangeText={setNameProgram}
              style={styles.input}
            />
            {err ? <Text style={styles.error}>{err}</Text> : null}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>{t("cancel")}</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={submitting || !nameProgram.trim()}
              style={[
                styles.primaryBtn,
                (submitting || !nameProgram.trim()) && styles.disabled,
              ]}
            >
              <Text style={styles.primaryText}>
                {submitting
                  ? t("form.saving", "Saving…")
                  : program
                  ? t("saveEdit")
                  : t("saveCreate")}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  centerCard: {
    width: "92%",
    maxWidth: 480,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 8 },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { color: COLORS.title, fontWeight: "800", fontSize: 18 },
  body: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.text,
  },
  error: { marginTop: 6, color: COLORS.danger, fontWeight: "600", fontSize: 12 },
  footer: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  secondaryText: { color: COLORS.text, fontWeight: "700" },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  primaryText: { color: "#fff", fontWeight: "800" },
  disabled: { opacity: 0.5 },
});