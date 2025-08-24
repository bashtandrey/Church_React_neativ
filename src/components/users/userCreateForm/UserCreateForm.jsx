import { useState } from "react";
import { TextInput, Text, TouchableOpacity, ScrollView } from "react-native";
import { createUser } from "@/api/userAPI";
import Toast from "react-native-toast-message";
import styles from "./UserCreateFormStyles";

const UserCreateForm = ({ onClose, reLoad }) => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({});

  const handleCreate = () => {
    createUser({
      login,
      email,
      password,
      firstName,
      lastName,
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "User created successfully",
          position: "top",
        });
        onClose?.();
        reLoad?.();
        setLogin("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
      },
      onError: (err) => {
        console.log("Error:", err);
        if (err?.field && err?.error) {
          const field = err.field.toLowerCase();
          setErrors({ [field]: err.error });
        }
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create User</Text>

      <TextInput
        style={[styles.input, errors.login && styles.inputError]}
        placeholder="Login"
        placeholderTextColor="#001f3f"
        value={login}
        onChangeText={(text) => {
          setLogin(text);
          setErrors({ ...errors, login: null });
        }}
      />
      {errors.login && (
        <Text style={styles.errorText}>{"Such login exists"}</Text>
      )}

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#001f3f"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors({ ...errors, email: null });
        }}
        keyboardType="email-address"
        editable={login !== ""}
      />
      {errors.email && (
        <Text style={styles.errorText}>{"Such email exists"}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#001f3f"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={email !== ""}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#001f3f"
        value={firstName}
        onChangeText={setFirstName}
        editable={password !== ""}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#001f3f"
        value={lastName}
        onChangeText={setLastName}
        editable={firstName !== ""}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={!login || !email || !password || !firstName || !lastName}
      >
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserCreateForm;
