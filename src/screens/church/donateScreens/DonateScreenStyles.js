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
    backgroundColor: COLORS.bg,
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  /* HEADER */
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
  pressed: { opacity: 0.85 },

  /* SEARCH + COUNTER */
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
  counterText: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 12,
  },

  /* LOADING */
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

  /* КАРТОЧКА ПРОГРАММ */
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    ...shadow,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  balance: {
    fontSize: 16,
    fontWeight: "700",
  },

  /* ДЕЙСТВИЯ */
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
    gap: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtnText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
});

export default styles;