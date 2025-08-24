import { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "./RolesModalStyles";

import Checkbox from "expo-checkbox";
import { fetchAllRoles, editRoles } from "@/api/userAPI";
import Toast from "react-native-toast-message";

const RolesModal = ({ visible, onClose, user, reLoad }) => {
  const { id, roles: userRoles } = user;
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchAllRoles()
        .then((res) => setAllRoles(res))
        .catch((error) => {
          const message = error || "Failed to load roles";
          Toast.show({
            type: "error",
            text1: "Ошибка!",
            text2: message,
            position: "top",
          });
        });
      setSelectedRoles(userRoles);
    }
  }, [visible]);

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
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
        onClose();
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
          <ScrollView style={{ maxHeight: 250 }}>
            {allRoles.map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.roleItem}
                onPress={() => toggleRole(role)}
              >
                <Checkbox
                  value={selectedRoles.includes(role)}
                  onValueChange={() => toggleRole(role)}
                  color={selectedRoles.includes(role) ? "#007bff" : undefined}
                />
                <Text style={styles.roleText}>{role}</Text>
              </TouchableOpacity>
            ))}
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