import { StyleSheet } from "react-native";

export default StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  id: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  iconsWrapper: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 4,
    borderRadius: 6,
  },
});