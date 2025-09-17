import React, { useEffect, useState, useMemo } from "react";
import {
  Modal, View, Text, Pressable, FlatList, StyleSheet, Platform, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { getMembersWithoutGroup } from "@/api/memberGroupAPI";

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#DC2626",
};

export default function AddMemberModal({
  visible,
  onClose,
  onSubmit,        // ({ groupId, memberIds: number[] })
  groupId,
  groupName,
}) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembersWithoutGroup();
      const sorted = (Array.isArray(data) ? data : []).slice().sort(
        (a, b) =>
          (a?.lastName || "").localeCompare(b?.lastName || "", undefined, { sensitivity: "base" }) ||
          (a?.firstName || "").localeCompare(b?.firstName || "", undefined, { sensitivity: "base" })
      );
      setMembers(sorted);
    } catch (error) {
      const message = error?.message || "Ошибка при загрузке списка";
      Toast.show({ type: "error", text1: "Ошибка!", text2: message, position: "top" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setSelectedIds(new Set());
      setSubmitting(false);
      loadMembers();
    }
  }, [visible]);

  const countSelected = selectedIds.size;
  const hasSelection = countSelected > 0;
  const memberIds = useMemo(() => Array.from(selectedIds), [selectedIds]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!hasSelection) return;
    setSubmitting(true);
    try {
      await onSubmit?.({ groupId, memberIds });
      onClose?.();
    } catch (e) {
      console.error("Ошибка при добавлении участников:", e);
      Toast.show({ type: "error", text1: "Не удалось добавить", position: "top" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.centerWrap}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.centerCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Добавить участников</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          <Text style={styles.groupName}>{groupName}</Text>

          {/* List */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Загрузка…</Text>
            </View>
          ) : members.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.muted} />
              <Text style={styles.emptyText}>Нет доступных участников</Text>
            </View>
          ) : (
            <FlatList
              style={{ marginTop: 10, maxHeight: 300 }}
              data={members}
              keyExtractor={(m) => String(m.id)}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.line }} />}
              renderItem={({ item }) => {
                const fullName = `${item.lastName || ""} ${item.firstName || ""}`.trim();
                const selected = selectedIds.has(item.id);
                return (
                  <View style={styles.memberRow}>
                    <Text style={styles.memberName}>
                      #{item.id} {fullName || "-"}
                    </Text>

                    <Pressable
                      onPress={() => toggleSelect(item.id)}
                      style={[
                        styles.selectBtn,
                        selected && styles.selectBtnActive,
                      ]}
                      android_ripple={{ color: "#e5e7eb", radius: 20 }}
                    >
                      <Text
                        style={[
                          styles.selectText,
                          selected && styles.selectTextActive,
                        ]}
                      >
                        {selected ? "Выбран" : "Выбрать"}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.counter}>{countSelected} выбрано</Text>
            <View style={{ flex: 1 }} />
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Отмена</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!hasSelection || submitting}
              style={[styles.saveBtn, (!hasSelection || submitting) && { opacity: 0.5 }]}
            >
              <Text style={styles.saveText}>{submitting ? "Сохранение…" : "Сохранить"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  centerCard: {
    width: "90%", maxWidth: 480, borderRadius: 16, backgroundColor: COLORS.cardBg,
    borderWidth: 1, borderColor: COLORS.line, padding: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 8 },
    }),
  },
  header: { flexDirection: "row", justifyContent: "space-between" },
  title: { color: COLORS.title, fontWeight: "800", fontSize: 18 },
  groupName: { marginTop: 4, fontWeight: "600", color: COLORS.text },

  loadingWrap: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  loadingText: { color: COLORS.muted },

  emptyWrap: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  emptyText: { color: COLORS.muted },

  memberRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8,
  },
  memberName: { color: COLORS.text },

  selectBtn: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.primary,
  },
  selectBtnActive: { backgroundColor: COLORS.primary },
  selectText: { color: COLORS.primary, fontWeight: "700" },
  selectTextActive: { color: "#fff" },

  footer: { marginTop: 12, flexDirection: "row", alignItems: "center" },
  counter: { color: COLORS.muted, fontWeight: "700" },
  cancelBtn: { marginLeft: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.line },
  cancelText: { color: COLORS.text, fontWeight: "700" },
  saveBtn: { marginLeft: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.primary },
  saveText: { color: "#fff", fontWeight: "800" },
});
