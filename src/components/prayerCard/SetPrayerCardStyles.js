import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    alignItems: "stretch", // вместо "center"
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
  },
  progressBarWrap: {
  height: 6,
  backgroundColor: "#e5e7eb",
  borderRadius: 6,
  marginBottom: 6,
  overflow: "hidden",
},

progressBarFill: {
  height: "100%",
  backgroundColor: "#10b981",
  borderRadius: 6,
},

progressText: {
  textAlign: "center",
  color: "#374151",
  marginBottom: 10,
  fontWeight: "600",
},

  greeting: {
    fontSize: 20,
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
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
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    backgroundColor: "#f8f8f8",
  },
  titlePicker: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});

export default styles;
