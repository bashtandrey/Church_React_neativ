// src/components/PosterCardStyles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    padding: 10,
    backgroundColor: "#e9ecef",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9, // Пропорция 16:9, можно изменить по вкусу
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // contain 'cover'/'stretch'/'center'
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  idText: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 2,
    color: "blue",
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  iconDelete: {
    position: "absolute",
    top: 10,
    right: 40,
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 6,
    borderRadius: 20,
  },
  iconEdit: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 6,
    borderRadius: 20,
  },
  body: {
    padding: 10,
  },
  description: {
    color: "#17a2b8",
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  eventDate: {
    fontSize: 12,
    color: "#495057",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "red",
  },
  cancelText: {
    color: "#000",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
