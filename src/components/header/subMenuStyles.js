import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  white: "#FFFFFF",
  bg: "#0F172A",
  pill: "#1F2937",
  pillPressed: "#111827",
  fade: "rgba(15,23,42,0.6)",
  disabled: "rgba(255,255,255,0.35)",
  border: "rgba(255,255,255,0.15)",
};

const shadowIOS = {
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
};
const shadowAndroid = { elevation: 3 };

export default StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.bg,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  shadowIOS,
  shadowAndroid,

  scrollContent: {
    paddingHorizontal: 4,
    alignItems: "center",
  },

  item: {
    width: 40,
    height: 40,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: COLORS.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemPressed: { backgroundColor: COLORS.pillPressed },
  itemDisabled: {
    opacity: 0.5,
  },

  lockBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  edgeFade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 24,
    zIndex: 10,
  },
});