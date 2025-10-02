import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,

    // тень
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1C3D6E",
    marginRight: 10,
  },
  actions: {
    flexDirection: "row",
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  date: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "500",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});