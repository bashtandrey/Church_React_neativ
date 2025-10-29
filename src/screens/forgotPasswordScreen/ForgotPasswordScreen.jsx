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
import {
  requestPasswordReset,
  verifyResetCode,
  resetPasswordWithCode,
} from "@/api/authAPI";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^\d{6}$/;

export default function ForgotPasswordScreen({ navigation }) {
  const [verifiedLogin, setVerifiedLogin] = useState(null);

  // шаги: 1=email -> 2=код -> 3=пароль
  const [step, setStep] = useState(1);

  // общие состояния
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

  // step3
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const pwOk = password.length >= 8 && password === password2;

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startCooldown = (sec = 60) => {
    setResendCooldown(sec);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendCooldown((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
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
        text1: "Check your email",
        text2: message,
        position: "bottom",
      });
      setStep(2);
      startCooldown(60);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Failed",
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
      const { login, message } = await verifyResetCode(rid, code.trim());
      setVerifiedLogin(login);
      setStep(3);
      Toast.show({
        type: "success",
        text1: "Code verified",
        position: "bottom",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Invalid code",
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
        text1: "Code re-sent",
        text2: message,
        position: "bottom",
      });
      startCooldown(60);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: e.message,
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!rid || !isCodeValid || !pwOk) return;
    try {
      setSubmitting(true);
      const loginToPrefill = verifiedLogin ?? email.trim();
      const { message } = await resetPasswordWithCode(
        rid,
        code.trim(),
        password
      );
      Toast.show({
        type: "success",
        text1: "Password updated",
        text2: message,
        position: "bottom",
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "LogIn", params: { loginPrefill: loginToPrefill } }],
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Failed",
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email to get a 6-digit code.
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            style={[styles.input, email && !isEmailValid && styles.inputError]}
            editable={!submitting}
          />
          {email && !isEmailValid && (
            <Text style={styles.error}>Enter a valid email</Text>
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
              <Text style={styles.btnText}>Send code</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => navigation.navigate("LogIn")}
            >
              <Text style={styles.link}>Back to Login</Text>
            </Pressable>
            <Pressable
              style={styles.footerItem}
              onPress={() => navigation.navigate("Welcome")}
            >
              <Text style={styles.link}>Home</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Enter Code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to {email.trim()}.
          </Text>

          <TextInput
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
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
            <Text style={styles.error}>Enter 6 digits</Text>
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
              <Text style={styles.btnText}>Verify code</Text>
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
                  ? `Resend in ${resendCooldown}s`
                  : "Resend code"}
              </Text>
            </Pressable>
            <Pressable style={styles.footerItem} onPress={() => setStep(1)}>
              <Text style={styles.link}>Change email</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Minimum 8 characters.</Text>
          {verifiedLogin && (
            <Text
              style={{ textAlign: "center", marginBottom: 8, color: "#555" }}
            >
              Login: <Text style={{ fontWeight: "700" }}>{verifiedLogin}</Text>
            </Text>
          )}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="New password"
            secureTextEntry
            textContentType="newPassword"
            style={[
              styles.input,
              password.length > 0 && password.length < 8 && styles.inputError,
            ]}
            editable={!submitting}
          />
          <TextInput
            value={password2}
            onChangeText={setPassword2}
            placeholder="Repeat password"
            secureTextEntry
            textContentType="newPassword"
            style={[
              styles.input,
              password2.length > 0 &&
                password !== password2 &&
                styles.inputError,
              { marginTop: 10 },
            ]}
            editable={!submitting}
          />

          {!pwOk && (password.length > 0 || password2.length > 0) && (
            <Text style={styles.error}>
              {password.length < 8
                ? "Password must be at least 8 characters"
                : "Passwords do not match"}
            </Text>
          )}

          <Pressable
            style={[styles.btn, (!pwOk || submitting) && styles.btnDisabled]}
            onPress={handleResetPassword}
            disabled={!pwOk || submitting}
          >
            {submitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.btnText}>Change password</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Pressable style={styles.footerItem} onPress={() => setStep(2)}>
              <Text style={styles.link}>Back</Text>
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
