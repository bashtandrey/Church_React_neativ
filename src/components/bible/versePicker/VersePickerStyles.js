import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C3D6E",
    textAlign: "center",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: "#5E7BA6",
    marginLeft: 10,
    marginTop: 5,
  },
  picker: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 8,
  },
  versePreview: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    fontSize: 16,
    color: "#2E4A6B",
    textAlign: "center",
  },

  // --- StepIndicator ---
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  stepActive: { backgroundColor: "#4CAF50" },
  stepInactive: { backgroundColor: "#D3D3D3" },
  stepNumber: { color: "white", fontWeight: "bold" },
  stepLine: { height: 3, flex: 1 },
  stepLineActive: { backgroundColor: "#4CAF50" },
  stepLineInactive: { backgroundColor: "#D3D3D3" },

  // --- Bottom bar ---
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#D6E9FF",
  },
  iconButton: {
    padding: 6,
  },
  previewContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 16,
  marginTop: 15,
},

previewCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 20,
  width: "100%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
  borderWidth: 1,
  borderColor: "#E0E8F9",
},

previewTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#1C3D6E",
  textAlign: "center",
  marginBottom: 10,
  textTransform: "uppercase",
  letterSpacing: 0.5,
},

verseScroll: {
  paddingVertical: 5,
},

verseText: {
  fontSize: 16,
  lineHeight: 24,
  color: "#2E4A6B",
  marginBottom: 8,
  textAlign: "left",
},

refContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
  borderTopWidth: 1,
  borderTopColor: "#E5ECF9",
  paddingTop: 8,
},

verseRef: {
  fontSize: 15,
  color: "#3B5BA7",
  fontWeight: "600",
  marginLeft: 6,
  textAlign: "center",
},
});