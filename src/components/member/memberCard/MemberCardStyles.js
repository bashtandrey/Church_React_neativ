import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  bg: "#EAF4FF",
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#E11D48",
  chipBg: "#E1F0FF",
  leaderBg: "#F0F7FF",
  leaderText: "#1D4ED8",
  leaderIcon: "#2563EB",
};

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
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    marginHorizontal: 8,
    marginVertical: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...shadow,
  },
  userBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F3F7FF",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  memberInfoBox: {
    marginTop: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F3F7FF",
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },
  userText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  userLogin: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },

  /* HEADER */
  headerRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#D8ECFF",
  },
  avatarText: { color: "#1D4ED8", fontWeight: "800", fontSize: 16 },

  headerTextArea: { flex: 1 },
  titleLine: { flexDirection: "row", alignItems: "center" },
  idText: { color: COLORS.muted, fontWeight: "700" },
  dot: { color: COLORS.muted },
  title: { color: COLORS.title, fontWeight: "800" },

  /* HIERARCHY */
  hierarchyBox: {
    marginTop: 8,
    marginLeft: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* GROUP */
  groupBox: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 8,
  },
  groupText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },

  /* DETAILS (phone, birthday, gender) */
  detailsBox: {
    marginTop: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F9FBFF",
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },

  /* ACTIONS */
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 10,
  },
  iconBtn: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 2,
    color: COLORS.muted,
    fontWeight: "700",
  },
});

export default styles;