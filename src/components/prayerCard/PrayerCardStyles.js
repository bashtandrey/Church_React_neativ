import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    alignItems: "flex-start",
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
    position: "relative",
    marginVertical: 10,
    width: "100%",
  },

  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#007AFF",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },

  family: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
    flexShrink: 1,
  },

  blessing: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 22,
  },

  quote: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
    lineHeight: 20,
  },

  source: {
    fontSize: 13,
    textAlign: "center",
    color: "#666",
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
    alignItems: "flex-start", // текст идет слева и переносится
    width: "100%", // контейнер занимает всю ширину
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
});
