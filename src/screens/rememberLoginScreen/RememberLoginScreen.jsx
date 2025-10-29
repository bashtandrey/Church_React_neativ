import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { requestPasswordReset, verifyResetCode } from "@/api/authAPI";
import { useTranslation } from "react-i18next";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^\d{6}$/;

export default function RememberLoginScreen({ navigation }) {
  const { t } = useTranslation("remember");

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // step1
  const [email, setEmail] = useState("");
  const isEmailValid = EMAIL_RE.test(email.trim());

  // server rid
  const [rid, setRid] = useState(null);

  // step2
  const [code, setCode] = useState("");
  const isCodeValid = CODE_RE.test(code.trim());
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = (sec = 60) => {
    setResendCooldown(sec);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendCooldown((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // === handlers ===
  const handleSendCode = async () => {
    if (!isEmailValid) return;
    try {
      setSubmitting(true);
      const { rid: serverRid, message } = await requestPasswordReset(
        email.trim()
      );
      setRid(serverRid);
      Toast.show({
        type: "success",
        text1: t("toast.checkEmailTitle"),
        text2: message,
        position: "bottom",
      });
      setStep(2);
      startCooldown(60);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: t("toast.failedTitle"),
        text2: e.message,
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!rid || !isCodeValid) return;
    try {
      setSubmitting(true);
      const { login } = await verifyResetCode(rid, code.trim());
      navigation.reset({
        index: 0,
        routes: [{ name: "LogIn", params: { loginPrefill: login } }],
      });
      Toast.show({
        type: "success",
        text1: t("toast.loginFoundTitle"),
        text2: t("toast.loginFoundText"),
        position: "bottom",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: t("toast.invalidCodeTitle"),
        text2: e.message,
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !isEmailValid) return;
    try {
      setSubmitting(true);
      const { message, rid: newRid } = await requestPasswordReset(email.trim());
      if (newRid) setRid(newRid);
      Toast.show({
        type: "success",
        text1: t("toast.codeResentTitle"),
        text2: message,
        position: "bottom",
      });
      startCooldown(60);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: t("toast.failedTitle"),
        text2: e.message,
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // === UI ===
  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>{t("titleGetLogin")}</Text>
          <Text style={styles.subtitle}>{t("subtitleEmailPrompt")}</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t("placeholders.email")}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            style={[styles.input, email && !isEmailValid && styles.inputError]}
            editable={!submitting}
          />
          {email && !isEmailValid && (
            <Text style={styles.error}>{t("errors.emailInvalid")}</Text>
          )}

          <Pressable
            style={[
              styles.btn,
              (!isEmailValid || submitting) && styles.btnDisabled,
            ]}
            onPress={handleSendCode}
            disabled={!isEmailValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.btnText}>{t("buttons.sendCode")}</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => navigation.navigate("LogIn")}
            >
              <Text style={styles.link}>{t("links.backToLogin")}</Text>
            </Pressable>
            <Pressable
              style={styles.footerItem}
              onPress={() => navigation.navigate("Welcome")}
            >
              <Text style={styles.link}>{t("links.home")}</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>{t("titleEnterCode")}</Text>
          <Text style={styles.subtitle}>
            {t("subtitleCodeSent", { email: email.trim() })}
          </Text>

          <TextInput
            value={code}
            onChangeText={(tVal) =>
              setCode(tVal.replace(/\D/g, "").slice(0, 6))
            }
            placeholder={t("placeholders.code")}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            style={[
              styles.input,
              code && !isCodeValid && styles.inputError,
              { letterSpacing: 6, textAlign: "center" },
            ]}
            maxLength={6}
            editable={!submitting}
          />
          {code && !isCodeValid && (
            <Text style={styles.error}>{t("errors.codeInvalid")}</Text>
          )}

          <Pressable
            style={[
              styles.btn,
              (!isCodeValid || submitting) && styles.btnDisabled,
            ]}
            onPress={handleVerifyCode}
            disabled={!isCodeValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.btnText}>{t("buttons.verifyCode")}</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Pressable
              style={[
                styles.footerItem,
                resendCooldown > 0 && { opacity: 0.6 },
              ]}
              onPress={handleResend}
              disabled={resendCooldown > 0 || submitting}
            >
              <Text style={styles.link}>
                {resendCooldown > 0
                  ? t("links.resendIn", { s: resendCooldown })
                  : t("links.resend")}
              </Text>
            </Pressable>
            <Pressable style={styles.footerItem} onPress={() => setStep(1)}>
              <Text style={styles.link}>{t("links.changeEmail")}</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#ef4444" },
  error: { color: "#ef4444", marginTop: 6, marginBottom: 8 },
  btn: {
    backgroundColor: "#2b6cb0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "700" },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  footerItem: { marginHorizontal: 12, paddingVertical: 6 },
  link: { color: "#2b6cb0", fontWeight: "600" },
});
