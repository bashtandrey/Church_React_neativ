import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  readerHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  readerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  readerSub: {
    fontSize: 14,
    color: "#777",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  bookName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  historyDate: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 15,
  },
  btn: {
    marginTop: "auto",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  closeBtn: {
    backgroundColor: "#118AB2",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  activeBookItem: {
  borderLeftWidth: 4,
  borderLeftColor: "#FF3B30",
  backgroundColor: "#FFF5F5",
},
activeBookName: {
  color: "#D90429",
  fontWeight: "700",
},
notReturned: {
  color: "#D90429",
  fontWeight: "600",
},
});