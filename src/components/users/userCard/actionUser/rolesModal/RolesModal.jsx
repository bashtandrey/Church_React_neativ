import { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Checkbox from "expo-checkbox";
import styles from "./RolesModalStyles";

import { fetchAllRoles, editRoles } from "@/api/userAPI";
import Toast from "react-native-toast-message";
import i18n from "@/i18n";

const RolesModal = ({ visible, onClose, user, reLoad, canEdit }) => {
  const { id, roles: userRoles = [] } = user || {};
  const [allRoles, setAllRoles] = useState([]);       // список всех доступных ролей с backend
  const [selectedRoles, setSelectedRoles] = useState([]); // список выбранных кодов ролей

  // Загружаем список всех ролей при открытии модалки
 useEffect(() => {
  if (!visible) return;

  fetchAllRoles()
    .then((res) => {
      const roles = Array.isArray(res) ? res : res.data || [];
      setAllRoles(roles);
    })
    .catch((error) => {
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: error || "Failed to load roles",
        position: "top",
      });
    });
}, [visible]);


  // Синхронизация выбранных ролей с userRoles
  useEffect(() => {
    if (!visible) return;

    // Поддерживаем оба варианта: массив строк или массив объектов
    let base = [];
    if (Array.isArray(userRoles)) {
      if (typeof userRoles[0] === "string") {
        base = [...userRoles];
      } else {
        base = userRoles.map((r) => r.code);
      }
    }

    // Если canEdit → MEMBER должен быть всегда выбран
    if (canEdit && !base.includes("MEMBER")) base.push("MEMBER");

    setSelectedRoles(base);
  }, [visible, userRoles, canEdit]);

  // MEMBER нельзя снимать при canEdit
  const isDisabledRole = (code) => canEdit && code === "MEMBER";

  const toggleRole = (code) => {
    if (isDisabledRole(code)) return;
    setSelectedRoles((prev) =>
      prev.includes(code) ? prev.filter((r) => r !== code) : [...prev, code]
    );
  };

  const handleSave = () => {
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
          <Text style={styles.title}>
            {i18n.language === "ru" ? "Управление ролями" : "Manage Roles"}
          </Text>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {allRoles.map((role) => {
              const checked = selectedRoles.includes(role.code);
              const disabled = isDisabledRole(role.code);

              return (
                <TouchableOpacity
                  key={role.code}
                  style={[styles.roleItem, disabled && styles.roleItemDisabled]}
                  onPress={() => !disabled && toggleRole(role.code)}
                  activeOpacity={disabled ? 1 : 0.7}
                >
                  <Checkbox
                    value={checked}
                    onValueChange={() => !disabled && toggleRole(role.code)}
                    disabled={disabled}
                    color={checked ? "#007bff" : undefined}
                  />
                  <Text
                    style={[
                      styles.roleText,
                      disabled && styles.roleTextDisabled,
                    ]}
                  >
                    {i18n.language === "ru"
                      ? role.russianName
                      : role.englishName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>
                {i18n.language === "ru" ? "Отмена" : "Cancel"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>
                {i18n.language === "ru" ? "Сохранить" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RolesModal;