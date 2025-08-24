import { StyleSheet } from "react-native";

export default StyleSheet.create({
  readingSection: {
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#007AFF",
  },

  readingPlan: {
    fontSize: 16,
    color: "#1a237e",
    fontWeight: "500",
    marginBottom: 8,
  },
  readingNote: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
   verseContainer: {
    padding: 10,
    marginVertical: 12,
    backgroundColor: "#f0f4ff", // нежный голубой фон
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // для Android
  },
});
