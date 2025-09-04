import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import styles from "./UserCreateFormStyles";

// Эти функции предполагаются в твоём API
import { checkEmail, createUser } from "@/api/userAPI";

const isEmailValid = (v) => /.+@.+\..+/.test(String(v).trim());
const isNonEmpty = (s) => !!String(s).trim();

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  login: "",
  password: "",
};

export default function UserCreateWizard({ onClose, reLoad }) {
  const { t } = useTranslation("userCreateForm");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  // client/server errors
  const [vErrors, setVErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
  });
  const [sErrors, setSErrors] = useState({
    email: null,
    login: null,
    general: null,
  });

  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (k in vErrors) setVErrors((p) => ({ ...p, [k]: null }));
    if (k in sErrors) setSErrors((p) => ({ ...p, [k]: null }));
  };

  // ---- STEP 1: First/Last ----
  const handleNextFromNames = () => {
    const errs = {
      firstName: isNonEmpty(form.firstName) ? null : "required",
      lastName: isNonEmpty(form.lastName) ? null : "required",
    };
    setVErrors((p) => ({ ...p, ...errs }));
    if (errs.firstName || errs.lastName) return;
    setStep(2);
  };

  // ---- STEP 2: Email ----
  const handleNextFromEmail = async () => {
    const email = form.email.trim();
    if (!isEmailValid(email)) {
      setVErrors((p) => ({ ...p, email: "invalid" }));
      return;
    }
    setLoading(true);
    try {
      await checkEmail({ email });
      setStep(3);
    } catch (err) {
      setSErrors((p) => ({ ...p, email: err?.error || "email_in_use" }));
    } finally {
      setLoading(false);
    }
  };

  // ---- STEP 3: Login/Password -> create ----
  const handleRegister = () => {
    const login = form.login.trim();
    const password = form.password;

    if (!login || !password) {
      // Мягко подсветим только кнопку
      setSErrors((p) => ({
        ...p,
        general: t("errors.fillCredentials"),
      }));
      return;
    }

    setLoading(true);
    createUser({
      login,
      email: form.email.trim(),
      password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      onSuccess: (newUserId) => {

        Toast.show({
          type: "success",
          text1: t("toasts.successTitle"),
          text2: t("toasts.successBody"),
          position: "top",
        });
        onClose?.(newUserId); // закрываем модалку
        reLoad?.(); // обновить список
        // сброс
        setForm(initialForm);
        setVErrors({ firstName: null, lastName: null, email: null });
        setSErrors({ email: null, login: null, general: null });
        setStep(1);
      },
      onError: (err) => {
        const field = String(err?.field || "").toLowerCase();
        if (field === "email") {
          setSErrors((p) => ({ ...p, email: err.error || "email_in_use" }));
        } else if (field === "login") {
          setSErrors((p) => ({ ...p, login: err.error || "login_in_use" }));
        } else {
          setSErrors((p) => ({
            ...p,
            general: err?.error || t("errors.unknown"),
          }));
        }
      },
    }).finally(() => setLoading(false));
  };

  // ---------- UI по шагам ----------
  if (step === 1) {
    const disabled =
      !isNonEmpty(form.firstName) || !isNonEmpty(form.lastName) || loading;
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{t("titles.stepNames")}</Text>
        </View>
        <TextInput
          style={[styles.input, vErrors.firstName && styles.inputError]}
          placeholder={t("placeholders.firstName")}
          placeholderTextColor="#001f3f"
          value={form.firstName}
          onChangeText={(text) => setField("firstName", text)}
        />
        <TextInput
          style={[styles.input, vErrors.lastName && styles.inputError]}
          placeholder={t("placeholders.lastName")}
          placeholderTextColor="#001f3f"
          value={form.lastName}
          onChangeText={(text) => setField("lastName", text)}
        />

        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={handleNextFromNames}
          disabled={disabled}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>{t("buttons.next")}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 2) {
    const disabled = !form.email.trim() || loading;
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{t("titles.stepEmail")}</Text>
        </View>

        <TextInput
          style={[
            styles.input,
            (vErrors.email || sErrors.email) && styles.inputError,
          ]}
          placeholder={t("placeholders.email")}
          placeholderTextColor="#001f3f"
          value={form.email}
          onChangeText={(text) => setField("email", text)}
          onEndEditing={(e) => {
            const v = e.nativeEvent.text;
            setVErrors((p) => ({
              ...p,
              email: isEmailValid(v) ? null : "invalid",
            }));
          }}
          keyboardType="email-address"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {(vErrors.email || sErrors.email) && (
          <Text style={styles.errorText}>
            {vErrors.email ? t("errors.emailInvalid") : t("errors.emailExists")}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={handleNextFromEmail}
          disabled={disabled}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>{t("buttons.next")}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // step === 3
  const disabledReg = !form.login.trim() || !form.password.trim() || loading;

  return (
    <View style={[styles.container, { justifyContent: "center" }]}>
      <View style={styles.formCard}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{t("titles.stepCredentials")}</Text>
        </View>

        <TextInput
          style={[styles.input, sErrors.login && styles.inputError]}
          placeholder={t("placeholders.login")}
          placeholderTextColor="#001f3f"
          value={form.login}
          onChangeText={(text) => setField("login", text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!!sErrors.login && (
          <Text style={styles.errorText}>{t("errors.loginExists")}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder={t("placeholders.password")}
          placeholderTextColor="#001f3f"
          value={form.password}
          onChangeText={(text) => setField("password", text)}
          secureTextEntry
        />

        {!!sErrors.general && (
          <Text style={styles.errorText}>{sErrors.general}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, disabledReg && styles.buttonDisabled]}
          disabled={disabledReg}
          onPress={handleRegister}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>{t("buttons.create")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
