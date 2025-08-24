import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import styles from "./DeleteUserModalStyles";

import Checkbox from "expo-checkbox";
import { deleteUser } from "@/api/userAPI";
import Toast from "react-native-toast-message";

const DeleteUserModal = ({ visible, onClose, user, reLoad }) => {
  const { id } = user;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Пожалуйста, подтвердите удаление",
        position: "top",
      });
      return;
    }

    deleteUser({
      id,
      checkDelete: confirmDelete,
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Успех!",
          text2: "Пользователь успешно удален",
          position: "top",
        });
        reLoad?.();
        onClose();
      },
      onError: (err) => {
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: err || "Ошибка при удалении пользователя",
          position: "top",
        });
      },
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Delete User</Text>
          <Text style={styles.description}>
            Are you sure you want to delete this user?
          </Text>

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={confirmDelete}
              onValueChange={setConfirmDelete}
              color={confirmDelete ? "#e53935" : undefined}
            />
            <Text style={styles.checkboxLabel}>
              I understand this action is permanent
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                !confirmDelete && { backgroundColor: "#ccc" },
              ]}
              onPress={handleDelete}
              disabled={!confirmDelete}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteUserModal;