import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  primary: "#007AFF",
  bg: "#F7F9FC",
  card: "#FFFFFF",
  text: "#0F172A",
  muted: "#6B7280",
  line: "#E5E7EB",
  success: "#16A34A",
  danger: "#DC2626",
};

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 12 },
  btn: { flexDirection: "row", alignItems: "center", gap: 4 },
  btnText: { fontWeight: "600" },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: COLORS.line,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.muted },
  tabTextActive: { color: COLORS.primary, fontWeight: "700" },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...shadow,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontWeight: "700", fontSize: 15, color: COLORS.text },
  amount: { fontWeight: "700", fontSize: 15 },
  muted: { color: COLORS.muted, fontSize: 13 },
  date: { marginTop: 4, color: COLORS.muted, fontSize: 12 },

  memberRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.line,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  memberName: { fontWeight: "600" },
  memberCount: { color: COLORS.muted },

  backBtn: { padding: 12 },
  backBtnText: { color: COLORS.primary, fontWeight: "600" },

  modalWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalCard: {
    width: "92%",
    maxWidth: 400,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 6,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
  },
  secondaryText: { color: COLORS.text },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  total: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "600",
  },

  primaryText: { color: "#fff", fontWeight: "700" },
});

export default styles;
