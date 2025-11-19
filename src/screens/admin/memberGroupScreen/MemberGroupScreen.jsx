import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import MemberGroupList from "@/components/memberGroup/memberGroupList/MemberGroupList";
import styles, { COLORS } from "./MemberGroupScreenStyles";

import Toast from "react-native-toast-message";
import ModalTrigger from "@/components/common/ModalTrigger";
import SaveGroupModal from "@/components/memberGroup/modals/SaveGroupModal";

import { fetchAllMemberGroup, createMemberGroup } from "@/api/memberGroupAPI";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
const MemberGroupScreen = () => {
  const [memberGroups, setMemberGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const guard = useReviewerGuard();
  const navigation = useNavigation();

  const handleCreateSubmit = async ({ name }) => {
    const response = await createMemberGroup(name);
    if (response?.ok) {
      await loadData();
      Toast.show({ type: "success", text1: "Готово", text2: "Группа создана" });
    }
  };

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

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Member Group</Text>

        <View style={styles.headerRow}>
          <ModalTrigger
            opener={(open) => (
              <Pressable
                onPress={() => guard(open)}
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
            {({ visible, close }) => (
              <SaveGroupModal
                visible={visible}
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
              <Ionicons name="close-circle" size={18} color={COLORS.muted} />
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
        <MemberGroupList contentData={filteredGroups} reLoad={loadData} />
      )}
    </View>
  );
};

export default MemberGroupScreen;
