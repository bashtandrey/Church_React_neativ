import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9, // Пропорция 16:9, можно изменить по вкусу
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // contain 'cover'/'stretch'/'center'
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageId: {
    position: "absolute",
    top: 8,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
    zIndex: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
