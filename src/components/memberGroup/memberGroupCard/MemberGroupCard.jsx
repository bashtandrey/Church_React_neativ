import React, { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles, { COLORS } from "./MemberGroupCardStyles";
import ModalTrigger from "@/components/common/ModalTrigger";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import SaveGroupModal from "@/components/memberGroup/modals/SaveGroupModal";
import Toast from "react-native-toast-message";

import {
  editMemberGroup,
  deleteMemberGroup,
} from "@/api/memberGroupAPI";
const MemberGroupCard = ({
  group,
  loadData,
  expanded,
  onToggle,
}) => {
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
    loadData();
    if (response?.ok) {
      Toast.show({
        type: "success",
        text1: "Edit id " + group?.id,
        text2: group?.name || "",
        position: "top",
      });
    }
  };
  const onChangeLeader = async(group) => {
    console.log("Change leader for:", group);
    Toast.show({
      type: "info",
      text1: "Change leader",
      text2: group?.name || "",
      position: "top",
    });
    // TODO: открыть модалку выбора лидера
  };

  const onManageMembers = async(group) => {
    console.log("Manage members for:", group);
    Toast.show({
      type: "info",
      text1: "Members manager",
      text2: group?.name || "",
      position: "top",
    });
    // TODO: открыть менеджер участников
  };

  const onDeleteGroup = async (group) => {
    const response = await deleteMemberGroup(group?.id);
    loadData();
    if (response?.ok) {
      await loadData();
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
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          onPress={() => onChangeLeader?.(group)}
          android_ripple={{ color: "#e5e7eb", radius: 24 }}
        >
          <MaterialIcons name="swap-horiz" size={20} color={COLORS.text} />
          <Text style={styles.iconLabel}>Change leader</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          onPress={() => onManageMembers?.(group)}
          android_ripple={{ color: "#e5e7eb", radius: 24 }}
        >
          <MaterialIcons name="group-add" size={20} color={COLORS.text} />
          <Text style={styles.iconLabel}>Members</Text>
        </Pressable>

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
