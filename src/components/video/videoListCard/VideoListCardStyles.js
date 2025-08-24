import { StyleSheet } from "react-native";

export default StyleSheet.create({
  listContainer: {
    padding: 10,
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6c757d",
    fontStyle: "italic",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  toggleSymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  monthBlock: {
    marginLeft: 10,
    marginBottom: 8,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e4e4e4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  monthHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
});
