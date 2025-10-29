import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardIssued: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
    backgroundColor: "#FFF9F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serial: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  badgeIssued: {
    backgroundColor: "#FF950020",
  },
  badgeText: {
    fontSize: 13,
    color: "#FF9500",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
});