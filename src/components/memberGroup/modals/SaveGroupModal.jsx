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

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
};

export default function CreateGroupModal({
  idMemberGroup,
  groupName,
  visible,
  onClose,
  onSubmit,
}) {
  const [id] = useState(idMemberGroup || null);
  const [name, setName] = useState(groupName || "");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (visible) {
      setErr("");
      setSubmitting(false);
    }
  }, [visible]);

  const canSubmit = name.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErr("");
    try {
      if (id) {
        // Editing existing group
        await onSubmit?.({ id, name: name.trim() });
      } else {
        // Creating new group
        await onSubmit?.({ name: name.trim() });
      }
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Ошибка создания группы");
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
        {/* затемнённый фон */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* центральная карточка */}
        <View style={styles.centerCard}>
          <View style={styles.header}>
            <Text style={styles.title}>{id ? `Id:[${id}] Редактировать группу` : "Создать группу"}</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>Назва групи</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Введи назву"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {err ? <Text style={styles.error}>{err}</Text> : null}
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Отмена</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[styles.submitBtn, !canSubmit && styles.submitDisabled]}
            >
              <Text style={styles.submitText}>
                {id ? "Сохранить" : "Создать"}
                {submitting ? "Сохранение…" : ""}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    justifyContent: "center", // <<< центр по вертикали
    alignItems: "center", // <<< центр по горизонтали
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  centerCard: {
    width: "90%",
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
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
  },
  title: { color: COLORS.title, fontWeight: "800", fontSize: 18 },

  body: { marginTop: 10, gap: 8 },
  label: { color: COLORS.text, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.text,
  },
  error: { color: "#b91c1c", fontWeight: "700", fontSize: 12 },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cancelText: { color: COLORS.text, fontWeight: "700" },
  submitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontWeight: "800" },
});
