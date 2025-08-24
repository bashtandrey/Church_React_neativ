import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./authStyles";
import { signIn } from "@/api/authAPI";
import { useUser } from "@/context/UserContext";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    signIn({
      login,
      password,
      onSuccess: (userData) => {
        setUser(userData);
        navigation.navigate("Welcome");
        setLoading(false);
      },
      onError: (err) => {
        if (err?.field && err?.error) {
          const field = err.field.toLowerCase();
          setErrors({ [field]: err.error });
          setLoading(false);
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      <Text style={styles.title}>Authorization</Text>
      <TextInput
        style={[styles.input, errors.login && styles.inputError]}
        placeholder="Login"
        placeholderTextColor="#888"
        value={login}
        onChangeText={setLogin}
      />
      {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Passwosrd"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        editable={login !== ""}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={!login || !password}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
        <Text style={styles.switchText}>Go to back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
