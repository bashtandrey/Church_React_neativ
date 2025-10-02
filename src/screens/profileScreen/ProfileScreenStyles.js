import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#EAF4FF", // светлый голубой фон
  cardBg: "#FFFFFF",
  border: "#D6E9FF",
  title: "#1C3D6E", // насыщенный синий для заголовков
  text: "#2E4A6B",
  muted: "#5E7BA6",
  good: "#17a673",
  warn: "#ffb700",

  chipBg: "#E1F0FF",
  chipText: "#224E8F",

  btnPrimaryBg: "#3B82F6", // bright blue
  btnPrimaryText: "#FFFFFF",
  btnWarnBg: "#FFD166",
  btnWarnText: "#1F2A44",
  btnDisabled: "#A9C7F7",

  badgeOkBg: "#DCF8EA",
  badgeOkText: "#0F7C56",
  badgeWarnBg: "#FFF6DA",
  badgeWarnText: "#8A5B00",
  shadow: "rgba(28, 61, 110, 0.08)",
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: COLORS.bg,
  },

  header: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.title,
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.title,
  },

  cardBody: {
    marginTop: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  value: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.muted,
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 12,
  },

  note: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.chipText,
    letterSpacing: 0.2,
  },

  buttonGroup: {
    marginTop: 8,
    marginBottom: 28,
    gap: 10,
  },

  btn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  btnPrimary: {
    backgroundColor: COLORS.btnPrimaryBg,
  },

  btnWarn: {
    backgroundColor: COLORS.btnWarnBg,
  },

  btnText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.btnPrimaryText,
    letterSpacing: 0.2,
  },

  btnTextDark: {
    color: COLORS.btnWarnText,
  },

  btnDisabled: {
    opacity: 0.6,
  },
  manageBtn: {
    backgroundColor: COLORS.btnPrimaryBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "center",
  },

  manageBtnText: {
    color: COLORS.btnPrimaryText,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },

  badgeOk: {
    backgroundColor: COLORS.badgeOkBg,
  },

  badgeWarn: {
    backgroundColor: COLORS.badgeWarnBg,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF4FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10,
  },
  editBtnText: {
    marginLeft: 4,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
});

export default styles;
