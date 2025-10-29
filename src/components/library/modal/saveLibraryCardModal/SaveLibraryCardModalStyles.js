import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  modalContent: {
    width: "95%", // ← было 90%, теперь шире
    maxWidth: 500, // ← ограничение для планшетов
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#222",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  // --- кнопки выбора режима (этап 1) ---
  choiceButton: {
    backgroundColor: "#118AB2",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  choiceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  choiceButtonAlt: {
    backgroundColor: "#06D6A0",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  choiceTextAlt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // --- список участников (этап 2) ---
  memberItem: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  memberText: {
    fontSize: 16,
    color: "#222",
  },

  manualButton: {
    marginTop: 16,
    alignSelf: "center",
  },
  manualText: {
    color: "#118AB2",
    fontWeight: "500",
    fontSize: 16,
    textDecorationLine: "underline",
  },

  // --- форма (этап 3) ---
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },

  memberInfo: {
    textAlign: "center",
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    flexWrap: "wrap",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#118AB2",
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 6,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#bbb",
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 6,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  selectButton: {
    flex: 1,
    backgroundColor: "#06D6A0",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 6,
    alignItems: "center",
  },
  selectText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  closeButton: {
  position: "absolute",
  top: 12,
  right: 12,
  zIndex: 10,
  backgroundColor: "rgba(230,57,70,0.1)", // лёгкий фон
  borderRadius: 20,
  padding: 6,
},
});
