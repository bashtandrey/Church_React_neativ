import { StyleSheet } from "react-native";

export default StyleSheet.create({
  verseContainer: {
    padding: 16,
    marginVertical: 12,
    backgroundColor: "#f0f4ff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },

  card: {
    alignItems: "flex-start",
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
    width: "100%",
  },

  pressed: { opacity: 0.85 },

  // заголовок в шапке карточки
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#007AFF",
    textAlign: "center",
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  copyButton: {
    marginRight: 8,
  },

  greeting: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 22,
    fontWeight: "bold",
    alignSelf: "stretch",
  },

  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },

  family: {
    width: "100%",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
    flexShrink: 1,
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
});
