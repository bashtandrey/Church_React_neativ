import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  roleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  roleText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 5,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
  },
  cancelText: {
    textAlign: "center",
    color: "#333",
  },
  saveText: {
    textAlign: "center",
    color: "#fff",
  },
});