import React, { useEffect, useState } from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import styles, { COLORS } from "./authStyles";
import { signIn } from "@/api/authAPI";
import { registerAndSendPushToken } from "@/api/PushTokenService";
import { useUser } from "@/context/UserContext";
import Layout from "@/components/Layout";
import { useTranslation } from "react-i18next";

const LoginScreen = () => {
  const { t, i18n } = useTranslation("loginScreen");

  const route = useRoute();
  const prefill = route.params?.loginPrefill ?? "";

  const navigation = useNavigation();
  const { setUser } = useUser();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [focused, setFocused] = useState({ login: false, password: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const canSubmit = login.trim().length > 0 && password.length >= 3 && !loading;
  useEffect(() => {
    if (route.params?.loginPrefill) {
      setLogin(route.params.loginPrefill);
      navigation.setParams({ loginPrefill: undefined });
    }
  }, [route.params?.loginPrefill]);


  const handleLogin = () => {
    if (!canSubmit) return;
    setLoading(true);
    setErrors({});
    signIn({
      login,
      password,
      onSuccess: async (userData) => {
        await registerAndSendPushToken({ userId: userData.id });
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
    <Layout>
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
              <Text style={styles.title}>{t("signIn")}</Text>
              {/* Login */}
              <Text style={styles.inputLabel}>{t("login")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focused.login && styles.inputFocused,
                  errors.login && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder={t("loginPlaceholder")}
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
              <Pressable
                style={styles.footerItem}
                onPress={() => navigation.navigate("RememberLogin")}
              >
                <Text style={styles.link}>{t("rememberLogin")}</Text>
              </Pressable>
              {/* Password */}
              <Text style={styles.inputLabel}>{t("password")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focused.password && styles.inputFocused,
                  errors.password && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder={t("passwordPlaceholder")}
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
                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  hitSlop={8}
                >
                  <Text style={styles.inputRight}>
                    {showPassword ? t("hide") : t("show")}
                  </Text>
                </Pressable>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
              {errors.general ? (
                <Text style={styles.errorText}>{errors.general}</Text>
              ) : null}
              <Pressable
                style={styles.footerItem}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.link}>{t("forgotPassword")}</Text>
              </Pressable>
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
                    <Text style={styles.buttonText}>{t("signingIn")}</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>{t("loginButton")}</Text>
                )}
              </Pressable>

              <View style={styles.footer}>
                <Pressable
                  style={styles.footerItem}
                  onPress={() => navigation.navigate("Welcome")}
                >
                  <Text style={styles.link}>{t("goBack")}</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default LoginScreen;
