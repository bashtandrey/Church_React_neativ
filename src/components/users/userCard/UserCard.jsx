import { useMemo, useState } from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles, { COLORS } from "./UserCardStyles";
import { toggleStatus } from "@/api/userAPI";
import Toast from "react-native-toast-message";

import EditNameModal from "./actionUser/editNameModal/EditNameModal";
import EmailActionModal from "./actionUser/emailActionModal/EmailActionModal";
import ChangePasswordModal from "./actionUser/changePasswordModal/ChangePasswordModal";
import DeleteUserModal from "./actionUser/deleteUserModal/DeleteUserModal";
import RolesModal from "./actionUser/rolesModal/RolesModal";

const UserCard = ({ user, reLoad }) => {
  const [isEditNameVisible, setEditNameVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [rolesModalVisible, setRolesModalVisible] = useState(false);

  const {
    id,
    login,
    firstName,
    lastName,
    email,
    emailVerified,
    enabled,
    roles = [],
    memberDTO,
    superUser,
  } = user;

  // Инициалы: memberDTO > user > login
  const initials = useMemo(() => {
    const a = (memberDTO?.firstName ?? firstName ?? "").trim().charAt(0);
    const b = (memberDTO?.lastName ?? lastName ?? "").trim().charAt(0);
    const base = (a + b).trim() || (login ?? "").trim().charAt(0) || "?";
    return base.toUpperCase();
  }, [memberDTO?.firstName, memberDTO?.lastName, firstName, lastName, login]);

  const onToggleEnabled = () => {
    if (superUser) return;
    toggleStatus({
      id,
      onSuccess: () => reLoad(),
      onError: (msg) =>
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: msg || "Ошибка при изменении статуса",
          position: "top",
        }),
    });
  };

  const canEditRoles = !!memberDTO && !superUser;
  const deleteDisabled = !!superUser || !!memberDTO; // показываем всегда, но блокируем для суперпользователя

  return (
    <View style={styles.card}>
      {/* Header: avatar + basic info + status */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.headerTextArea}>
          <Text style={styles.titleLine}>
            <Text style={styles.idText}>#{id}</Text>
            <Text style={styles.dot}> · </Text>
            <Text style={styles.loginText}>{login}</Text>
            {superUser && <Text style={styles.superShield}> 🛡️</Text>}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.emailBadge,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => !superUser && setEmailModalVisible(true)}
            disabled={superUser}
            android_ripple={{ color: "#e5e7eb" }}
          >
            <Ionicons
              name={emailVerified ? "checkmark-circle" : "alert-circle"}
              size={14}
              color={emailVerified ? COLORS.success : COLORS.warn}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.emailText} numberOfLines={1}>
              {email}
            </Text>
          </Pressable>
        </View>

        <View style={styles.statusCol}>
          <Text style={styles.statusLabel}>
            {enabled ? "Active" : "Blocked"}
          </Text>
          <Switch
            value={!!enabled}
            onValueChange={onToggleEnabled}
            disabled={superUser}
          />
        </View>
      </View>

      {/* Name row (tap to edit) */}
      <EditNameModal
        visible={isEditNameVisible}
        onClose={() => setEditNameVisible(false)}
        user={user}
        reLoad={reLoad}
      />
      <Pressable
        onPress={() => setEditNameVisible(true)}
        style={({ pressed }) => [styles.nameRow, pressed && { opacity: 0.85 }]}
        android_ripple={{ color: "#e5e7eb" }}
      >
        <Ionicons name="person-circle-outline" size={18} color={COLORS.muted} />
        <Text style={styles.nameText}>
          {memberDTO?.firstName ?? firstName ?? "-"}{" "}
          {memberDTO?.lastName ?? lastName ?? ""}
        </Text>
        <Text style={styles.editHint}>Edit</Text>
      </Pressable>

      {/* Полный контент Member */}
      {memberDTO && (
        <View style={styles.detailsBox}>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsKey}>Member ID</Text>
            <Text style={styles.detailsVal}>{memberDTO?.id ?? "—"}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsKey}>Birthday</Text>
            <Text style={styles.detailsVal}>{memberDTO?.birthday ?? "—"}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsKey}>Gender</Text>
            <Text style={styles.detailsVal}>{memberDTO?.gender ?? "—"}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsKey}>Phone</Text>
            <Text style={styles.detailsVal}>{memberDTO?.phone ?? "—"}</Text>
          </View>
        </View>
      )}

      {/* Roles */}
      <RolesModal
        visible={rolesModalVisible}
        onClose={() => setRolesModalVisible(false)}
        user={user}
        reLoad={reLoad}
        canEdit={canEditRoles}
      />
      <Pressable
        onPress={() => canEditRoles && setRolesModalVisible(true)}
        style={({ pressed }) => [
          styles.rolesWrap,
          pressed && canEditRoles && { opacity: 0.95 },
          !canEditRoles && { opacity: 0.5 },
        ]}
        android_ripple={canEditRoles ? { color: "#e5e7eb" } : undefined}
        disabled={!canEditRoles}
      >
        {roles.length === 0 ? (
          <Text style={styles.emptyRoles}>No roles</Text>
        ) : (
          roles.map((r) => (
            <View key={r} style={styles.roleChip}>
              <Text style={styles.roleText}>{r}</Text>
            </View>
          ))
        )}
      </Pressable>

      {!canEditRoles && (
        <Text style={styles.rolesHint}>Attach member to edit roles</Text>
      )}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <ChangePasswordModal
          visible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          user={user}
          reLoad={reLoad}
        />
        <EmailActionModal
          user={user}
          visible={emailModalVisible}
          onClose={() => setEmailModalVisible(false)}
          reLoad={reLoad}
        />
        <DeleteUserModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          user={user}
          reLoad={reLoad}
        />

        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          onPress={() => setPasswordModalVisible(true)}
          android_ripple={{ color: "#e5e7eb", radius: 24 }}
        >
          <MaterialIcons name="lock-reset" size={22} color={COLORS.text} />
          <Text style={styles.iconLabel}>Password</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconBtn,
            deleteDisabled && styles.iconBtnDisabled,
            pressed && { opacity: 0.6 },
          ]}
          onPress={() => !deleteDisabled  && setDeleteModalVisible(true)}
          disabled={deleteDisabled}
          android_ripple={
            !deleteDisabled ? { color: "#fee2e2", radius: 24 } : undefined
          }
        >
          <MaterialIcons name="delete" size={22} color={COLORS.danger} />
          <Text
            style={[
              styles.iconLabel,
              { color: COLORS.danger },
              deleteDisabled && styles.iconLabelDisabled,
            ]}
          >
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserCard;
