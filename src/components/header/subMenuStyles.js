import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  bg: "#0B2A4A",                    // совпадает с хедером из примера
  itemBg: "rgba(255,255,255,0.08)",
  itemBgPressed: "rgba(255,255,255,0.18)",
  border: "rgba(255,255,255,0.12)",
  divider: "rgba(255,255,255,0.10)",
  white: "#FFFFFF",
  fade: "rgba(11,42,74,0.9)",       // цвет для крайних градиентов
};

const EDGE_FADE_WIDTH = 24;

export default StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.divider,
    paddingVertical: 8,
    position: "relative",
  },

  // тень/поднятость
  shadowIOS: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  shadowAndroid: {
    elevation: 3,
  },

  scrollContent: {
    paddingHorizontal: 8,
    // используем gap через маргины у item
  },

  item: {
    height: 44,
    minWidth: 44,
    paddingHorizontal: 12,
    marginHorizontal: 6,           // «gap»
    borderRadius: 22,
    backgroundColor: COLORS.itemBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  itemPressed: {
    backgroundColor: COLORS.itemBgPressed,
  },

  // градиенты по краям как индикаторы переполнения
  edgeFade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: EDGE_FADE_WIDTH,
    zIndex: 1,
  },
});