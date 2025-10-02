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
    maxHeight: "80%",          // 🔥 модалка занимает до 80% экрана по высоте
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
  scroll: { 
    maxHeight: 350,            // 🔥 увеличиваем область скролла
  },
  scrollContent: { 
    paddingBottom: 12,         // 🔥 добавляем запас снизу
  },

  roleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomColor: "#ddd", // 🔥 чуть заметнее разделитель
    borderBottomWidth: 1,
  },
  roleItemDisabled: {
    opacity: 0.5,
  },
  roleText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  roleTextDisabled: {
    color: "#888",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginRight: 5,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginLeft: 5,
  },
  cancelText: {
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  saveText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});