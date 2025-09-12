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

  headerRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#EEF6FF",
    alignItems: "center", justifyContent: "center",
    marginRight: 10, borderWidth: 1, borderColor: "#D8ECFF",
  },
  avatarText: { color: "#1D4ED8", fontWeight: "800", fontSize: 16 },

  headerTextArea: { flex: 1 },
  titleLine: { flexDirection: "row", alignItems: "center" },
  idText: { color: COLORS.muted, fontWeight: "700" },
  dot: { color: COLORS.muted },
  title: { color: COLORS.title, fontWeight: "800" },

  subLine: { marginTop: 2, flexDirection: "row", alignItems: "center", gap: 6 },
  subText: { color: COLORS.muted, fontSize: 12 },

  rightCol: { alignItems: "flex-end", gap: 6, marginLeft: 10 },
  counterChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 3, paddingHorizontal: 8,
    borderRadius: 12, backgroundColor: COLORS.chipBg,
    borderWidth: 1, borderColor: COLORS.line,
  },
  counterText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },

  actionsRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 10 },
  iconBtn: { alignItems: "center", paddingVertical: 6, paddingHorizontal: 8 },
  iconLabel: { fontSize: 10, marginTop: 2, color: COLORS.muted, fontWeight: "700" },

  membersBox: {
    marginTop: 12, borderWidth: 1, borderColor: COLORS.line,
    borderRadius: 10, backgroundColor: "#FDFEFF",
    paddingHorizontal: 10, paddingVertical: 8,
  },
  memberRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 6, justifyContent: "space-between",
    borderRadius: 8, paddingHorizontal: 6,
  },
  memberRowLeader: {
    backgroundColor: COLORS.leaderBg,
  },
  memberLeft: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 },
  memberRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  memberName: { color: COLORS.text, fontWeight: "700", maxWidth: 220 },
  memberNameLeader: { color: COLORS.leaderText },

  memberPhone: { color: COLORS.muted, fontSize: 12, fontWeight: "700" },

  memberDelBtn: {
    paddingVertical: 4, paddingHorizontal: 6,
    borderRadius: 8, borderWidth: 1, borderColor: "#FECACA",
    backgroundColor: "#FFF1F2",
  },

  separator: { height: 1, backgroundColor: COLORS.line, opacity: 0.8, marginVertical: 2 },

  membersEmpty: {
    marginTop: 12, flexDirection: "row", gap: 6,
    alignItems: "center", justifyContent: "flex-start",
  },
  emptyText: { color: COLORS.muted, fontSize: 12, fontWeight: "600" },
});

export default styles;