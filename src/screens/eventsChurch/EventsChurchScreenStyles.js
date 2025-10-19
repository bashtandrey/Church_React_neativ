import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  headerContainer: {
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  createText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default styles;
