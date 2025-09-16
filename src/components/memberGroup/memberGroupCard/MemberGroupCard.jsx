import React, { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles, { COLORS } from "./MemberGroupCardStyles";
import ModalTrigger from "@/components/common/ModalTrigger";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import SaveGroupModal from "@/components/memberGroup/modals/SaveGroupModal";
import ChangeLeaderModal from "@/components/memberGroup/modals/ChangeLeaderModal";
import AddMemberModal from "@/components/memberGroup/modals/AddMemberModal";

import { Alert } from "react-native";

import Toast from "react-native-toast-message";

import {
  addedMembersInGroup,
  editMemberGroup,
  deleteMemberGroup,
  setLeader,
  deleteMember,
} from "@/api/memberGroupAPI";
const MemberGroupCard = ({ group, loadData, expanded, onToggle }) => {
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded = expanded ?? localExpanded;

  const leader = group?.leader || null;
  const leaderId = leader?.id ?? null;
  const guard = useReviewerGuard();

  const leaderName = useMemo(() => {
    const a = (leader?.firstName || "").trim();
    const b = (leader?.lastName || "").trim();
    return [b, a].filter(Boolean).join(" ") || "-"; // Фамилия Имя
  }, [leader?.firstName, leader?.lastName]);

  const leaderPhone = leader?.phone || "-";

  // Участники: лидер всегда первым, остальные — по Фамилия, Имя
  const membersSorted = useMemo(() => {
    const src = Array.isArray(group?.members) ? group.members : [];
    const others = src
      .filter((m) => m && m.id !== leaderId)
      .slice()
      .sort(
        (a, b) =>
          (a?.lastName || "").localeCompare(b?.lastName || "", undefined, {
            sensitivity: "base",
          }) ||
          (a?.firstName || "").localeCompare(b?.firstName || "", undefined, {
            sensitivity: "base",
          })
      )
      .map((m) => ({ ...m, __isLeader: false }));

    if (leaderId) {
      const leaderEntry = { ...leader, __isLeader: true };
      return [leaderEntry, ...others];
    }
    return others;
  }, [group?.members, leaderId, leader]);

  const hasMembers = Array.isArray(group?.members) && group.members.length > 0; // для скрытия Delete
  const count = membersSorted.length;

  const initials = useMemo(() => {
    const src = (group?.name || leaderName || "?").trim();
    return (src.charAt(0) || "?").toUpperCase();
  }, [group?.name, leaderName]);

  const toggle = () => {
    const next = !isExpanded;
    if (onToggle) onToggle(group.id, next);
    else setLocalExpanded(next);
  };

  const onEditGroup = async (group) => {
    const response = await editMemberGroup(group?.id, group?.name);
    if (response?.ok) {
      loadData();
      Toast.show({
        type: "success",
        text1: "Edit id " + group?.id,
        text2: group?.name || "",
        position: "top",
      });
    }
  };
  const onChangeLeader = async (data) => {
    const { groupId, leaderId } = data;
    console.log("Change leader:", groupId, leaderId);
    const response = await setLeader(groupId, leaderId);
    if (response?.ok) {
      loadData();
      Toast.show({
        type: "info",
        text1: "Change leader",
        position: "top",
      });
    }
  };
  const onDeleteMember = (group, member) => {
    const fullName = `${member?.lastName ?? ""} ${
      member?.firstName ?? ""
    }`.trim();
    Alert.alert(
      "Удалить участника?",
      fullName
        ? `${fullName} из «${group?.name ?? ""}»`
        : "Подтвердите удаление",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => actuallyDeleteMember(group.id, member.id),
        },
      ]
    );
  };
  const actuallyDeleteMember = async (groupId, memberId) => {
    try {
      const response = await deleteMember(groupId, memberId);
      if (!response?.ok) throw new Error("Не удалось удалить");
      await loadData();
      Toast.show({ type: "info", text1: "Member deleted", position: "top" });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Ошибка удаления",
        text2: e.message,
        position: "top",
      });
    }
  };
  const onAddMembers = async (data) => {
  const response = await addedMembersInGroup(data);
    if (response?.ok) {
      loadData();
      Toast.show({
        type: "success",
        text1: "Added members for group",
        position: "top",
      });
    }
  };
  const onDeleteGroup = async (group) => {
    const response = await deleteMemberGroup(group?.id);
    if (response?.ok) {
      loadData();
      Toast.show({
        type: "success",
        text1: "Delete group?",
        text2: group?.name || "",
        position: "top",
      });
    }
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [
          styles.headerRow,
          pressed && { opacity: 0.85 },
        ]}
        android_ripple={{ color: "#e5e7eb" }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.headerTextArea}>
          <View style={styles.titleLine}>
            <Text style={styles.idText}>#{group.id}</Text>
            <Text style={styles.dot}> · </Text>
            <Text style={styles.title}>{group.name}</Text>
          </View>

          <View style={styles.subLine}>
            <Ionicons
              name="person-circle-outline"
              size={14}
              color={COLORS.muted}
            />
            <Text style={styles.subText} numberOfLines={1}>
              {leaderName}
            </Text>
            <Text style={styles.dot}> · </Text>
            <Ionicons name="call-outline" size={14} color={COLORS.muted} />
            <Text style={styles.subText}>{leaderPhone}</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View style={styles.counterChip}>
            <Ionicons name="people-outline" size={14} color={COLORS.primary} />
            <Text style={styles.counterText}>{count}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.muted}
          />
        </View>
      </Pressable>

      {/* ACTIONS */}
      <View style={styles.actionsRow}>
        <ModalTrigger
          opener={(open) => (
            <Pressable
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => guard(open)}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              <MaterialIcons name="edit" size={20} color={COLORS.text} />
              <Text style={styles.iconLabel}>Edit</Text>
            </Pressable>
          )}
        >
          {({ close }) => (
            <SaveGroupModal
              visible
              onClose={close}
              idMemberGroup={group.id}
              groupName={group.name}
              onSubmit={onEditGroup}
            />
          )}
        </ModalTrigger>

        <ModalTrigger
          opener={(open) => (
            <Pressable
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => guard(open)}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              <MaterialIcons name="swap-horiz" size={20} color={COLORS.text} />
              <Text style={styles.iconLabel}>Change leader</Text>
            </Pressable>
          )}
        >
          {({ close }) => (
            <ChangeLeaderModal
              visible
              onClose={close}
              onSubmit={onChangeLeader}
              groupId={group.id}
              groupName={group.name}
              leader={group.leader}
            />
          )}
        </ModalTrigger>

        <ModalTrigger
          opener={(open) => (
            <Pressable
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => guard(open)}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              <MaterialIcons name="group-add" size={20} color={COLORS.text} />
              <Text style={styles.iconLabel}>Members</Text>
            </Pressable>
          )}
        >
          {({ close }) => (
            <AddMemberModal
              visible
              onClose={close}
              onSubmit={onAddMembers}
              groupId={group.id}
              groupName={group.name}
            />
          )}
        </ModalTrigger>

        {/* Удаление группы скрыто, если есть участники */}
        {!hasMembers && (
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => onDeleteGroup?.(group)}
            android_ripple={{ color: "#fee2e2", radius: 24 }}
          >
            <MaterialIcons name="delete" size={20} color={COLORS.danger} />
            <Text style={[styles.iconLabel, { color: COLORS.danger }]}>
              Delete
            </Text>
          </Pressable>
        )}
      </View>

      {/* MEMBERS — только в раскрытом виде */}
      {isExpanded &&
        (count > 0 ? (
          <View style={styles.membersBox}>
            <FlatList
              data={membersSorted}
              keyExtractor={(m, idx) => String(m?.id ?? `x${idx}`)}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const isLeader = !!item.__isLeader;
                const fullName = [item?.lastName, item?.firstName]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <View
                    style={[
                      styles.memberRow,
                      isLeader && styles.memberRowLeader,
                    ]}
                  >
                    <View style={styles.memberLeft}>
                      <Ionicons
                        name={isLeader ? "star" : "person-outline"}
                        size={16}
                        color={isLeader ? COLORS.leaderIcon : COLORS.muted}
                      />
                      <Text
                        style={[
                          styles.memberName,
                          isLeader && styles.memberNameLeader,
                        ]}
                        numberOfLines={1}
                      >
                        {fullName || "-"}
                      </Text>
                    </View>

                    <View style={styles.memberRight}>
                      <Ionicons
                        name="call-outline"
                        size={14}
                        color={COLORS.muted}
                      />
                      <Text style={styles.memberPhone}>
                        {item?.phone || "-"}
                      </Text>

                      {/* удалить участника — скрыто на лидере */}
                      {!isLeader && (
                        <Pressable
                          style={({ pressed }) => [
                            styles.memberDelBtn,
                            pressed && { opacity: 0.7 },
                          ]}
                          onPress={() => onDeleteMember?.(group, item)}
                          android_ripple={{ color: "#fee2e2", radius: 18 }}
                        >
                          <MaterialIcons
                            name="delete"
                            size={18}
                            color={COLORS.danger}
                          />
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View style={styles.membersEmpty}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.muted}
            />
            <Text style={styles.emptyText}>No members yet</Text>
          </View>
        ))}
    </View>
  );
};

export default MemberGroupCard;
