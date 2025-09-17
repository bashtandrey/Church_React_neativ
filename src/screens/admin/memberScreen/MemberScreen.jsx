import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MemberList from "@/components/member/memberList/MemberList";
import Layout from "@/components/Layout";
import styles, { COLORS } from "./MemberScreenStyles";

import Toast from "react-native-toast-message";
import ModalTrigger from "@/components/common/ModalTrigger";
import SaveMemberModal from "@/components/member/modals/SaveMemberModal";
import { fetchAllMembers, createMember } from "@/api/membersAPI";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const MemberScreen = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const guard = useReviewerGuard();
  const navigation = useNavigation();

  const handleCreateSubmit = async ({ data }) => {
    const response = await createMember(data);
    if (response?.ok) {
      loadData();
      Toast.show({ type: "success", text1: "Готово", text2: "Член создан" });
    }
  };

  const loadData = useCallback(() => {
    setLoading(true);
    return fetchAllMembers()
      .then((res) => setMembers(Array.isArray(res) ? res : []))
      .catch((error) => {
        const message = error?.message || "Ошибка при загрузке членов";
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

  const filteredMembers = useMemo(() => {
    let list = [...members];

    // 🔹 фильтр по статусу
    if (statusFilter === "NO_USER") {
      list = list.filter((m) => !m?.userMap);
    } else if (statusFilter === "NO_GROUP") {
      list = list.filter((m) => !m?.groupId);
    }

    // 🔹 фильтр по поиску
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => {
        const hay = [
          m?.firstName,
          m?.lastName,
          m?.phone,
          m?.userMap?.userName,
          m?.userMap?.userLogin,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    // 🔹 сортировка по ФИО
    return list.sort((a, b) => {
      const nameA = `${a?.lastName || ""} ${a?.firstName || ""}`.trim().toLowerCase();
      const nameB = `${b?.lastName || ""} ${b?.firstName || ""}`.trim().toLowerCase();
      return nameA.localeCompare(nameB, "ru");
    });
  }, [members, search, statusFilter]);

  return (
    <Layout>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Members</Text>

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
              {({ close }) => (
                <SaveMemberModal
                  visible
                  onClose={close}
                  onSubmit={handleCreateSubmit}
                />
              )}
            </ModalTrigger>
          </View>

          {/* FILTERS */}
          <View style={styles.filtersRow}>
            {[
              { key: "ALL", label: "All" },
              { key: "NO_USER", label: "No User" },
              { key: "NO_GROUP", label: "No Group" },
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
                placeholder="Search by name, phone, user login"
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
              {filteredMembers.length} of {members.length}
            </Text>
          </View>

          {/* LIST */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading members…</Text>
            </View>
          ) : (
            <MemberList contentData={filteredMembers} reLoad={loadData} />
          )}
        </View>
      </SafeAreaView>
    </Layout>
  );
};

export default MemberScreen;