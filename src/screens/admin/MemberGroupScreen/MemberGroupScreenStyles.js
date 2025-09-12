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
  warn: "#F59E0B",
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
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...shadow,
    gap: 6,
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },

  pressed: { opacity: 0.85 },

  controls: {
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 10,
    height: 40,
    ...shadow,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: "#E8F0FE",
    borderColor: "#C7DBFF",
  },
  chipText: { color: COLORS.muted, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: COLORS.primary },

  counterText: {
    marginTop: 8,
    color: COLORS.muted,
    fontSize: 12,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 13,
  },

  // Modal
  modalWrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: COLORS.line,
    ...shadow,
  },
  modalCloseBtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  modalCloseText: {
    color: COLORS.text,
    fontWeight: "600",
  },
});

export default styles;