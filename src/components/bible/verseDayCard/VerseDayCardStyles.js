import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 6,
    borderLeftColor: "#4a90e2",
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  reference: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,

  },
  verse: {
    fontSize: 16,
    textAlign: "right",
    fontStyle: "italic",
    lineHeight: 26,
    color: "#777",
  },
  container: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
    textAlign: "center",
  },
  headerContainer: {
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  createText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  verseContainer: {
    padding: 16,
    marginVertical: 12,
    backgroundColor: "#f0f4ff", // нежный голубой фон
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // для Android
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 10,
    textAlign: "center",
  },
});
export default styles;