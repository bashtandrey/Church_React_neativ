import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllUserWithoutMember } from "@/api/membersAPI";

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#ef4444",
};

export default function AssignUserModal({
  visible,
  onClose,
  onSubmit,
  member,
}) {
  const [memberId, setMemberId] = useState(null);
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (visible) {
      setMemberId(member?.id || null);
      setSelectedUser(null);
      setSearch("");
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await fetchAllUserWithoutMember();
      setUsers(list);
      setFiltered(list);
    } catch (e) {
      setErr(e?.message || "Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setFiltered(users);
      return;
    }
    const lower = text.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.userLogin.toLowerCase().includes(lower) ||
          u.userEmail.toLowerCase().includes(lower) ||
          u.userName.toLowerCase().includes(lower)
      )
    );
  };

  const handleSave = async () => {
    try {
      const payload = {
        memberId: memberId,
        userId: selectedUser,
      };
      await onSubmit?.({ data: payload });
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Ошибка при сохранении");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Удалить пользователя",
      "Вы уверены, что хотите отвязать пользователя от этого члена?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              const payload = {
                memberId: memberId,
                userId: null, // 👈 сброс связи
              };
              await onSubmit?.({ data: payload });
              onClose?.();
            } catch (e) {
              setErr(e?.message || "Ошибка при отвязке пользователя");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const active = selectedUser === item.userId;
    return (
      <Pressable
        onPress={() => setSelectedUser(item.userId)}
        style={[styles.userCard, active && styles.userCardActive]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.userName, active && styles.activeText]}>
            {item.userName}
          </Text>
          <Text style={styles.userLogin}>{item.userLogin}</Text>
          <Text style={styles.userEmail}>{item.userEmail}</Text>
        </View>
        {active && (
          <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
        )}
      </Pressable>
    );
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
            <Text style={styles.title}>Назначить пользователя</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Member info */}
          {member && (
            <View style={styles.memberBox}>
              <Text style={styles.memberText}>
                Член: {member.firstName} {member.lastName}
              </Text>
              {member.phone ? (
                <Text style={styles.memberPhone}>Тел: {member.phone}</Text>
              ) : null}
            </View>
          )}

          {/* Search */}
          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Поиск по имени, логину или email"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />

          {/* Count */}
          <Text style={styles.count}>Найдено: {filtered.length}</Text>

          {/* List */}
          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : err ? (
              <Text style={styles.error}>{err}</Text>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.userId)}
                renderItem={renderItem}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                  <Text style={styles.noUsers}>
                    Нет доступных пользователей
                  </Text>
                }
              />
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Отмена</Text>
            </Pressable>

            {member?.userMap && (
              <Pressable onPress={handleDelete} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>Удалить</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleSave}
              disabled={!selectedUser}
              style={[
                styles.submitBtn,
                !selectedUser && styles.submitDisabled,
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
  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  centerCard: {
    flex: 1,
    marginHorizontal: 20,
    maxWidth: 420,
    maxHeight: "85%",
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    flexShrink: 1,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: COLORS.title, fontWeight: "800", fontSize: 18 },

  memberBox: { marginTop: 8, marginBottom: 10 },
  memberText: { fontWeight: "700", color: COLORS.text },
  memberPhone: { color: COLORS.muted, fontSize: 12 },

  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 6,
    color: COLORS.text,
  },
  count: { marginTop: 6, fontSize: 12, color: COLORS.muted },

  body: { flex: 1, marginTop: 8 },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  userCardActive: { backgroundColor: "#E8F0FE", borderColor: "#C7DBFF" },
  userName: { fontWeight: "700", color: COLORS.text },
  userLogin: { color: COLORS.muted, fontSize: 12 },
  userEmail: { color: COLORS.muted, fontSize: 12 },
  activeText: { color: COLORS.primary },

  noUsers: { textAlign: "center", marginTop: 20, color: COLORS.muted },

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

  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
  },
  deleteText: { color: "#fff", fontWeight: "800" },

  submitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontWeight: "800" },
});