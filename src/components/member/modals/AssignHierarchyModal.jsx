import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Platform,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllHierarchy } from "@/api/membersAPI";

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
};

export default function AssignHierarchyModal({
  visible,
  onClose,
  onSubmit,
  member,
}) {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (visible) {
      setSelected(member?.hierarchy || null);
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await fetchAllHierarchy(); // [{nameR, hierarchy, nameE}]
      const mapped = list.map((item) => ({
        key: item.hierarchy,
        label: item.nameR,
      }));
      setOptions([{ key: null, label: "— Нет —" }, ...mapped]);
    } catch (e) {
      setErr(e?.message || "Ошибка загрузки иерархий");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        memberId: member?.id,
        hierarchy: selected,
      };
      await onSubmit?.({ data: payload });
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Ошибка при сохранении");
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
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.title}>Назначить иерархию</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* ФИО члена */}
          {member && (
            <Text style={styles.memberName}>
              {member.lastName} {member.firstName}
            </Text>
          )}

          {/* Список иерархий */}
          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : err ? (
              <Text style={styles.error}>{err}</Text>
            ) : (
              options.map((opt) => {
                const active = selected === opt.key;
                return (
                  <Pressable
                    key={String(opt.key)}
                    onPress={() => setSelected(opt.key)}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        active && styles.optionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>

          {/* Кнопки */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Отмена</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[
                styles.submitBtn,
                !selected && selected !== null && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.submitText}>Сохранить</Text>
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
    justifyContent: "center",
    alignItems: "center",
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

  memberName: {
    marginTop: 6,
    fontWeight: "700",
    color: COLORS.primary,
    fontSize: 16,
  },

  body: { marginTop: 12, gap: 8 },

  option: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginBottom: 6,
  },
  optionActive: {
    backgroundColor: "#E8F0FE",
    borderColor: "#C7DBFF",
  },
  optionText: { color: COLORS.text, fontWeight: "600" },
  optionTextActive: { color: COLORS.primary },

  error: { color: "#b91c1c", fontWeight: "700", fontSize: 12, marginBottom: 8 },

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
  submitText: { color: "#fff", fontWeight: "800" },
});
