import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingTop: 6,
  },

  // Заголовок
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  createText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginHorizontal: 6,
  },

  filterScroll: {
    flexDirection: "row",
    paddingVertical: 4,
    marginBottom: 8,
    maxHeight: 44,
    flexGrow: 0, 
  },

  filterButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    height: 34,
    justifyContent: "center",
  },

  filterButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#E6F0FF",
  },

  filterText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "500",
    textAlignVertical: "center",
  },

  filterTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },

  // Список
  listContainer: {
    paddingBottom: 80,
  },

  // Пустой список
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 40,
  },
});

export default styles;