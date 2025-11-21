import { StyleSheet } from "react-native";
export const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#b91c1c",
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%", // чтобы на маленьких экранах не залезать за пределы и был скролл
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  // внутренний контент ScrollView
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    padding: 8,
    color: COLORS.text,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeIcon: {
    fontSize: 20,
    color: "#6b7280",
  },

  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  foundCounter: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    marginBottom: 6,
  },
  optionActive: { backgroundColor: COLORS.primary },
  optionText: { color: COLORS.text },
  optionTextActive: { color: "#fff", fontWeight: "700" },
});
export default styles;
