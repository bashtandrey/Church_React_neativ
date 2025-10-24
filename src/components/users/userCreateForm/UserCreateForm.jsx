import { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import styles from "./UserCreateFormStyles";
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

export default function UserCreateWizard({ visible, onClose, reLoad }) {
  const { t } = useTranslation("userCreateForm");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

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

  const handleNextFromNames = () => {
    const errs = {
      firstName: isNonEmpty(form.firstName) ? null : "required",
      lastName: isNonEmpty(form.lastName) ? null : "required",
    };
    setVErrors((p) => ({ ...p, ...errs }));
    if (errs.firstName || errs.lastName) return;
    setStep(2);
  };

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

  const handleRegister = async () => {
    const login = form.login.trim();
    const password = form.password;
    if (!login || !password) {
      setSErrors((p) => ({ ...p, general: t("errors.fillCredentials") }));
      return;
    }
    setLoading(true);
    try {
      await createUser({
        login,
        email: form.email.trim(),
        password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });
      Toast.show({
        type: "success",
        text1: t("toasts.successTitle"),
        text2: t("toasts.successBody"),
        position: "top",
      });
      onClose?.();
      reLoad?.();
      setForm(initialForm);
      setStep(1);
    } catch (err) {
      const field = String(err?.field || "").toLowerCase();
      if (field === "email")
        setSErrors((p) => ({ ...p, email: err.error || "email_in_use" }));
      else if (field === "login")
        setSErrors((p) => ({ ...p, login: err.error || "login_in_use" }));
      else
        setSErrors((p) => ({
          ...p,
          general: err?.error || t("errors.unknown"),
        }));
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={[styles.container, { justifyContent: "center" }]}>
        <View style={styles.formCard}>
          {step === 1 && (
            <>
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
                style={[
                  styles.button,
                  (!isNonEmpty(form.firstName) || !isNonEmpty(form.lastName)) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleNextFromNames}
                disabled={
                  !isNonEmpty(form.firstName) || !isNonEmpty(form.lastName)
                }
              >
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.buttonText}>{t("buttons.next")}</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
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
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {(vErrors.email || sErrors.email) && (
                <Text style={styles.errorText}>
                  {vErrors.email
                    ? t("errors.emailInvalid")
                    : t("errors.emailExists")}
                </Text>
              )}
              <TouchableOpacity
                style={[
                  styles.button,
                  !form.email.trim() && styles.buttonDisabled,
                ]}
                onPress={handleNextFromEmail}
                disabled={!form.email.trim()}
              >
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.buttonText}>{t("buttons.next")}</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.titleBadge}>
                <Text style={styles.titleText}>
                  {t("titles.stepCredentials")}
                </Text>
              </View>
              <TextInput
                style={[styles.input, sErrors.login && styles.inputError]}
                placeholder={t("placeholders.login")}
                placeholderTextColor="#001f3f"
                value={form.login}
                onChangeText={(text) => setField("login", text)}
                autoCapitalize="none"
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
                style={[
                  styles.button,
                  (!form.login.trim() || !form.password.trim()) &&
                    styles.buttonDisabled,
                ]}
                disabled={!form.login.trim() || !form.password.trim()}
                onPress={handleRegister}
              >
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.buttonText}>{t("buttons.create")}</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{t("buttons.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
