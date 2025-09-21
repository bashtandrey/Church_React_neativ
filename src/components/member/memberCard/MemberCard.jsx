import React, { useMemo } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles, { COLORS } from "./MemberCardStyles";
import ModalTrigger from "@/components/common/ModalTrigger";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import Toast from "react-native-toast-message";
import SaveMemberModal from "@/components/member/modals/SaveMemberModal";
import AssignHierarchyModal from "@/components/member/modals/AssignHierarchyModal";
import AssignGroupModal from "@/components/member/modals/AssignGroupModal";
import AssignUserModal from "@/components/member/modals/AssignUserModal";

import {
  saveMember,
  deleteMember,
  assignHierarch,
  assignGroup,
} from "@/api/membersAPI";

const MemberCard = ({ member, loadData }) => {
  const guard = useReviewerGuard();

  const fullName = useMemo(() => {
    return (
      [member?.lastName, member?.firstName].filter(Boolean).join(" ") || "-"
    );
  }, [member?.lastName, member?.firstName]);

  const initials = useMemo(() => {
    const src = (fullName || "?").trim();
    return (src.charAt(0) || "?").toUpperCase();
  }, [fullName]);

  const handleSaveSubmit = async ({ data }) => {
    const response = await saveMember(data);
    if (response?.ok) {
      loadData();
      Toast.show({
        type: "success",
        text1: "Готово",
        text2: "Член отредактирован",
      });
    }
  };

  const handleAssignHierarchySubmit = async ({ data }) => {
    const response = await assignHierarch(data);
    if (response?.ok) {
      loadData();
      Toast.show({
        type: "success",
        text1: "Готово",
        text2: "Иерархия отредактирована",
      });
    }
  };
  const handleAssignGroupSubmit = async ({ data }) => {
    const response = await assignGroup(data);
    if (response?.ok) {
      loadData();
      Toast.show({
        type: "success",
        text1: "Готово",
        text2: "Группа отредактирована",
      });
    }
  };

  const onDeleteMember = () => {
    Alert.alert(
      "Удалить участника?",
      fullName ? fullName : "Подтвердите удаление",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              const resp = await deleteMember(member.id);
              if (!resp?.ok) throw new Error("Не удалось удалить");
              loadData();
              Toast.show({
                type: "info",
                text1: "Member deleted",
                position: "top",
              });
            } catch (e) {
              Toast.show({
                type: "error",
                text1: "Ошибка удаления",
                text2: e.message,
                position: "top",
              });
            }
          },
        },
      ]
    );
  };

  const hierarchyColor = (role) => {
    switch (role) {
      case "PASTOR":
        return "#7C3AED";
      case "ELDER":
        return "#2563EB";
      case "DEACON":
        return "#059669";
      default:
        return COLORS.muted;
    }
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.headerTextArea}>
          <View style={styles.titleLine}>
            <Text style={styles.idText}>#{member?.id}</Text>
            <Text style={styles.dot}> · </Text>
            <Text style={styles.title}>{fullName}</Text>
          </View>
        </View>
      </View>

      {/* INFO BLOCK */}
      {(member?.userMap || member?.groupId || member?.hierarchy) && (
        <View style={styles.memberInfoBox}>
          {/* User привязка */}
          {member?.userMap ? (
            <View style={styles.infoRow}>
              <Ionicons
                name="person-circle-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>
                User: #{member.userMap.userId} · {member.userMap.userName} (
                {member.userMap.userLogin})
              </Text>
            </View>
          ) : null}

          {/* Group */}
          {member?.groupId ? (
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={18} color={COLORS.muted} />
              <Text style={styles.infoText}>
                Group: {member.nameGroup || `#${member.groupId}`}
              </Text>
            </View>
          ) : null}

          {/* Hierarchy */}
          {member?.hierarchy ? (
            <View style={styles.infoRow}>
              <Ionicons
                name="ribbon-outline"
                size={18}
                color={hierarchyColor(member.hierarchy)}
              />
              <Text
                style={[
                  styles.infoText,
                  {
                    color: hierarchyColor(member.hierarchy),
                    fontWeight: "700",
                  },
                ]}
              >
                {member.hierarchy}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Contact + extra info */}
      {(member?.phone || member?.birthday || member?.gender) && (
        <View style={styles.detailsBox}>
          {member?.phone && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color={COLORS.muted} />
              <Text style={styles.detailText}>{member.phone}</Text>
            </View>
          )}
          {member?.birthday && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>🎂 {member.birthday}</Text>
            </View>
          )}
          {member?.gender && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>⚧ {member.gender}</Text>
            </View>
          )}
        </View>
      )}

      {/* ACTIONS */}
      <View style={styles.actionsRow}>
        {/* Edit */}
        <ModalTrigger
          opener={(open) => (
            <Pressable
              style={styles.iconBtn}
              onPress={() => guard(open)}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              <MaterialIcons name="edit" size={20} color={COLORS.text} />
              <Text style={styles.iconLabel}>Edit</Text>
            </Pressable>
          )}
        >
          {({ close }) => (
            <SaveMemberModal
              visible
              onClose={close}
              member={member}
              onSubmit={(data) => handleSaveSubmit(data)}
            />
          )}
        </ModalTrigger>

        {/* Add / Move group */}
        <ModalTrigger
          opener={(open) => (
            <Pressable
              style={styles.iconBtn}
              onPress={() => guard(open)}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              {member?.groupId ? (
                <>
                  <MaterialIcons
                    name="swap-horiz"
                    size={20}
                    color={COLORS.text}
                  />
                  <Text style={styles.iconLabel}>Move group</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="group-add"
                    size={20}
                    color={COLORS.text}
                  />
                  <Text style={styles.iconLabel}>Add group</Text>
                </>
              )}
            </Pressable>
          )}
        >
          {({ close }) => (
            <AssignGroupModal
              visible
              onClose={close}
              member={member} 
              onSubmit={(data) => handleAssignGroupSubmit(data)} 
            />
          )}
        </ModalTrigger>

        {/* Bind user (если нет userMap) */}
        {!member?.userMap && (
          <ModalTrigger
            opener={(open) => (
              <Pressable
                style={styles.iconBtn}
                onPress={() => guard(open)}
                android_ripple={{ color: "#e5e7eb", radius: 24 }}
              >
                <MaterialIcons
                  name="person-add"
                  size={20}
                  color={COLORS.text}
                />
                <Text style={styles.iconLabel}>Bind user</Text>
              </Pressable>
            )}
          >
            {({ close }) => (
              <AssignUserModal
                visible
                onClose={close}
                memberId={member.id}
                onSubmit={loadData}
              />
            )}
          </ModalTrigger>
        )}

        {/* Assign hierarchy */}
        <ModalTrigger
          opener={(open) => (
            <Pressable
              style={styles.iconBtn}
              onPress={() => guard(open)}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              <MaterialIcons
                name="military-tech"
                size={20}
                color={COLORS.text}
              />
              <Text style={styles.iconLabel}>Hierarchy</Text>
            </Pressable>
          )}
        >
          {({ close }) => (
            <AssignHierarchyModal
              visible
              onClose={close}
              member={member}
              onSubmit={(data) => handleAssignHierarchySubmit(data)}
            />
          )}
        </ModalTrigger>

        {/* Delete (если не в группе) */}
        {!member?.groupId && (
          <Pressable
            style={styles.iconBtn}
            onPress={onDeleteMember}
            android_ripple={{ color: "#fee2e2", radius: 24 }}
          >
            <MaterialIcons name="delete" size={20} color={COLORS.danger} />
            <Text style={[styles.iconLabel, { color: COLORS.danger }]}>
              Delete
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default MemberCard;
