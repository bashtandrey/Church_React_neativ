import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "./ChangePasswordModalStyles";
import { editPassword } from "@/api/userAPI";
import Toast from "react-native-toast-message";

const ChangePasswordModal = ({ visible, editRoleUser ,onClose, user, reLoad }) => {
  const isEditRoleUser = editRoleUser ?? false;
  const { id } = user;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSave = () => {
    if (!newPassword || newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Пароль должен содержать не менее 6 символов",
        position: "top",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Пароли не совпадают",
        position: "top",
      });
      return;
    }
    editPassword({
      id,
      password: newPassword,
      isEditRoleUser,
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Успех!",
          text2: "Пароль успешно изменён",
          position: "top",
        });
        reLoad?.();
        onClose();
      },
      onError: (err) => {
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: err || "Ошибка при обновлении пароля",
          position: "top",
        });
      },
    });
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Change Password</Text>

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

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

export default ChangePasswordModal;