import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "./EditLoginModalStyles";
import Toast from "react-native-toast-message";

import { editLogin } from "@/api/userAPI";

const EditLoginModal = ({ visible, onClose, user, reLoad }) => {
  const [id] = useState(user.id);
  const [login, setLogin] = useState(user.login);
  const [errorLogin,setErrorLogin]= useState(null);
  const handleSave = () => {
    editLogin({
      id,
      login,
      onSuccess: (message) => {
        Toast.show({
          type: "success",
          text1: "Успех!",
          text2: message || "Login успешно сохранен",
          position: "top",
        });
        reLoad();
        onClose();
      },
      onError: (errorMessage) => {
        setErrorLogin(errorMessage)
      },
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Login</Text>
          <TextInput
            value={login}
            onChangeText={setLogin}
            placeholder="Login"
            style={[
              styles.input,
              errorLogin && 
              styles.inputError,
            ]}
          />
          {editLogin && (
          <Text style={styles.errorText}>
            {errorLogin}
          </Text>
          )}
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

export default EditLoginModal;
