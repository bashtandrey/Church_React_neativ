import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },

  // SEARCH
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#f8fafc",
    marginBottom: 8,
  },

  // LIST ITEM
  verseCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  verseText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
    marginTop: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 15,
    marginTop: 20,
  },

  // PICKER + VERSE SELECTION MODAL
  picker: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 10,
  },
  versePreview: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 20,
    color: "#111827",
  },

  // BUTTONS
  buttonWrapper: {
    marginVertical: 8,
  },
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
stepActive: {
  backgroundColor: "#4CAF50",
},
stepInactive: {
  backgroundColor: "#D3D3D3",
},
stepNumber: {
  color: "white",
  fontWeight: "bold",
},
stepLine: {
  height: 3,
  flex: 1,
},
stepLineActive: {
  backgroundColor: "#4CAF50",
},
stepLineInactive: {
  backgroundColor: "#D3D3D3",
},
verseCard: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 12,
  marginHorizontal: 12,
  marginVertical: 6,
  borderWidth: 1,
  borderColor: "#e5e7eb",
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
},

verseRef: {
  fontWeight: "700",
  fontSize: 15,
  color: "#2563eb",
},

verseText: {
  marginTop: 6,
  fontSize: 15,
  lineHeight: 22,
  color: "#1f2937",
},

iconRow: {
  alignItems: "flex-end",
  marginTop: 10,
},

iconBtn: {
  backgroundColor: "#ecfdf5",
  borderRadius: 50,
  padding: 6,
},

subTitle: {
  marginLeft: 10,
  fontSize: 16,
  color: "#555",
},
iconRow: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: 10,
  gap: 12,
},
iconBtn: {
  padding: 4,
},

});
