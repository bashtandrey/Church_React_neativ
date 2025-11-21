import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#b91c1c",
};

const styles = StyleSheet.create({
  container: { padding: 16, flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  foundCounter: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
  },

  title: { fontWeight: "800", fontSize: 18, color: COLORS.title },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepDotWrap: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#cbd5e1",
  },
  stepDotActive: { backgroundColor: COLORS.primary },
  stepDotDone: { backgroundColor: "#60a5fa" },
  stepLine: {
    width: 22,
    height: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 6,
  },
  stepTitle: { fontWeight: "700", fontSize: 14, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    padding: 8,
    color: COLORS.text,
    marginBottom: 12,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    marginBottom: 6,
  },
  optionActive: { backgroundColor: COLORS.primary },
  optionText: { color: COLORS.text },
  optionTextActive: { color: "#fff", fontWeight: "700" },
  quickBtns: { flexDirection: "row", gap: 8, marginTop: 8 },
  quickBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
  },
  quickBtnText: { fontWeight: "600", color: COLORS.text },
  error: { color: COLORS.danger, fontWeight: "600", fontSize: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderColor: COLORS.line,
  },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  secondaryText: { color: COLORS.text, fontWeight: "600" },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  disabled: { opacity: 0.5 },
});

export default styles;
