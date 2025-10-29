import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
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
  readerCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#118AB2",
  },
  bookCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  label: {
    fontSize: 13,
    color: "#666",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },
  sub: {
    fontSize: 14,
    color: "#888",
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: "#06D6A0",
  },
  cancelBtn: {
    backgroundColor: "#E63946",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
