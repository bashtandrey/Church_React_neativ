import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#555",
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  verseText: {
    fontSize: 18,
    fontStyle: "italic",
    marginVertical: 20,
    textAlign: "center",
    color: "#222",
    lineHeight: 24,
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
});