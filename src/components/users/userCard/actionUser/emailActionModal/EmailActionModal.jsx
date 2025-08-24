import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { editEmail, resendEmail } from "@/api/userAPI";
import styles from "./EmailActionModalStyles";

const EmailActionModal = ({ user, editRoleUser, visible, onClose, reLoad }) => {
  const isEditRoleUser = editRoleUser ?? false;
  const [email, setEmail] = useState(user.email);
  const [errors, setErrors] = useState({});

  const handleChangeEmail = () => {
    editEmail({
      id: user.id,
      email: email,
      isEditRoleUser,
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Успех!",
          text2: "Email успешно изменен",
          position: "top",
        });
        reLoad?.();
        onClose();
      },
      onError: (err) => {
        console.log("Error:", err);
        if (err?.field && err?.error) {
          const field = err.field.toLowerCase();
          setErrors({ [field]: err.error });
        }
        console.log(errors)
      },
    });
  };

  const handleResendVerification = () => {
    resendEmail(user.email)
      .then(() => {
        Toast.show({ type: "success", text1: "Verification email sent!" });
        reLoad?.();
        onClose();
      })
      .catch(() => {
        Toast.show({ type: "error", text1: "Failed to resend email" });
      });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {user.emailVerified ? "Change Email" : "Email Not Verified"}
          </Text>

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: null });
            }}
            placeholder="Enter new email"
          />
          {errors.email && (
            <Text style={styles.errorText}>{"Такой email существует"}</Text>
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleChangeEmail}
          >
            <Text style={styles.buttonText}>💾 Save Email</Text>
          </TouchableOpacity>

          {!user.emailVerified && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#ffb700" }]}
              onPress={handleResendVerification}
            >
              <Text style={styles.buttonText}>
                📨 Resend Verification Email
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EmailActionModal;
