import { StyleSheet, Platform } from "react-native";

const COLORS = {
  bg: "#f5f9ff",            // очень светлый голубой фон
  card: "#ffffff",          // карточка
  text: "#0f172a",          // почти чёрный (контраст)
  subtext: "#475569",       // подписи
  border: "#dbeafe",        // голубая граница
  focus: "#3b82f6",         // blue-500
  danger: "#ef4444",        // ошибки
  primary: "#2563eb",       // blue-600 — основная
  primaryPressed: "#1d4ed8",// blue-700 — press
  disabled: "#bfdbfe",      // blue-200/300 для отключённой кнопки
  inputBg: "#ffffff",
  placeholder: "#64748b",   // серо-синий placeholder
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 2 },
    }),
  },

  title: {
    fontSize: 26, fontWeight: "700",
    color: COLORS.text, textAlign: "center", marginBottom: 6,
  },
  subtitle: {
    fontSize: 14, color: COLORS.subtext, textAlign: "center", marginBottom: 16,
  },

  inputLabel: { color: COLORS.subtext, fontSize: 12, marginBottom: 8, marginTop: 14 },

  inputWrapper: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  inputRight: { marginLeft: 10, color: COLORS.primary, paddingVertical: 2, paddingHorizontal: 6 },
  inputFocused: { borderColor: COLORS.focus },
  inputError: { borderColor: COLORS.danger },

  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 6 },

  button: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonPressed: { backgroundColor: COLORS.primaryPressed },
  buttonDisabled: { backgroundColor: COLORS.disabled },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  buttonRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  footer: { marginTop: 18, alignItems: "center" },
  link: { color: COLORS.primary, fontSize: 14 },
});

export default styles;
export { COLORS };