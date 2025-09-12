import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  TextInput,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import UserListCard from "@/components/users/userListCard/UserListCard";
import UserCreateForm from "@/components/users/userCreateForm/UserCreateForm";
import Layout from "@/components/Layout";
import styles, { COLORS } from "./AdminScreenStyles";

import Toast from "react-native-toast-message";
import { fetchUsers } from "@/api/userAPI";
import { useUser } from "@/context/UserContext";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isAdmin } = useUser();
  const guard = useReviewerGuard();
  const navigation = useNavigation();

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | BLOCKED | UNVERIFIED

  const loadData = () => {
    setLoading(true);
    return fetchUsers()
      .then((res) => setUsers(Array.isArray(res) ? res : []))
      .catch((error) => {
        const message = error?.message || "Ошибка при загрузке пользователей";
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: message,
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace("Home");
    }
  }, [isAdmin, navigation]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => {
        if (statusFilter === "ACTIVE" && !u.enabled) return false;
        if (statusFilter === "BLOCKED" && !!u.enabled) return false;
        if (statusFilter === "UNVERIFIED" && !!u.emailVerified) return false;
        return true;
      })
      .filter((u) => {
        if (!q) return true;
        const hay = [
          u.login,
          u.firstName,
          u.lastName,
          u.email,
          (u.roles || []).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
  }, [users, search, statusFilter]);

  const handleCreatePress = () => setShowCreateModal(true);

  return (
    <Layout>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Users</Text>

            <Pressable
              onPress={() => guard(() => handleCreatePress())}
              style={({ pressed }) => [
                styles.createBtn,
                pressed && styles.pressed,
              ]}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
              <Text style={styles.createBtnText}>Create</Text>
            </Pressable>
          </View>

          {/* SEARCH + FILTERS */}
          <View style={styles.controls}>
            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={18}
                color={COLORS.muted}
                style={{ marginRight: 6 }}
              />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search by name, email, login, role…"
                placeholderTextColor={COLORS.muted}
                style={styles.searchInput}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch("")}
                  hitSlop={8}
                  style={({ pressed }) => pressed && { opacity: 0.6 }}
                >
                  <Ionicons name="close-circle" size={18} color={COLORS.muted} />
                </Pressable>
              )}
            </View>

            <View style={styles.filtersRow}>
              {[
                { key: "ALL", label: "All" },
                { key: "ACTIVE", label: "Active" },
                { key: "BLOCKED", label: "Blocked" },
                { key: "UNVERIFIED", label: "Unverified" },
              ].map((chip) => {
                const active = chip.key === statusFilter;
                return (
                  <Pressable
                    key={chip.key}
                    onPress={() => setStatusFilter(chip.key)}
                    style={({ pressed }) => [
                      styles.chip,
                      active && styles.chipActive,
                      pressed && styles.pressed,
                    ]}
                    android_ripple={{ color: "#e5e7eb", radius: 24 }}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {chip.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.counterText}>
              {filteredUsers.length} of {users.length}
            </Text>
          </View>

          {/* LIST */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading users…</Text>
            </View>
          ) : (
            <UserListCard
              contentData={filteredUsers}
              reLoad={loadData}
            />
          )}
        </View>

        {/* CREATE MODAL */}
        <Modal visible={showCreateModal} animationType="slide" transparent>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalWrap}
          >
            <Pressable style={styles.backdrop} onPress={() => setShowCreateModal(false)} />
            <View style={styles.modalCard}>
              <UserCreateForm
                onClose={() => setShowCreateModal(false)}
                reLoad={loadData}
              />
              <Pressable
                onPress={() => setShowCreateModal(false)}
                style={({ pressed }) => [styles.modalCloseBtn, pressed && styles.pressed]}
                android_ripple={{ color: "#e5e7eb" }}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </Layout>
  );
};

export default AdminScreen;