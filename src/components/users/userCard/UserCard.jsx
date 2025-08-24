import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./UserCardStyles";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
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

  const isSuperUser = user.superUser;
  const {
    id,
    login,
    firstName,
    lastName,
    email,
    emailVerified,
    enabled,
    roles,
  } = user;

  const handleToggleStatus = () => {
    toggleStatus({
      id,
      onSuccess: () => {
        reLoad();
      },
      onError: (errorMessage) => {
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: errorMessage || "Ошибка при сохранении email",
          position: "top",
        });
      },
    });
  };

  return (
    <View style={styles.card}>
      {/* ID и Логин */}

      <Text style={styles.idLogin}>
        {isSuperUser && "🛡️"} Id: {id} Login: {login}
      </Text>

      {/* ФИО как единая кнопка */}
      <EditNameModal
        visible={isEditNameVisible}
        onClose={() => setEditNameVisible(false)}
        user={user}
        reLoad={reLoad}
      />
      <TouchableOpacity
        style={styles.nameContainer}
        onPress={() => setEditNameVisible(true)}
      >
        <Text style={styles.name}>{`First Name: ${firstName}`}</Text>
        <Text style={styles.name}>{`Last Name: ${lastName}`}</Text>
      </TouchableOpacity>

      {/* Email с цветной меткой */}
      <EmailActionModal
        user={user}
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        reLoad={reLoad}
      />
      <TouchableOpacity
        style={[
          styles.emailBadge,
          emailVerified ? styles.emailVerified : styles.emailUnverified,
        ]}
        onPress={() => !isSuperUser && setEmailModalVisible(true)}
        disabled={isSuperUser}
      >
        <Text style={styles.emailText}>{email}</Text>
      </TouchableOpacity>

      {/* Статус Enabled */}
      <TouchableOpacity
        style={styles.statusRow}
        onPress={handleToggleStatus}
        disabled={isSuperUser}
      >
        <FontAwesome
          name="circle"
          size={10}
          color={enabled ? "green" : "red"}
          style={styles.statusDot}
        />
        <Text style={styles.statusText}>
          {enabled ? "Activated" : "Blocked"}
        </Text>
      </TouchableOpacity>

      {/* Роли - одна кнопка */}

      <RolesModal
        visible={rolesModalVisible}
        onClose={() => setRolesModalVisible(false)}
        user={user}
        reLoad={reLoad}
      />

      <TouchableOpacity
        style={styles.rolesContainer}
        onPress={() => setRolesModalVisible(true)}
        disabled={isSuperUser}
      >
        {roles.map((role) => (
          <View key={role} style={styles.roleChip}>
            <Text style={styles.roleText}>{role}</Text>
          </View>
        ))}
      </TouchableOpacity>

      {/* Иконки действий */}
      <View style={styles.actionsRow}>
        <ChangePasswordModal
          visible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          user={user}
          reLoad={reLoad}
        />

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setPasswordModalVisible(true)}
        >
          <MaterialIcons name="lock-reset" size={24} color="black" />
        </TouchableOpacity>

        <DeleteUserModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          user={user}
          reLoad={reLoad}
        />
        {!isSuperUser && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setDeleteModalVisible(true)}
            disabled={isSuperUser}
          >
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UserCard;
