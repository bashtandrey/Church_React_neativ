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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serial: {
    fontSize: 14,
    color: "#007AFF", // синий акцент
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
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  badgeAvailable: {
    backgroundColor: "#34C75920",
  },
  badgeIssued: {
    backgroundColor: "#FF950020",
  },
  badgeText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  infoBlock: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  textSmall: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  textBold: {
    fontWeight: "600",
    color: "#111",
  },
  textDescription: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
    lineHeight: 18,
  },
  holderText: {
    fontSize: 13,
    marginTop: 8,
    color: "#007AFF",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
  },
});
