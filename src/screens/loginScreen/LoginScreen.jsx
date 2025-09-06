import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles, { COLORS } from "./authStyles";
import { signIn } from "@/api/authAPI";
import { useUser } from "@/context/UserContext";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useUser();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [focused, setFocused] = useState({ login: false, password: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const canSubmit = login.trim().length > 0 && password.length >= 3 && !loading;

  const handleLogin = () => {
    if (!canSubmit) return;
    setLoading(true);
    setErrors({});
    signIn({
      login,
      password,
      onSuccess: (userData) => {
        setUser(userData);
        setLoading(false);
        navigation.navigate("Welcome");
      },
      onError: (err) => {
        setLoading(false);
        if (err?.field && err?.error) {
          const field = String(err.field).toLowerCase();
          setErrors({ [field]: err.error });
        } else {
          setErrors({ general: "Login failed. Try again." });
        }
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>Welcome back 👋</Text>

            {/* Login */}
            <Text style={styles.inputLabel}>Login</Text>
            <View
              style={[
                styles.inputWrapper,
                focused.login && styles.inputFocused,
                errors.login && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter your login"
                placeholderTextColor={COLORS.placeholder}
                value={login}
                onChangeText={(t) => {
                  setLogin(t);
                  if (errors.login)
                    setErrors((e) => ({ ...e, login: undefined }));
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                onFocus={() => setFocused((f) => ({ ...f, login: true }))}
                onBlur={() => setFocused((f) => ({ ...f, login: false }))}
                onSubmitEditing={() => Keyboard.dismiss()}
                accessibilityLabel="Login"
                textContentType="username"
              />
            </View>
            {errors.login ? (
              <Text style={styles.errorText}>{errors.login}</Text>
            ) : null}

            {/* Password */}
            <Text style={styles.inputLabel}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                focused.password && styles.inputFocused,
                errors.password && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.placeholder}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: undefined }));
                }}
                editable={login.trim() !== ""}
                onFocus={() => setFocused((f) => ({ ...f, password: true }))}
                onBlur={() => setFocused((f) => ({ ...f, password: false }))}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
                textContentType="password"
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                <Text style={styles.inputRight}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            {errors.general ? (
              <Text style={styles.errorText}>{errors.general}</Text>
            ) : null}

            {/* Button */}
            <Pressable
              onPress={handleLogin}
              disabled={!canSubmit}
              android_ripple={{ color: "#93c5fd" }} // мягкий голубой ripple
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                !canSubmit && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <View style={styles.buttonRow}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.buttonText}>Signing in…</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Pressable onPress={() => navigation.navigate("Welcome")}>
                <Text style={styles.link}>Go back</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
