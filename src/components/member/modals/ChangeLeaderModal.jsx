import React, { useEffect, useState, useMemo } from "react";
import {
  Modal, View, Text, Pressable, FlatList, StyleSheet, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { getMembersForLeader } from "@/api/memberGroupAPI";

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#DC2626",
  success: "#16A34A",
};

const NONE = { id: null, firstName: "", lastName: "— Без лидера —", hasGroup: false, __none: true };

export default function ChangeLeaderModal({
  visible,
  onClose,
  onSubmit,
  groupId,
  groupName,
  leader,
}) {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState([]);

  const loadMembers = async () => {
    try {
      const leaderId = leader?.id ?? null;
      const data = await getMembersForLeader(groupId); // если API принимает id группы — передай
      const filtered = (Array.isArray(data) ? data : [])
        .filter((m) => m && m.id !== leaderId) // исключаем текущего лидера
        .sort((a, b) =>
          (a?.lastName || "").localeCompare(b?.lastName || "", undefined, { sensitivity: "base" }) ||
          (a?.firstName || "").localeCompare(b?.firstName || "", undefined, { sensitivity: "base" })
        );
      setMembers(filtered);
    } catch (error) {
      const message = error?.message || "Ошибка при загрузке участников";
      Toast.show({ type: "error", text1: "Ошибка!", text2: message, position: "top" });
    }
  };

  useEffect(() => {
    if (visible) {
      setSelected(null);
      setSubmitting(false);
      loadMembers();
    }
  }, [visible]);

  const dataForList = useMemo(() => [NONE, ...members], [members]);

  const handleSelect = (member) => {
    if (!member.__none && member.hasGroup) return; // занят в другой группе
    setSelected(member);
  };

  const handleSave = async () => {
    if (!selected) return; // ничего не выбрано
    setSubmitting(true);
    try {
      await onSubmit?.({
        groupId,
        leaderId: selected.__none ? null : selected.id, // <<< отправляем null для «Без лидера»
      });
      onClose?.();
    } catch (e) {
      console.error("Ошибка при смене лидера:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentLeaderName = [leader?.lastName, leader?.firstName].filter(Boolean).join(" ") || "— не назначен —";

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.centerWrap}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.centerCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Смена лидера группы</Text>
            <Pressable onPress={onClose}><Ionicons name="close" size={22} color={COLORS.muted} /></Pressable>
          </View>

          <Text style={styles.groupName}>{groupName}</Text>

          <View style={styles.currentLeaderRow}>
            <Text style={styles.currentLeaderLabel}>Текущий лидер:</Text>
            <Text style={styles.currentLeaderValue}>{currentLeaderName}</Text>
            {!!leader?.id && (
              <Pressable
                onPress={() => setSelected(NONE)}
                style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.85 }]}
                android_ripple={{ color: "#e5e7eb" }}
              >
                <Ionicons name="remove-circle-outline" size={16} color={COLORS.primary} />
                <Text style={styles.clearBtnText}>Снять лидера</Text>
              </Pressable>
            )}
          </View>

          {/* List of members (+ пункт «Без лидера») */}
          <FlatList
            style={{ marginTop: 10, maxHeight: 260 }}
            data={dataForList}
            keyExtractor={(m, i) => (m.__none ? "none" : String(m.id))}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.line }} />}
            renderItem={({ item }) => {
              const fullName = item.__none
                ? item.lastName
                : `${item.lastName || ""} ${item.firstName || ""}`.trim();
              const isSelected = selected?.__none ? item.__none : selected?.id === item.id;
              const disabled = !item.__none && item.hasGroup;

              return (
                <View style={[styles.memberRow, item.__none && styles.noneRow]}>
                  <Text style={[styles.memberName, item.__none && styles.noneName]}>
                    {item.__none ? "" : `#${item.id} `}{fullName || "-"}
                  </Text>

                  {!item.__none && disabled && <Text style={styles.memberBusy}>занят</Text>}

                  <Pressable
                    disabled={disabled}
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.selectBtn,
                      isSelected && styles.selectBtnActive,
                      disabled && styles.selectBtnDisabled,
                    ]}
                    android_ripple={{ color: "#e5e7eb", radius: 20 }}
                  >
                    <Text
                      style={[
                        styles.selectText,
                        isSelected && styles.selectTextActive,
                        disabled && styles.selectTextDisabled,
                      ]}
                    >
                      {isSelected ? "Выбран" : item.__none ? "Никого" : "Выбрать"}
                    </Text>
                  </Pressable>
                </View>
              );
            }}
          />

          {/* Итог выбора */}
          {selected && (
            <View style={styles.selectionBox}>
              <Text style={styles.selectionText}>
                Будет смена:{" "}
                <Text style={{ fontWeight: "700" }}>{currentLeaderName}</Text>
                {"  →  "}
                <Text style={{ fontWeight: "700", color: COLORS.primary }}>
                  {selected.__none
                    ? "Без лидера"
                    : `${selected.lastName || ""} ${selected.firstName || ""}`.trim()}
                </Text>
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Отмена</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!selected || submitting}
              style={[styles.saveBtn, (!selected || submitting) && { opacity: 0.5 }]}
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
    width: "90%", maxWidth: 420, borderRadius: 16, backgroundColor: COLORS.cardBg,
    borderWidth: 1, borderColor: COLORS.line, padding: 14,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 8 },
    }),
  },
  header: { flexDirection: "row", justifyContent: "space-between" },
  title: { color: COLORS.title, fontWeight: "800", fontSize: 18 },
  groupName: { marginTop: 4, fontWeight: "600", color: COLORS.text },

  currentLeaderRow: { marginTop: 6, flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  currentLeaderLabel: { color: COLORS.text },
  currentLeaderValue: { color: COLORS.text, fontWeight: "700" },
  clearBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.line, backgroundColor: "#F9FBFF" },
  clearBtnText: { color: COLORS.primary, fontWeight: "800" },

  memberRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  noneRow: { backgroundColor: "#F8FAFF", borderRadius: 8, paddingHorizontal: 6 },
  memberName: { color: COLORS.text },
  noneName: { color: COLORS.primary, fontWeight: "800" },
  memberBusy: { color: COLORS.danger, fontSize: 12 },

  selectBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary },
  selectBtnActive: { backgroundColor: COLORS.primary },
  selectBtnDisabled: { opacity: 0.5 },
  selectText: { color: COLORS.primary, fontWeight: "700" },
  selectTextActive: { color: "#fff" },
  selectTextDisabled: { color: COLORS.muted },

  selectionBox: { marginTop: 10, padding: 8, backgroundColor: "#EFF6FF", borderRadius: 8 },
  selectionText: { color: COLORS.text },

  footer: { marginTop: 12, flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.line },
  cancelText: { color: COLORS.text, fontWeight: "700" },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.primary },
  saveText: { color: "#fff", fontWeight: "800" },
});