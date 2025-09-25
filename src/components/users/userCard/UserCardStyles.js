import { StyleSheet, Platform } from "react-native";
import { COLORS } from "@/screens/admin/userScreen/UserScreenStyles";

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 2 },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 8,
    marginVertical: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...shadow,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  avatarText: {
    color: "#4338CA",
    fontWeight: "700",
  },
  headerTextArea: { flex: 1 },
  titleLine: { flexDirection: "row", alignItems: "center" },
  idText: { color: COLORS.muted, fontWeight: "700" },
  dot: { color: COLORS.muted },
  loginText: { color: COLORS.text, fontWeight: "700" },
  superShield: { color: COLORS.warn },

  emailBadge: {
    marginTop: 4,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  emailText: { color: COLORS.text, fontSize: 12, maxWidth: 220 },

  statusCol: { alignItems: "flex-end", gap: 4, marginLeft: 10 },
  statusLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },

  nameRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  nameText: { color: COLORS.text, fontWeight: "600", flex: 1 },
  editHint: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },

  // Полный контент Member
  detailsBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  detailsKey: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  detailsVal: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
  },

  rolesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  roleChip: {
    backgroundColor: "#E8F0FE",
    borderWidth: 1,
    borderColor: "#C7DBFF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  roleText: { color: "#1D4ED8", fontSize: 12, fontWeight: "700" },
  emptyRoles: { color: COLORS.muted, fontSize: 12 },

  rolesHint: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.muted,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  iconBtn: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  iconBtnDisabled: {
    opacity: 0.4,
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 2,
    color: COLORS.muted,
    fontWeight: "700",
  },
  iconLabelDisabled: {
    color: COLORS.muted,
  },
});

export default styles;
export { COLORS };