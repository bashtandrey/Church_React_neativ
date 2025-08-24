import { StyleSheet, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  preview: {
    width: "100%",
    height: ((screenWidth - 48) * 9) / 16, // отступы 24 слева и справа
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  openButton: {
    marginTop: 10,
    backgroundColor: "#FF0000", // красный цвет YouTube
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  openButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
