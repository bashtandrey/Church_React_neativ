import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  headerBg: "#0B2A4A",
  itemBg: "rgba(255,255,255,0.08)",
  itemBgActive: "rgba(230, 213, 213, 0.18)",
  white: "#FFFFFF",
  border: "rgba(255,255,255,0.12)",
  divider: "rgba(255,255,255,0.10)",
};

export default StyleSheet.create({
  safe: {
    backgroundColor: COLORS.headerBg,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  header: {
    backgroundColor: COLORS.headerBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // тень/поднятость
  shadowIOS: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  shadowAndroid: {
    elevation: 6,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 92, // не схлопывается
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 92,
  },

  // центр
  centerWrap: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    marginHorizontal: 8,
  },
  centerContent: {
    paddingHorizontal: 4,
    gap: 6, // RN 0.73+, иначе используйте margin у navItem
  },
  centerEdge: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 24,
    zIndex: 1,
  },

  // кнопки
  navItem: {
    height: 36,
    minWidth: 36,
    paddingHorizontal: 6,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.itemBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    marginHorizontal: 2, // запас, если нет gap
  },
  navItemActive: {
    backgroundColor: COLORS.itemBgActive,
  },
  navItemPressed: {
    opacity: 0.75,
  },

  // логотип и язык
  logoWrap: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.itemBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  logo: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  langPill: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.itemBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    marginLeft: 4,
  },
});