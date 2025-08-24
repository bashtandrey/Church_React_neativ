import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "./EditNameModalStyles";
import Toast from "react-native-toast-message";

import { editUser } from "@/api/userAPI";

const EditNameModal = ({ visible, onClose, user, reLoad }) => {
  const [id] = useState(user.id);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const handleSave = () => {
    editUser({
      id,
      firstName,
      lastName,
      onSuccess: (message) => {
        Toast.show({
          type: "success",
          text1: "Успех!",
          text2: message || "Email успешно сохранен",
          position: "top",
        });
        reLoad();
        onClose();
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            style={styles.input}
          />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            style={styles.input}
          />
          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditNameModal;
