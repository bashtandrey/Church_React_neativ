import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MemberGroupList from "@/components/memberGroup/memberGroupList/MemberGroupList";
import Layout from "@/components/Layout";
import styles, { COLORS } from "./MemberGroupScreenStyles";

import Toast from "react-native-toast-message";
import ModalTrigger from "@/components/common/ModalTrigger";
import CreateGroupModal from "@/components/memberGroup/modals/CreateGroupModal";

import { fetchAllMemberGroup } from "@/api/memberGroupAPI";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import { createMemberGroup } from "@/api/memberGroupAPI";
const MemberGroupScreen = () => {
  const [memberGroups, setMemberGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const guard = useReviewerGuard();
  const navigation = useNavigation();

  const handleCreateSubmit = async ({ name }) => {
    // await createMemberGroup(name);
    await loadData();
  };

  // UI state
  const [search, setSearch] = useState("");

  const loadData = useCallback(() => {
    setLoading(true);
    return fetchAllMemberGroup()
      .then((res) => setMemberGroups(Array.isArray(res) ? res : []))
      .catch((error) => {
        const message = error?.message || "Ошибка при загрузке групп";
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: message,
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Фильтр под новый формат
  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return memberGroups;
    return memberGroups.filter((g) => {
      const hay = [
        g?.name,
        g?.leader?.firstName,
        g?.leader?.lastName,
        g?.leader?.phone,
        ...(Array.isArray(g?.members)
          ? g.members.flatMap((m) => [m?.firstName, m?.lastName, m?.phone])
          : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [memberGroups, search]);

  // === Обработчики кнопок карточки (пока заглушки) ===
  const onEditGroup = useCallback((group) => {
    console.log("Edit group:", group);
    Toast.show({
      type: "info",
      text1: "Edit group",
      text2: group?.name || "",
      position: "top",
    });
    // TODO: открыть модалку редактирования
  }, []);

  const onDeleteGroup = useCallback((group) => {
    console.log("Delete group:", group);
    Toast.show({
      type: "info",
      text1: "Delete group?",
      text2: group?.name || "",
      position: "top",
    });
    // TODO: confirm + API + loadData()
  }, []);

  const onChangeLeader = useCallback((group) => {
    console.log("Change leader for:", group);
    Toast.show({
      type: "info",
      text1: "Change leader",
      text2: group?.name || "",
      position: "top",
    });
    // TODO: открыть модалку выбора лидера
  }, []);

  const onManageMembers = useCallback((group) => {
    console.log("Manage members for:", group);
    Toast.show({
      type: "info",
      text1: "Members manager",
      text2: group?.name || "",
      position: "top",
    });
    // TODO: открыть менеджер участников
  }, []);

  const onDeleteMember = useCallback((group, member) => {
    console.log("Delete member:", member, "from group:", group);
    Toast.show({
      type: "info",
      text1: "Delete member?",
      text2: `${member?.lastName || ""} ${member?.firstName || ""}`,
      position: "top",
    });
    // TODO: confirm + API + loadData()
  }, []);

  return (
    <Layout>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Member Group</Text>

            <View style={styles.headerRow}>
              <ModalTrigger
                opener={(open) => (
                  <Pressable
                    onPress={() => guard(open)} // <<< вот так вызываем модалку
                    style={({ pressed }) => [
                      styles.createBtn,
                      pressed && styles.pressed,
                    ]}
                    android_ripple={{ color: "#e5e7eb", radius: 24 }}
                  >
                    <Ionicons name="add" size={20} color={COLORS.primary} />
                    <Text style={styles.createBtnText}>Create</Text>
                  </Pressable>
                )}
              >
                {({ close }) => (
                  <CreateGroupModal
                    visible
                    onClose={close}
                    onSubmit={handleCreateSubmit}
                  />
                )}
              </ModalTrigger>
            </View>
          </View>

          {/* SEARCH + COUNTER */}
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
                placeholder="Search by group, leader, member, phone"
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
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={COLORS.muted}
                  />
                </Pressable>
              )}
            </View>

            <Text style={styles.counterText}>
              {filteredGroups.length} of {memberGroups.length}
            </Text>
          </View>

          {/* LIST */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading groups…</Text>
            </View>
          ) : (
            <MemberGroupList
              contentData={filteredGroups}
              reLoad={loadData}
              onEditGroup={onEditGroup}
              onDeleteGroup={onDeleteGroup}
              onChangeLeader={onChangeLeader}
              onManageMembers={onManageMembers}
              onDeleteMember={onDeleteMember}
            />
          )}
        </View>
      </SafeAreaView>
    </Layout>
  );
};

export default MemberGroupScreen;
