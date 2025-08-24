// VerseCardPlanStyles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  dateCircle: {
    width: 30,
    height: 30,
    borderRadius: 24,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  versInfo: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#444",
  },
  iconContainer: {
    marginLeft: 12,
  },
});

export default styles;