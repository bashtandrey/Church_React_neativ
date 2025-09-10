import { useEffect, useState, useMemo } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Checkbox from "expo-checkbox";
import styles from "./RolesModalStyles";

import { fetchAllRoles, editRoles } from "@/api/userAPI";
import Toast from "react-native-toast-message";

/**
 * Props:
 * - visible: boolean
 * - onClose: () => void
 * - user: { id: number, roles: string[] }
 * - reLoad: () => Promise<void>
 * - canEdit: boolean  // если true, MEMBER нельзя снять (disabled чекбокс)
 */
const RolesModal = ({ visible, onClose, user, reLoad, canEdit }) => {
  const { id, roles: userRoles = [] } = user || {};
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // подгружаем роли и выставляем текущие
  useEffect(() => {
    if (!visible) return;

    fetchAllRoles()
      .then((res) => setAllRoles(Array.isArray(res) ? res : []))
      .catch((error) => {
        const message = error || "Failed to load roles";
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: message,
          position: "top",
        });
      });

    // При открытии модалки — берём роли пользователя
    // и, если можно редактировать (member есть), гарантируем наличие MEMBER
    setSelectedRoles((prev) => {
      const base = Array.isArray(userRoles) ? [...userRoles] : [];
      if (canEdit && !base.includes("MEMBER")) base.push("MEMBER");
      return base;
    });
  }, [visible]);

  // Быстрый доступ: MEMBER заблокирован к изменению если canEdit
  const isDisabledRole = (role) => canEdit && role === "MEMBER";

  const toggleRole = (role) => {
    if (isDisabledRole(role)) return; // MEMBER — не трогаем
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    // страховка: не даём сохранить без MEMBER, если canEdit
    if (canEdit && !selectedRoles.includes("MEMBER")) {
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Роль MEMBER обязательна.",
        position: "top",
      });
      return;
    }

    editRoles({
      id,
      roles: selectedRoles,
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Успех!",
          text2: "Роли успешно обновлены",
          position: "top",
        });
        onClose?.();
        reLoad?.();
      },
      onError: (err) =>
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: err || "Ошибка при обновлении ролей",
          position: "top",
        }),
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Manage Roles</Text>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {allRoles.map((role) => {
              const checked = selectedRoles.includes(role);
              const disabled = isDisabledRole(role);

              return (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleItem, disabled && styles.roleItemDisabled]}
                  onPress={() => !disabled && toggleRole(role)}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  <Checkbox
                    value={checked}
                    onValueChange={() => !disabled && toggleRole(role)}
                    disabled={disabled}
                    color={checked ? "#007bff" : undefined}
                  />
                  <Text
                    style={[
                      styles.roleText,
                      disabled && styles.roleTextDisabled,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RolesModal;